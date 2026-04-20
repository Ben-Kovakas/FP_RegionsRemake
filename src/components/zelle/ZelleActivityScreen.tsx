import { Theme, useTheme } from '@/theme';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ZelleTransaction,
  describeTransaction,
  formatCurrency,
  getContactById,
  getSignedAmount,
  zelleTransactions,
} from './zelleData';

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getAmountColor(transaction: ZelleTransaction, theme: Theme) {
  if (transaction.kind === 'paid') {
    return theme.colors.danger;
  }

  if (transaction.kind === 'received') {
    return theme.colors.success;
  }

  return theme.colors.zelleBrand;
}

export default function ZelleActivityScreen() {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const params = useLocalSearchParams();
  const highlightedTransactionId = getSingleParam(params.transactionId);
  const activityTransactions = zelleTransactions.filter((transaction) => transaction.kind !== 'requested');
  const totalMoved = activityTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Zelle</Text>
          <Text style={styles.title}>Activity</Text>
          <Text style={styles.subtitle}>Payments and received money.</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>This month</Text>
          <Text style={styles.summaryValue}>{formatCurrency(totalMoved)} moved</Text>
          <Text style={styles.summaryMeta}>{activityTransactions.length} transactions</Text>
        </View>

        <View style={styles.activityList}>
          {activityTransactions.map((transaction) => {
            const contact = getContactById(transaction.contactId);

            return (
              <View
                key={transaction.id}
                style={[
                  styles.activityRow,
                  highlightedTransactionId === transaction.id && styles.activityRowHighlighted,
                ]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {contact?.initials ?? transaction.counterparty.slice(0, 2).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.activityDetails}>
                  <Text style={styles.activityTitle}>
                    {describeTransaction(transaction)}
                  </Text>
                  <Text style={styles.activityMeta}>
                    {transaction.note} - {transaction.date}
                  </Text>
                  <Text style={styles.activityStatus}>{transaction.status}</Text>
                </View>
                <View style={styles.amountColumn}>
                  <Text style={[styles.amount, { color: getAmountColor(transaction, theme) }]}>
                    {getSignedAmount(transaction)}
                  </Text>
                  <Text style={styles.kindLabel}>{transaction.kind}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      padding: 18,
      paddingBottom: 36,
      gap: 14,
    },
    header: {
      gap: 4,
    },
    eyebrow: {
      color: theme.colors.zelleBrand,
      fontSize: 13,
      fontWeight: '900',
      textTransform: 'uppercase',
    },
    title: {
      color: theme.colors.textPrimary,
      fontSize: 32,
      fontWeight: '900',
    },
    subtitle: {
      color: theme.colors.textSecondary,
      fontSize: 15,
      lineHeight: 21,
    },
    // Summary banner keeps the Zelle brand purple on purpose.
    summaryCard: {
      borderRadius: 8,
      backgroundColor: '#21142d',
      padding: 16,
      gap: 3,
    },
    summaryLabel: {
      color: '#d9caef',
      fontSize: 13,
      fontWeight: '800',
    },
    summaryValue: {
      color: '#ffffff',
      fontSize: 24,
      fontWeight: '900',
    },
    summaryMeta: {
      color: '#c9bdd8',
      fontSize: 13,
      fontWeight: '700',
    },
    activityList: {
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: 8,
      gap: 6,
    },
    activityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      borderRadius: 8,
      padding: 8,
      backgroundColor: theme.colors.surface,
    },
    activityRowHighlighted: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primarySoft,
    },
    avatar: {
      width: 42,
      height: 42,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.zelleBrand,
    },
    avatarText: {
      color: '#ffffff',
      fontWeight: '900',
      fontSize: 14,
    },
    activityDetails: {
      flex: 1,
      minWidth: 0,
    },
    activityTitle: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: '900',
    },
    activityMeta: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    activityStatus: {
      color: theme.colors.textMuted,
      fontSize: 11,
      marginTop: 3,
      fontWeight: '800',
    },
    amountColumn: {
      alignItems: 'flex-end',
      gap: 2,
    },
    amount: {
      fontSize: 15,
      fontWeight: '900',
    },
    kindLabel: {
      color: theme.colors.textMuted,
      fontSize: 11,
      fontWeight: '800',
      textTransform: 'capitalize',
    },
  });
}
