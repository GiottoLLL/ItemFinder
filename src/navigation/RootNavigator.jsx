import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import MainTabs from './MainTabs'
import ItemEntryFormScreen from '../pages/entry/ItemEntryFormScreen'
import ItemDetailScreen from '../pages/inventory/ItemDetailScreen'
import StorageSpaceListScreen from '../pages/storage/StorageSpaceListScreen'
import AuthLoginScreen from '../pages/auth/AuthLoginScreen'

const Stack = createNativeStackNavigator()

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen component={MainTabs} name='MainTabs' />
        <Stack.Screen component={ItemEntryFormScreen} name='ItemEntryForm' />
        <Stack.Screen component={ItemDetailScreen} name='ItemDetail' />
        <Stack.Screen component={StorageSpaceListScreen} name='StorageSpaceList' />
        <Stack.Screen component={AuthLoginScreen} name='AuthLogin' />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
