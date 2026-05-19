export function normalizeKeyword(keyword) {
  return String(keyword || '').trim().toLowerCase()
}

export function formatQuantityText(quantity, unit = '个') {
  return `${quantity}${unit}`
}

export function buildStoragePathText(spaceNames = []) {
  return spaceNames.filter(Boolean).join(' / ')
}

export function safeParseJson(rawValue, fallbackValue = null) {
  try {
    return JSON.parse(rawValue)
  } catch (_error) {
    return fallbackValue
  }
}

export function createPromiseTask(taskExecutor) {
  return Promise.resolve()
    .then(taskExecutor)
    .catch(error => {
      console.warn('任务执行失败', error)
      throw error
    })
}
