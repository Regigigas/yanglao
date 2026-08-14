import { expect, test } from '@playwright/test'

async function prepareChatPage(page) {
  await page.setViewportSize({ width: 320, height: 700 })
  await page.addInitScript(() => {
    localStorage.setItem('yl_token', 'e2e-token')
    localStorage.setItem('yl_font_size', 'xl')
  })
}

function json(route, body, status = 200) {
  return route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body)
  })
}

test('聊天连接失败后可在页面内重试', async ({ page }) => {
  await prepareChatPage(page)
  const pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  let profileAttempts = 0

  await page.route('**/system/chat/me**', (route) => {
    profileAttempts += 1
    if (profileAttempts === 1) return json(route, { msg: '聊天入口不可用' }, 503)
    return json(route, { code: 200, data: { userId: 9 } })
  })
  await page.route('**/system/chat/conversations**', (route) => json(route, {
    code: 200,
    data: [{
      conversationId: 42,
      name: '护理协作群',
      type: 'G',
      unreadCount: 1,
      lastMessagePreview: '请确认晨间任务',
      lastMessageTime: '2026-08-11T08:30:00'
    }]
  }))

  await page.goto('/#/pages-chat/index/index')
  await expect(page.getByText(/聊天入口不可用.*聊天连接设置/)).toBeVisible()
  await page.locator('.retry-link').click()
  await expect(page.getByText('护理协作群')).toBeVisible()
  expect(profileAttempts).toBe(2)
  expect(pageErrors).toEqual([])
})

test('消息重试和多行输入在 320px 下不遮挡内容', async ({ page }) => {
  await prepareChatPage(page)
  let messageAttempts = 0

  await page.route('**/system/chat/me**', (route) => json(route, { code: 200, data: { userId: 9 } }))
  await page.route('**/system/chat/conversations', (route) => json(route, {
    code: 200,
    data: [{
      conversationId: 42,
      name: '护理协作群',
      type: 'G',
      unreadCount: 1,
      lastMessagePreview: '请确认晨间任务',
      lastMessageTime: '2026-08-11T08:30:00'
    }]
  }))
  await page.route('**/system/chat/conversations/42/messages**', (route) => {
    messageAttempts += 1
    if (messageAttempts === 1) return json(route, { msg: '消息读取失败' }, 503)
    return json(route, {
      code: 200,
      data: [{
        messageId: 101,
        senderUserId: 8,
        senderName: '值班护士',
        content: '请确认晨间护理任务',
        createTime: '2026-08-11T08:31:00'
      }]
    })
  })
  await page.route('**/system/chat/conversations/42/read', (route) => json(route, { code: 200, data: null }))

  await page.goto('/#/pages-chat/index/index')
  await page.getByText('护理协作群').click()
  await expect(page.getByText(/消息读取失败.*稍后重试/)).toBeVisible()
  await page.getByText('重新加载').click()
  await expect(page.getByText('请确认晨间护理任务')).toBeVisible()

  const input = page.locator('.message-input textarea')
  await input.fill('第一行护理反馈\n第二行生命体征正常\n第三行已完成服药提醒\n第四行等待复核')
  const messageList = await page.locator('.message-list').boundingBox()
  const composer = await page.locator('.composer').boundingBox()
  const inputBox = await page.locator('.message-input').boundingBox()

  expect(messageAttempts).toBe(2)
  expect(messageList).not.toBeNull()
  expect(composer).not.toBeNull()
  if (messageList && composer) {
    expect(messageList.y + messageList.height).toBeLessThanOrEqual(composer.y + 1)
    expect(composer.y + composer.height).toBeLessThanOrEqual(701)
  }
  expect(inputBox?.height || 0).toBeGreaterThanOrEqual(44)
  expect(inputBox?.height || 0).toBeLessThanOrEqual(121)
  expect(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)).toBe(false)
})
