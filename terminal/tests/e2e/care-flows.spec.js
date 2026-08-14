import { expect, test } from '@playwright/test'

async function prepareMobilePage(page) {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.addInitScript(() => {
    localStorage.setItem('yl_token', 'e2e-token')
    localStorage.setItem('yl_font_size', 'xl')
  })
}

test('护理记录弹层在小屏和超大字体下完整可操作', async ({ page }) => {
  await prepareMobilePage(page)
  await page.route('**/care/record/list**', (route) => route.fulfill({
    status: 200,
    contentType: 'application/json',
    body: JSON.stringify({ code: 200, rows: [] })
  }))

  await page.goto('/#/pages-care/records/index')
  await page.locator('.add-btn').click()
  await expect(page.locator('.modal-mask')).toBeVisible()
  await expect(page.locator('.modal-btn.confirm')).toBeVisible()

  const maskPosition = await page.locator('.modal-mask').evaluate((element) => getComputedStyle(element).position)
  const modal = await page.locator('.modal-card').boundingBox()
  expect(maskPosition).toBe('fixed')
  expect(modal).not.toBeNull()
  if (modal) {
    expect(modal.y).toBeGreaterThanOrEqual(0)
    expect(modal.y + modal.height).toBeLessThanOrEqual(701)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
})

test('护理任务支持失败重试且快速连点只更新一次', async ({ page }) => {
  await prepareMobilePage(page)
  let listAttempts = 0
  let startRequests = 0

  await page.route('**/care/task/list**', (route) => {
    listAttempts += 1
    if (listAttempts === 1) {
      return route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ msg: '护理服务暂不可用' })
      })
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        code: 200,
        rows: [{
          taskId: 1,
          taskName: '晨间生命体征检查',
          elderlyName: '王奶奶',
          planTime: '08:30',
          remark: '测量体温与血压',
          status: 'pending'
        }]
      })
    })
  })
  await page.route('**/care/task/start/1', async (route) => {
    startRequests += 1
    await new Promise((resolve) => setTimeout(resolve, 200))
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 200, data: null })
    })
  })

  await page.goto('/#/pages-care/tasks/index')
  await expect(page.getByText('护理任务加载失败，请检查网络后重试')).toBeVisible()
  await page.getByText('重新加载').click()
  await expect(page.getByText('晨间生命体征检查')).toBeVisible()

  await page.locator('.btn-start').evaluate((element) => {
    element.click()
    element.click()
  })
  await expect(page.locator('.btn-start')).toContainText('处理中...')
  await expect(page.getByText('执行中')).toHaveCount(2)
  expect(startRequests).toBe(1)
  expect(listAttempts).toBe(2)
})
