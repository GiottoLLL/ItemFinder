import { Feather } from '@expo/vector-icons'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import ModalMask from '../layout/ModalMask'
import { colors, radius, shadows, spacing } from '../../styles/theme'
import { warningActionDict } from '../../dict'

export default function InventoryWarningModal({
  visible,
  warningList = [],
  onRequestClose,
  onMuteAll
}) {
  return (
    <ModalMask onRequestClose={onRequestClose} visible={visible}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Feather color={colors.textMuted} name='alert-circle' size={18} />
            <Text style={styles.title}>库存预警</Text>
          </View>
        </View>

        <View style={styles.body}>
          {warningList.map(item => (
            <View key={item.id} style={styles.alertRow}>
              <Feather color={colors.woodPrimary} name='droplet' size={18} />
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>{item.name}</Text>
                <Text style={styles.alertDesc}>{item.description}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Pressable onPress={onRequestClose} style={[styles.button, styles.secondaryButton]}>
            <Text style={styles.secondaryText}>{warningActionDict.remindLater}</Text>
          </Pressable>
          <Pressable onPress={onMuteAll} style={[styles.button, styles.primaryButton]}>
            <Text style={styles.primaryText}>{warningActionDict.muteWarning}</Text>
          </Pressable>
        </View>
      </View>
    </ModalMask>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadows.soft
  },
  header: {
    paddingBottom: spacing.md
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: spacing.sm
  },
  title: {
    color: colors.textPrimary,
    fontSize: 20,
    fontWeight: '700'
  },
  body: {
    gap: spacing.sm,
    paddingBottom: spacing.lg
  },
  alertRow: {
    alignItems: 'center',
    borderColor: colors.accentBlueBorder,
    borderRadius: 48,
    borderWidth: 1,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm
  },
  alertText: {
    flex: 1,
    gap: 2
  },
  alertTitle: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '700'
  },
  alertDesc: {
    color: colors.textSecondary,
    fontSize: 12
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    justifyContent: 'space-between'
  },
  button: {
    alignItems: 'center',
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 14
  },
  secondaryButton: {
    backgroundColor: colors.cardBackground,
    borderColor: colors.borderLight,
    borderWidth: 1
  },
  secondaryText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '700'
  },
  primaryButton: {
    backgroundColor: colors.accentBlue
  },
  primaryText: {
    color: colors.woodPrimary,
    fontSize: 14,
    fontWeight: '700'
  }
})
