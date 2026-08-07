import { expect, test } from '@playwright/test'

const viewports = [
  { name: 'desktop', width: 1280, height: 800 },
  { name: 'mobile', width: 390, height: 844 }
]

for (const viewport of viewports) {
  test(`白事档案和存储设置适配${viewport.name}视口`, async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.setViewportSize(viewport)
    await page.addInitScript(() => localStorage.setItem('yl_token', 'e2e-token'))

    await page.goto('/#/pages-funeral/index/index')
    await expect(page.locator('.new-btn')).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)

    await page.locator('.new-btn').click()
    await expect(page.locator('.modal-panel')).toBeVisible()
    await page.locator('.field-input input').first().fill('测试档案')
    await page.locator('.modal-button.primary').click()

    await expect(page.locator('.case-summary')).toBeVisible()
    await expect(page.locator('.step-row')).toHaveCount(5)
    await expect(page.locator('.proof-group')).toHaveCount(10)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)

    await page.goto('/#/pages-funeral/storage/index')
    await expect(page.locator('.save-button')).toBeVisible()
    await expect(page.locator('.location-option')).toHaveCount(3)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
    expect(pageErrors).toEqual([])
  })
}
