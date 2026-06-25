import { render } from '@testing-library/react-native'
import BottomTabBar from '../components/layout/BottomTabBar'

jest.mock('@expo/vector-icons', () => {
  const React = require('react')
  const { Text: MockText } = require('react-native')

  return {
    Feather: ({ name }) => React.createElement(MockText, null, name)
  }
})

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({
    bottom: 0,
    left: 0,
    right: 0,
    top: 0
  })
}))

const state = {
  index: 1,
  routes: [
    { key: 'home-key', name: 'HomeDashboard' },
    { key: 'entry-key', name: 'ItemEntrySelection' },
    { key: 'search-key', name: 'ItemSearch' },
    { key: 'inventory-key', name: 'InventoryList' }
  ]
}

const descriptors = state.routes.reduce((descriptorMap, route) => {
  return {
    ...descriptorMap,
    [route.key]: {
      options: {
        tabBarAccessibilityLabel: route.name
      }
    }
  }
}, {})

describe('BottomTabBar', () => {
  it('渲染四个底部栏按钮并标记当前选中项', () => {
    const navigation = {
      emit: jest.fn(() => ({ defaultPrevented: false })),
      navigate: jest.fn()
    }

    const { getByTestId } = render(
      <BottomTabBar descriptors={descriptors} navigation={navigation} state={state} />
    )

    expect(getByTestId('bottom-tab-HomeDashboard')).toBeTruthy()
    expect(getByTestId('bottom-tab-ItemEntrySelection').props.accessibilityState).toEqual({
      selected: true
    })
    expect(getByTestId('bottom-tab-ItemSearch').props.accessibilityState).toEqual({})
  })
})
