import { expect, test } from '@playwright/test'
import { join } from 'path'

const viewports = [
  { width: 320, height: 700 },
  { width: 375, height: 812 },
  { width: 430, height: 932 }
]

for (const viewport of viewports) {
  test(`手机基础壳层适配 ${viewport.width}px`, async ({ page }) => {
    const pageErrors = []
    page.on('pageerror', (error) => pageErrors.push(error.message))
    await page.setViewportSize(viewport)
    await page.addInitScript(() => {
      localStorage.setItem('yl_token', 'e2e-token')
      localStorage.setItem('yl_font_size', 'xl')
    })
    await page.route('http://192.168.1.100:8080/**', (route) => route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ code: 200, rows: [], data: [] })
    }))

    await page.goto('/#/pages/index/index')
    await expect(page.locator('.nav-bar')).toHaveCount(1)
    await expect(page.locator('.tab-bar')).toBeVisible()

    const initialUrl = page.url()
    await page.locator('.nav-left').click()
    expect(page.url()).toBe(initialUrl)
    expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)

    const tabBar = await page.locator('.tab-bar').boundingBox()
    expect(tabBar).not.toBeNull()
    if (tabBar) {
      expect(tabBar.height).toBeGreaterThanOrEqual(44)
      expect(tabBar.y + tabBar.height).toBeLessThanOrEqual(viewport.height + 1)
    }

    const quickItems = await page.locator('.quick-item').all()
    expect(quickItems.length).toBeGreaterThan(8)
    const firstItem = await quickItems[0].boundingBox()
    expect(firstItem?.width || 0).toBeGreaterThan(100)
    expect(pageErrors).toEqual([])

    if (viewport.width === 320) {
      await page.screenshot({
        path: join(process.env.TEMP || '.', 'yanglao-mobile-shell-320.png'),
        fullPage: true
      })
    }
  })
}
