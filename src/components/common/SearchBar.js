import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function SearchBar({
  placeholder,
  variant = 'outlined',
  onVoicePress,
  onScanPress
}) {
  return (
    <View style={styles.row}>
      <View style={[styles.inputShell, variant === 'filled' && styles.inputShellFilled]}>
        <Text style={styles.placeholder}>{placeholder}</Text>
      </View>
      <Pressable onPress={onVoicePress} style={styles.iconButton}>
        <Feather color={colors.woodPrimary} name='mic' size={18} />
      </Pressable>
      <Pressable onPress={onScanPress} style={styles.iconButton}>
        <Feather color={colors.woodPrimary} name='sliders' size={18} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  inputShell: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.pill,
    borderWidth: 2,
    flex: 1,
    minHeight: 60,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    ...shadows.soft
  },
  inputShellFilled: {
    borderWidth: 1
  },
  placeholder: {
    color: colors.inputPlaceholder,
    fontSize: 18,
    fontWeight: '500'
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.pill,
    height: 48,
    justifyContent: 'center',
    width: 48
  }
})
