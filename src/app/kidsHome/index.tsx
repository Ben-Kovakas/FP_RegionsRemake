import { Theme, useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function KidsHome() {
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Kids View</Text>
          <Text style={styles.headerSubtitle}>Tap a card to start</Text>
        </View>

        <Pressable
          style={styles.card}
          onPress={() => router.replace('/zelle/request')}
          accessibilityRole="button"
          accessibilityLabel="Ask for money — opens Zelle request"
        >
          <View style={styles.emojiChip}>
            <Text style={styles.emoji}>💰</Text>
          </View>
          <Text style={styles.cardTitle}>Ask for money</Text>
          <Text style={styles.cardSubtitleLarge}>
            Request from someone you trust with Zelle.
          </Text>
        </Pressable>

        <View style={styles.card}>
          <View style={styles.emojiChip}>
            <Text style={styles.emoji}>🏦</Text>
          </View>
          <Text style={styles.cardTitle}>My money</Text>
          <Text style={styles.cardSubtitle}>What&apos;s in your checking account</Text>
          <Text style={styles.amountHero}>$1,231.00</Text>
          <Text style={styles.fineLabel}>CHECKING 3456</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.emojiChip}>
            <Text style={styles.emoji}>☀️</Text>
          </View>
          <Text style={styles.cardTitle}>Safe to spend today</Text>
          <Text style={styles.cardSubtitle}>
            About how much is comfy to spend each day.
          </Text>
          <Text style={styles.spendHero}>≈ $80 / day</Text>
          <Text style={styles.fineLabelPlain}>Until your next payday</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      padding: 20,
    },
    header: {
      marginBottom: 18,
    },
    headerTitle: {
      fontSize: 40,
      fontWeight: '900',
      color: theme.colors.textPrimary,
      marginBottom: 6,
    },
    headerSubtitle: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    card: {
      borderRadius: 24,
      paddingVertical: 20,
      paddingHorizontal: 22,
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginBottom: 18,
      gap: 10,
    },
    emojiChip: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 34,
      color: theme.colors.onPrimary,
    },
    cardTitle: {
      fontSize: 30,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    cardSubtitleLarge: {
      fontSize: 20,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    cardSubtitle: {
      fontSize: 18,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    amountHero: {
      fontSize: 40,
      fontWeight: '900',
      color: theme.colors.primaryStrong,
    },
    spendHero: {
      fontSize: 44,
      fontWeight: '900',
      color: theme.colors.primaryStrong,
    },
    fineLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textMuted,
    },
    fineLabelPlain: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.textMuted,
    },
  });
}
