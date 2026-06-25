import { StyleSheet, Text, View } from 'react-native'

import { colors, radius, spacing } from '../../styles/theme'

export default function SearchEmptyState({ title = '没有找到匹配的物品', description = '换个关键词试试，或先去录入' }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    gap: spacing.sm,
    padding: spacing.xl
  },
  icon: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    height: 64,
    width: 64
  },
  title: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700'
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center'
  }
})

