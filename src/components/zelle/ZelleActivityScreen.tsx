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

function getAmountStyle(transaction: ZelleTransaction) {
  if (transaction.kind === 'paid') {
    return styles.amountPaid;
  }

  if (transaction.kind === 'received') {
    return styles.amountReceived;
  }

  return styles.amountRequested;
}

export default function ZelleActivityScreen() {
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
              <View key={transaction.id} style={styles.activityRow}>
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
                  <Text style={[styles.amount, getAmountStyle(transaction)]}>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f4f8',
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
    color: '#6d1ed4',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: '#1f1728',
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: '#5e5668',
    fontSize: 15,
    lineHeight: 21,
  },
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e4e0eb',
    padding: 8,
    gap: 6,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    padding: 8,
    backgroundColor: '#ffffff',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6d1ed4',
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
    color: '#21142d',
    fontSize: 14,
    fontWeight: '900',
  },
  activityMeta: {
    color: '#655c70',
    fontSize: 12,
    marginTop: 2,
  },
  activityStatus: {
    color: '#7a7185',
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
  amountPaid: {
    color: '#8a2e2e',
  },
  amountReceived: {
    color: '#2e6b3f',
  },
  amountRequested: {
    color: '#6d1ed4',
  },
  kindLabel: {
    color: '#7a7185',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
});
