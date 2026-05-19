import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function EntryOptionCard({
  title,
  description,
  iconName,
  featured = false,
  onPress
}) {
  return (
    <Pressable onPress={onPress} style={[styles.card, featured && styles.featuredCard]}>
      <Feather color={featured ? colors.pageBackground : colors.woodPrimary} name={iconName} size={30} />
      <View style={styles.textWrap}>
        <Text style={[styles.title, featured && styles.featuredTitle]}>{title}</Text>
        {!!description && (
          <Text style={[styles.description, featured && styles.featuredDescription]}>
            {description}
          </Text>
        )}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    backgroundColor: colors.mutedCardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    flex: 1,
    gap: spacing.sm,
    minHeight: 136,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xl
  },
  featuredCard: {
    backgroundColor: colors.woodPrimary,
    minHeight: 213,
    ...shadows.soft
  },
  textWrap: {
    alignItems: 'center',
    gap: 8
  },
  title: {
    color: colors.woodPrimary,
    fontSize: 18,
    fontWeight: '700'
  },
  featuredTitle: {
    color: colors.pageBackground,
    letterSpacing: 1.8
  },
  description: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center'
  },
  featuredDescription: {
    color: 'rgba(251, 249, 248, 0.7)'
  }
})
