import { expect, test } from '@playwright/test'

test('H5 小屏明确提示并禁用原生设备连接', async ({ page }) => {
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.setViewportSize({ width: 320, height: 700 })
  await page.addInitScript(() => {
    localStorage.setItem('yl_token', 'e2e-token')
    localStorage.setItem('yl_font_size', 'xl')
  })

  await page.goto('/#/pages-device/connect/index')
  await expect(page.getByText('蓝牙和 WiFi 扫描仅支持移动端 App，请在手机 App 中操作')).toBeVisible()
  await expect(page.getByText('请使用移动端 App 连接设备')).toBeVisible()

  const bluetoothScan = page.locator('.scan-btn').first()
  await expect(bluetoothScan).toHaveClass(/disabled/)
  expect(await bluetoothScan.evaluate((element) => getComputedStyle(element).pointerEvents)).toBe('none')

  await page.getByText('WiFi 连接').click()
  await expect(page.getByText('请使用移动端 App 扫描 WiFi')).toBeVisible()
  await expect(page.locator('.scan-btn')).toHaveClass(/disabled/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
  expect(pageErrors).toEqual([])
})
