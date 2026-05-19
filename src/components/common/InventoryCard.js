import { StyleSheet, Text, View } from 'react-native'

import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function InventoryCard({ itemName, percent, storageSpaceName }) {
  return (
    <View style={styles.card}>
      <View style={styles.preview} />
      <View style={styles.infoWrap}>
        <Text style={styles.itemName}>{itemName}</Text>
        <View style={styles.progressMeta}>
          <View>
            <Text style={styles.metaLabel}>库存量</Text>
            <Text style={styles.storageText}>{storageSpaceName}</Text>
          </View>
          <Text style={styles.percentText}>{percent}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressValue, { width: `${percent}%` }]} />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    gap: spacing.md,
    padding: spacing.md,
    ...shadows.soft
  },
  preview: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.md,
    height: 168
  },
  infoWrap: {
    gap: spacing.sm
  },
  itemName: {
    color: colors.textPrimary,
    fontSize: 22,
    fontWeight: '700'
  },
  progressMeta: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  metaLabel: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 4
  },
  storageText: {
    color: colors.textSecondary,
    fontSize: 14
  },
  percentText: {
    color: colors.woodPrimary,
    fontSize: 22,
    fontWeight: '700'
  },
  progressTrack: {
    backgroundColor: colors.chipBackground,
    borderRadius: radius.pill,
    height: 12,
    overflow: 'hidden'
  },
  progressValue: {
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    height: '100%'
  }
})
