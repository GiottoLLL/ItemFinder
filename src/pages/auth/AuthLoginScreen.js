import { useState } from 'react'
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'

import PageContainer from '../../components/layout/PageContainer'
import TopNavBar from '../../components/layout/TopNavBar'
import { colors, radius, shadows, spacing } from '../../styles/theme'

export default function AuthLoginScreen() {
  const navigation = useNavigation()
  const [mode, setMode] = useState('password')

  return (
    <PageContainer backgroundColor={colors.pageBackground}>
      <TopNavBar leftIconName='arrow-left' onPressLeft={() => navigation.goBack()} rightIconName='x' onPressRight={() => navigation.goBack()} />
      <View style={styles.main}>
        <Text style={styles.title}>登录</Text>

        <View style={styles.switchRow}>
          <Pressable onPress={() => setMode('password')} style={[styles.switchButton, mode === 'password' && styles.switchActive]}>
            <Text style={[styles.switchText, mode === 'password' && styles.switchTextActive]}>账号密码</Text>
          </Pressable>
          <Pressable onPress={() => setMode('sms')} style={[styles.switchButton, mode === 'sms' && styles.switchActive]}>
            <Text style={[styles.switchText, mode === 'sms' && styles.switchTextActive]}>手机号验证码</Text>
          </Pressable>
        </View>

        {mode === 'password' ? (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>账号</Text>
              <View style={styles.inputShell}>
                <TextInput placeholder='请输入账号' placeholderTextColor={colors.inputPlaceholder} />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>密码</Text>
              <View style={styles.inputShell}>
                <TextInput placeholder='请输入密码' placeholderTextColor={colors.inputPlaceholder} secureTextEntry />
              </View>
            </View>
          </View>
        ) : (
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>手机号</Text>
              <View style={styles.inputShell}>
                <TextInput placeholder='请输入手机号' placeholderTextColor={colors.inputPlaceholder} keyboardType='phone-pad' />
              </View>
            </View>
            <View style={styles.field}>
              <Text style={styles.label}>验证码</Text>
              <View style={styles.inputShell}>
                <TextInput placeholder='请输入验证码' placeholderTextColor={colors.inputPlaceholder} keyboardType='number-pad' />
              </View>
            </View>
          </View>
        )}

        <View style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>登录</Text>
        </View>
        <Text style={styles.hint}>MVP P0 阶段默认不启用账号体系</Text>
      </View>
    </PageContainer>
  )
}

const styles = StyleSheet.create({
  main: {
    gap: spacing.lg,
    paddingTop: spacing.lg
  },
  title: {
    color: colors.textPrimary,
    fontSize: 28,
    fontWeight: '800'
  },
  switchRow: {
    flexDirection: 'row',
    gap: spacing.sm
  },
  switchButton: {
    alignItems: 'center',
    backgroundColor: colors.cardBackground,
    borderRadius: radius.pill,
    flex: 1,
    paddingVertical: 12,
    ...shadows.soft
  },
  switchActive: {
    backgroundColor: colors.accentBlue
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700'
  },
  switchTextActive: {
    color: colors.woodPrimary
  },
  form: {
    gap: spacing.md
  },
  field: {
    gap: spacing.sm
  },
  label: {
    color: colors.textSecondary,
    fontSize: 12,
    letterSpacing: 1.2
  },
  inputShell: {
    backgroundColor: colors.mutedCardBackground,
    borderColor: colors.accentBlueBorder,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: colors.accentBlue,
    borderRadius: radius.pill,
    paddingVertical: 14
  },
  primaryButtonText: {
    color: colors.woodPrimary,
    fontSize: 16,
    fontWeight: '800'
  },
  hint: {
    color: colors.textSecondary,
    fontSize: 12,
    opacity: 0.8
  }
})

