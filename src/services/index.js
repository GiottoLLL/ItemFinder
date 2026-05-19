import { createPromiseTask } from '../utils'

const mockDelay = callback =>
  createPromiseTask(
    () =>
      new Promise(resolve => {
        setTimeout(() => {
          resolve(callback())
        }, 120)
      })
  )

export function fetchHomeStatistics() {
  return mockDelay(() => ({
    totalCount: 50,
    mostUsedItemName: '纸巾',
    distributionList: [
      { id: 'living-room', name: '客厅', percentage: 40 },
      { id: 'bedroom', name: '卧室', percentage: 35 },
      { id: 'kitchen', name: '厨房', percentage: 25 }
    ]
  }))
}

export function fetchSearchSuggestions() {
  return mockDelay(() => ({
    aiCards: [
      {
        id: 'location-card',
        type: 'location',
        title: '寻找的物品：黑色笔记本',
        description: '在书房抽屉第二层'
      },
      {
        id: 'stock-card',
        type: 'stock',
        title: '物品库存',
        description: '洗衣液还剩 2 瓶，建议补货量 3 瓶'
      }
    ],
    historyKeywords: ['充电线', '酱油瓶', '护照']
  }))
}

export function fetchInventoryCards() {
  return mockDelay(() => [
    { id: 'coffee', name: '咖啡豆', percent: 65, storageSpaceName: '客厅边柜' },
    { id: 'tissue', name: '抽纸', percent: 20, storageSpaceName: '客厅电视柜' },
    { id: 'soap', name: '洗洁精', percent: 90, storageSpaceName: '厨房水槽下方' },
    { id: 'cream', name: '护手霜', percent: 45, storageSpaceName: '卧室床头柜' }
  ])
}
