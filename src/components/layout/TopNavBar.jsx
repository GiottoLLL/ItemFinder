import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, spacing } from '../../styles/theme'

export default function TopNavBar({
  title = '物归处',
  leftIconName = 'menu',
  rightIconName = 'bell',
  onPressLeft,
  onPressRight
}) {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPressLeft} style={styles.iconButton}>
        <Feather color={colors.woodPrimary} name={leftIconName} size={18} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable onPress={onPressRight} style={styles.iconButton}>
        <Feather color={colors.woodPrimary} name={rightIconName} size={18} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'rgba(251, 249, 248, 0.8)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: -spacing.lg,
    paddingHorizontal: 25,
    paddingVertical: 8
  },
  iconButton: {
    alignItems: 'center',
    height: 40,
    justifyContent: 'center',
    width: 40
  },
  title: {
    color: colors.woodPrimary,
    fontFamily: 'System',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.4
  }
})
