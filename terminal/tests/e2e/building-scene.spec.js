import { expect, test } from '@playwright/test'
import { join } from 'path'

const scene = {
  buildings: [{ id: 'building-a', name: '护理一号楼', floors: 3 }],
  rooms: [
    { id: 'room-101', building_id: 'building-a', floor: 1, room_no: '101', status: 'occupied' },
    { id: 'room-201', building_id: 'building-a', floor: 2, room_no: '201', status: 'available' },
    { id: 'room-301', building_id: 'building-a', floor: 3, room_no: '301', status: 'maintenance' }
  ],
  beds: [
    { id: 'bed-101-a', room_id: 'room-101', bed_no: 'A', status: 'occupied' },
    { id: 'bed-101-b', room_id: 'room-101', bed_no: 'B', status: 'available' },
    { id: 'bed-201-a', room_id: 'room-201', bed_no: 'A', status: 'available' },
    { id: 'bed-301-a', room_id: 'room-301', bed_no: 'A', status: 'maintenance' }
  ]
}

async function openScene(page, viewport) {
  await page.setViewportSize(viewport)
  await page.addInitScript(() => {
    window.__YANGLAO_E2E__ = true
    localStorage.setItem('yl_token', 'e2e-business-token')
    localStorage.setItem('yl_chat_mode', 'local')
    localStorage.setItem('yl_chat_local_url', 'http://127.0.0.1:7788')
    localStorage.setItem('yl_chat_local_token', 'e2e-chat-token')
  })
  await page.route('http://127.0.0.1:7788/system/scene/buildings', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ code: 200, msg: '操作成功', data: scene })
  }))
  await page.goto('/#/pages-scene/building/index')
  await expect(page.locator('.scene-viewport canvas')).toBeVisible()
  await expect(page.locator('.picker-text')).toHaveText('护理一号楼')
  await page.waitForTimeout(800)
}

async function canvasSignature(page) {
  return page.locator('.scene-viewport canvas').evaluate((canvas) => {
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
    if (!gl) return { colored: 0, checksum: 0, width: canvas.width, height: canvas.height }
    const width = Math.min(96, canvas.width)
    const height = Math.min(96, canvas.height)
    const pixels = new Uint8Array(width * height * 4)
    gl.readPixels(
      Math.max(0, Math.floor((canvas.width - width) / 2)),
      Math.max(0, Math.floor((canvas.height - height) / 2)),
      width,
      height,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      pixels
    )
    let colored = 0
    let checksum = 0
    for (let index = 0; index < pixels.length; index += 4) {
      if (pixels[index + 3] && (pixels[index] !== pixels[index + 1] || pixels[index + 1] !== pixels[index + 2])) colored += 1
      checksum = (checksum + pixels[index] * 3 + pixels[index + 1] * 5 + pixels[index + 2] * 7) % 2147483647
    }
    return { colored, checksum, width: canvas.width, height: canvas.height }
  })
}

test('3D楼栋支持视角切换与鼠标拖动', async ({ page }) => {
  await openScene(page, { width: 1280, height: 800 })
  const initial = await canvasSignature(page)
  expect(initial.width).toBeGreaterThan(900)
  expect(initial.height).toBeGreaterThan(500)
  expect(initial.colored).toBeGreaterThan(1200)

  await page.locator('.view-button', { hasText: '侧面' }).click()
  await page.waitForTimeout(500)
  const side = await canvasSignature(page)
  expect(side.checksum).not.toBe(initial.checksum)

  const canvas = page.locator('.scene-viewport canvas')
  const box = await canvas.boundingBox()
  expect(box).not.toBeNull()
  if (box) {
    await page.mouse.move(box.x + box.width * 0.52, box.y + box.height * 0.52)
    await page.mouse.down()
    await page.mouse.move(box.x + box.width * 0.7, box.y + box.height * 0.43, { steps: 5 })
    await page.mouse.up()
  }
  await page.waitForTimeout(400)
  expect((await canvasSignature(page)).checksum).not.toBe(side.checksum)
  await page.screenshot({ path: join(process.env.TEMP || '.', 'yanglao-3d-desktop.png'), fullPage: true })
})

test('手机视口中的画布和四视角控件无重叠', async ({ page }) => {
  await openScene(page, { width: 390, height: 844 })
  const toolbar = await page.locator('.scene-toolbar').boundingBox()
  const viewport = await page.locator('.scene-viewport').boundingBox()
  const buttons = await page.locator('.view-modes').boundingBox()
  expect(toolbar).not.toBeNull()
  expect(viewport).not.toBeNull()
  expect(buttons).not.toBeNull()
  if (toolbar && viewport && buttons) {
    expect(buttons.x).toBeGreaterThanOrEqual(toolbar.x)
    expect(buttons.x + buttons.width).toBeLessThanOrEqual(toolbar.x + toolbar.width + 1)
    expect(viewport.y).toBeGreaterThanOrEqual(toolbar.y + toolbar.height - 1)
  }
  expect((await canvasSignature(page)).colored).toBeGreaterThan(700)
  await page.locator('.view-button', { hasText: '俯视' }).click()
  await page.waitForTimeout(400)
  await page.screenshot({ path: join(process.env.TEMP || '.', 'yanglao-3d-mobile.png'), fullPage: true })
})
