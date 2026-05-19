import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import BottomTabBar from '../components/layout/BottomTabBar'
import ItemEntrySelectionScreen from '../pages/entry/ItemEntrySelectionScreen'
import HomeDashboardScreen from '../pages/home/HomeDashboardScreen'
import InventoryListScreen from '../pages/inventory/InventoryListScreen'
import ItemSearchScreen from '../pages/search/ItemSearchScreen'

const Tab = createBottomTabNavigator()

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='HomeDashboard'
        screenOptions={{
          headerShown: false
        }}
        tabBar={props => <BottomTabBar {...props} />}
      >
        <Tab.Screen component={HomeDashboardScreen} name='HomeDashboard' />
        <Tab.Screen component={ItemEntrySelectionScreen} name='ItemEntrySelection' />
        <Tab.Screen component={ItemSearchScreen} name='ItemSearch' />
        <Tab.Screen component={InventoryListScreen} name='InventoryList' />
      </Tab.Navigator>
    </NavigationContainer>
  )
}
