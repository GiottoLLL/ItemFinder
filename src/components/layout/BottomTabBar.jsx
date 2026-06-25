import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors, radius, shadows } from '../../styles/theme'

const tabConfigList = [
  { routeName: 'HomeDashboard', iconName: 'home' },
  { routeName: 'ItemEntrySelection', iconName: 'plus-square' },
  { routeName: 'ItemSearch', iconName: 'search' },
  { routeName: 'InventoryList', iconName: 'grid' }
]

export default function BottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[styles.shell, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {state.routes.map((route, index) => {
        const descriptor = descriptors[route.key]
        const options = descriptor?.options || {}
        const tabConfig = tabConfigList.find(item => item.routeName === route.name) || tabConfigList[index]
        const isFocused = state.index === index

        const handlePress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <Pressable
            accessibilityLabel={options.tabBarAccessibilityLabel || route.name}
            accessibilityRole='button'
            accessibilityState={isFocused ? { selected: true } : {}}
            key={route.key}
            onPress={handlePress}
            style={[styles.tabButton, isFocused && styles.tabButtonActive]}
            testID={`bottom-tab-${route.name}`}
          >
            <Feather
              color={isFocused ? colors.woodPrimary : colors.textMuted}
              name={tabConfig.iconName}
              size={18}
            />
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  shell: {
    backgroundColor: colors.whiteOverlay,
    borderColor: colors.borderLight,
    borderTopWidth: 1,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    flexDirection: 'row',
    gap: 17.5,
    justifyContent: 'space-between',
    paddingHorizontal: 24.75,
    paddingTop: 16,
    ...shadows.floating
  },
  tabButton: {
    alignItems: 'center',
    borderRadius: radius.pill,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 64,
    paddingHorizontal: 24,
    paddingVertical: 8
  },
  tabButtonActive: {
    backgroundColor: colors.accentBlue
  }
})
