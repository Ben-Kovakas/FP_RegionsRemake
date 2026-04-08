import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  ZelleContact,
  describeTransaction,
  formatCurrency,
  getContactById,
  zelleContacts,
  zelleTransactions,
} from './zelleData';
import ZelleQrModal, { ZelleQrMode } from './ZelleQrModal';

type Props = {
  mode: 'pay' | 'request';
};

function ContactAvatar({ contact }: { contact: ZelleContact }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{contact.initials}</Text>
    </View>
  );
}

export default function ZelleTransferScreen({ mode }: Props) {
  const [query, setQuery] = React.useState('');
  const [selectedContactId, setSelectedContactId] = React.useState<string | null>(zelleContacts[0]?.id ?? null);
  const [amount, setAmount] = React.useState('');
  const [memo, setMemo] = React.useState('');
  const [confirmation, setConfirmation] = React.useState('');
  const [qrMode, setQrMode] = React.useState<ZelleQrMode | null>(null);

  const isPay = mode === 'pay';
  const actionLabel = isPay ? 'Pay' : 'Request';
  const selectedContact = selectedContactId == null ? null : getContactById(selectedContactId);

  const filteredContacts = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery.length === 0) {
      return zelleContacts;
    }

    return zelleContacts.filter((contact) => (
      contact.name.toLowerCase().includes(normalizedQuery)
      || contact.handle.toLowerCase().includes(normalizedQuery)
      || contact.phone.includes(normalizedQuery)
    ));
  }, [query]);

  const recentTransactions = React.useMemo(() => zelleTransactions.slice(0, 4), []);

  const selectContact = React.useCallback((contactId: string) => {
    setSelectedContactId(contactId);
    setConfirmation('');
  }, []);

  const submitTransfer = React.useCallback(() => {
    const parsedAmount = Number(amount.replace(/[^0-9.]/g, ''));
    if (selectedContact == null || Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setConfirmation('Choose a contact and enter an amount.');
      return;
    }

    const direction = isPay ? 'to' : 'from';
    setConfirmation(`${actionLabel} ${formatCurrency(parsedAmount)} ${direction} ${selectedContact.name}. Ready for review.`);
  }, [actionLabel, amount, isPay, selectedContact]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Zelle</Text>
          <Text style={styles.title}>{actionLabel}</Text>
          <Text style={styles.subtitle}>
            {isPay ? 'Send money to someone you know.' : 'Ask someone you know for money.'}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>QR shortcuts</Text>
          <View style={styles.shortcutRow}>
            <Pressable
              style={styles.shortcutButton}
              onPress={() => setQrMode('my-code')}
            >
              <Text style={styles.shortcutTitle}>My code</Text>
              <Text style={styles.shortcutCopy}>
                Pull up your Zelle QR code.
              </Text>
            </Pressable>
            <Pressable
              style={styles.shortcutButton}
              onPress={() => setQrMode('scan')}
            >
              <Text style={styles.shortcutTitle}>Scan code</Text>
              <Text style={styles.shortcutCopy}>
                Scan a friend to start faster.
              </Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Find a contact</Text>
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Name, email, or phone"
            placeholderTextColor="#837b8d"
            style={styles.input}
          />
        </View>

        <Text style={styles.sectionTitle}>Recent activity</Text>
        <View style={styles.recentList}>
          {recentTransactions.map((transaction) => (
            <Pressable
              key={transaction.id}
              style={[
                styles.recentCard,
                selectedContactId === transaction.contactId && styles.selectedCard,
              ]}
              onPress={() => selectContact(transaction.contactId)}
            >
              <Text style={styles.recentTitle} numberOfLines={1}>
                {transaction.counterparty}
              </Text>
              <Text style={styles.recentMeta} numberOfLines={2}>
                {describeTransaction(transaction)}
              </Text>
              <Text style={styles.recentAmount}>
                {formatCurrency(transaction.amount)}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Contacts</Text>
        <View style={styles.card}>
          {filteredContacts.map((contact) => (
            <Pressable
              key={contact.id}
              style={[
                styles.contactRow,
                selectedContactId === contact.id && styles.selectedContactRow,
              ]}
              onPress={() => selectContact(contact.id)}
            >
              <ContactAvatar contact={contact} />
              <View style={styles.contactDetails}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactHandle}>{contact.handle}</Text>
                <Text style={styles.contactNote}>{contact.note}</Text>
              </View>
              {contact.favorite && <Text style={styles.favoriteLabel}>Recent</Text>}
            </Pressable>
          ))}
          {filteredContacts.length === 0 && (
            <Text style={styles.emptyText}>No contacts found.</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="$0.00"
            placeholderTextColor="#837b8d"
            keyboardType="decimal-pad"
            style={[styles.input, styles.amountInput]}
          />
          <Text style={styles.label}>Memo</Text>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder={isPay ? 'Dinner, rent, tickets' : 'What is this for?'}
            placeholderTextColor="#837b8d"
            style={styles.input}
          />
          {selectedContact && (
            <Text style={styles.selectionCopy}>
              {actionLabel} {isPay ? selectedContact.name : `from ${selectedContact.name}`}
            </Text>
          )}
          <Pressable style={styles.primaryButton} onPress={submitTransfer}>
            <Text style={styles.primaryButtonText}>{actionLabel}</Text>
          </Pressable>
          {confirmation.length > 0 && (
            <Text style={styles.confirmation}>{confirmation}</Text>
          )}
        </View>
      </ScrollView>
      <ZelleQrModal
        mode={qrMode}
        visible={qrMode != null}
        onClose={() => setQrMode(null)}
        onUseScannedContact={selectContact}
      />
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
  card: {
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: '#e4e0eb',
  },
  label: {
    color: '#352a40',
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: '#d7d0e4',
    borderRadius: 8,
    paddingHorizontal: 12,
    color: '#21142d',
    backgroundColor: '#ffffff',
    fontSize: 15,
  },
  shortcutRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  shortcutButton: {
    flexGrow: 1,
    flexBasis: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2dce8',
    backgroundColor: '#f7f6fb',
    padding: 12,
    gap: 4,
  },
  shortcutTitle: {
    color: '#6d1ed4',
    fontSize: 15,
    fontWeight: '900',
  },
  shortcutCopy: {
    color: '#5f5769',
    fontSize: 12,
    lineHeight: 16,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '900',
  },
  sectionTitle: {
    color: '#21142d',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 4,
  },
  recentList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  recentCard: {
    flexGrow: 1,
    flexBasis: 150,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2dce8',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 5,
  },
  selectedCard: {
    borderColor: '#6d1ed4',
    backgroundColor: '#f5f0ff',
  },
  recentTitle: {
    color: '#21142d',
    fontSize: 14,
    fontWeight: '900',
  },
  recentMeta: {
    color: '#635c6f',
    fontSize: 12,
    lineHeight: 16,
  },
  recentAmount: {
    color: '#6d1ed4',
    fontSize: 16,
    fontWeight: '900',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  selectedContactRow: {
    backgroundColor: '#f5f0ff',
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
  contactDetails: {
    flex: 1,
    minWidth: 0,
  },
  contactName: {
    color: '#21142d',
    fontSize: 15,
    fontWeight: '900',
  },
  contactHandle: {
    color: '#61586c',
    fontSize: 12,
  },
  contactNote: {
    color: '#766d82',
    fontSize: 12,
    marginTop: 2,
  },
  favoriteLabel: {
    color: '#6d1ed4',
    fontSize: 11,
    fontWeight: '900',
  },
  emptyText: {
    color: '#61586c',
    fontSize: 14,
  },
  selectionCopy: {
    color: '#4c4357',
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6d1ed4',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
  },
  confirmation: {
    color: '#2e6b3f',
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
});
