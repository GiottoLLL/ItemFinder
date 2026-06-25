import { createPromiseTask } from '../utils'
import {
  addItem,
  addStorageSpace,
  getItemDetail,
  getInventoryList,
  getInventoryWarnings,
  getStorageSpaceList,
  initializeDatabase,
  muteWarningForItem
} from './db/database'

export function initializeAppDatabase() {
  return initializeDatabase()
}

export function fetchStorageSpaces() {
  return createPromiseTask(() => getStorageSpaceList())
}

export function createStorageSpace(spaceName) {
  return createPromiseTask(() => addStorageSpace(spaceName))
}

export function createItem(payload) {
  return createPromiseTask(() => addItem(payload))
}

export function fetchInventoryList(options = {}) {
  return createPromiseTask(() => getInventoryList(options))
}

export function fetchItemDetail(itemId) {
  return createPromiseTask(() => getItemDetail(itemId))
}

export function fetchInventoryCards(options = {}) {
  return fetchInventoryList(options).then(list =>
    list.map(item => {
      const percent = Math.max(0, Math.min(100, Math.round((Number(item.quantity) / 6) * 100)))
      return {
        id: item.id,
        name: item.name,
        percent,
        storageSpaceName: item.storageSpaceName
      }
    })
  )
}

export function fetchHomeStatistics() {
  return Promise.all([fetchInventoryList(), fetchStorageSpaces()]).then(([items, spaces]) => {
    const totalCount = items.length
    const mostUsedItemName = items[0]?.name || '--'

    const spaceCountMap = items.reduce((acc, item) => {
      const key = String(item.storageSpaceId)
      return { ...acc, [key]: (acc[key] || 0) + 1 }
    }, {})

    const distributionList = spaces
      .map(space => {
        const count = spaceCountMap[String(space.id)] || 0
        return { id: space.id, name: space.name, count }
      })
      .filter(item => item.count > 0)

    const totalInDistribution = distributionList.reduce((sum, item) => sum + item.count, 0) || 1

    return {
      totalCount,
      mostUsedItemName,
      distributionList: distributionList.map(item => ({
        id: item.id,
        name: item.name,
        percentage: Math.round((item.count / totalInDistribution) * 100)
      }))
    }
  })
}

export function fetchInventoryWarnings() {
  return createPromiseTask(() => getInventoryWarnings())
}

export function muteWarnings(itemIdList = []) {
  return itemIdList.reduce((promiseChain, itemId) => {
    return promiseChain.then(() => muteWarningForItem(itemId))
  }, Promise.resolve())
}

export function fetchSearchSuggestions() {
  return createPromiseTask(() =>
    Promise.resolve({
      aiCards: [],
      historyKeywords: []
    })
  )
}
