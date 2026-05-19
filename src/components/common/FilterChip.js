import { Pressable, StyleSheet, Text } from 'react-native'

import { colors, radius, spacing } from '../../styles/theme'

export default function FilterChip({ label, active = false, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.label, active && styles.labelActive]}>{label}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 10
  },
  chipActive: {
    backgroundColor: colors.woodPrimary
  },
  label: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: '600'
  },
  labelActive: {
    color: colors.pageBackground
  }
})
