import { StyleSheet, Text, View } from 'react-native'

import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function StatCard({ eyebrow, title, value, variant = 'default' }) {
  const isAccent = variant === 'accent'

  return (
    <View style={[styles.card, isAccent && styles.cardAccent]}>
      <View style={styles.eyebrowRow}>
        <View style={styles.eyebrowDot} />
        <Text style={styles.eyebrowText}>{eyebrow}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderColor: 'rgba(211, 229, 240, 0.3)',
    borderRadius: radius.xl,
    borderWidth: 1,
    minHeight: 186,
    padding: spacing.xl,
    ...shadows.soft
  },
  cardAccent: {
    backgroundColor: '#F6FAFD'
  },
  eyebrowRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  eyebrowDot: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    height: 18,
    marginRight: spacing.sm,
    width: 18
  },
  eyebrowText: {
    color: colors.textSecondary,
    flex: 1,
    fontSize: 16,
    fontWeight: '600'
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.xl
  },
  title: {
    color: colors.textMuted,
    fontSize: 24,
    fontWeight: '600'
  },
  value: {
    color: colors.woodPrimary,
    fontSize: 38,
    fontWeight: '700'
  }
})
