import { useLocalSearchParams } from 'expo-router';
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
  ZelleTransaction,
  formatCurrency,
  getContactById,
  getTransactionById,
  zelleContacts,
  zelleTransactions,
} from './zelleData';
import ZelleQrModal, { ZelleQrMode } from './ZelleQrModal';
import { ZELLE_REGIONS_COLORS as COLORS } from './zelleTheme';

type Props = {
  mode: 'pay' | 'request';
};

const CONTACT_AVATAR_PURPLE = '#6d1ed4';

function getSingleParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

function getPrefillAmount(value: string | undefined) {
  if (value == null) {
    return '';
  }

  const parsedAmount = Number(value.replace(/[^0-9.]/g, ''));
  if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
    return '';
  }

  return parsedAmount.toFixed(2);
}

function getResolvedContactId(contactId: string | undefined) {
  if (contactId != null && getContactById(contactId) != null) {
    return contactId;
  }

  return zelleContacts[0]?.id ?? null;
}

function ContactAvatar({ contact }: { contact: ZelleContact }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{contact.initials}</Text>
    </View>
  );
}

export default function ZelleTransferScreen({ mode }: Props) {
  const params = useLocalSearchParams();
  const transactionIdParam = getSingleParam(params.transactionId);
  const prefillTransaction = React.useMemo(
    () => (
      transactionIdParam == null
        ? undefined
        : getTransactionById(transactionIdParam)
    ),
    [transactionIdParam],
  );
  const contactIdParam = getSingleParam(params.contactId) ?? prefillTransaction?.contactId;
  const amountParam = getSingleParam(params.amount) ?? (
    prefillTransaction != null ? String(prefillTransaction.amount) : undefined
  );
  const memoParam = getSingleParam(params.memo) ?? prefillTransaction?.note;

  const [query, setQuery] = React.useState('');
  const [selectedContactId, setSelectedContactId] = React.useState<string | null>(
    getResolvedContactId(contactIdParam),
  );
  const [selectedTransactionId, setSelectedTransactionId] = React.useState<string | null>(
    prefillTransaction?.id ?? null,
  );
  const [amount, setAmount] = React.useState(() => getPrefillAmount(amountParam));
  const [memo, setMemo] = React.useState(() => memoParam ?? '');
  const [autofillBanner, setAutofillBanner] = React.useState('');
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

  const recentTransactions = React.useMemo(() => (
    zelleTransactions
      .filter((transaction) => (isPay ? transaction.kind === 'paid' : transaction.kind === 'requested'))
      .slice(0, 4)
  ), [isPay]);

  const showAutofillBanner = React.useCallback((message: string) => {
    setAutofillBanner(message);
  }, []);

  React.useEffect(() => {
    if (autofillBanner.length === 0) {
      return undefined;
    }

    const timeoutId = setTimeout(() => {
      setAutofillBanner('');
    }, 3200);

    return () => clearTimeout(timeoutId);
  }, [autofillBanner]);

  const selectContact = React.useCallback((contactId: string) => {
    setSelectedContactId(contactId);
    setSelectedTransactionId(null);
    setAutofillBanner('');
    setConfirmation('');
  }, []);

  const selectRecentTransaction = React.useCallback((transaction: ZelleTransaction) => {
    setSelectedContactId(transaction.contactId);
    setSelectedTransactionId(transaction.id);
    setAmount(transaction.amount.toFixed(2));
    setMemo(transaction.note);
    showAutofillBanner(
      `${formatCurrency(transaction.amount)} and "${transaction.note}" were autofilled from ${transaction.counterparty}.`,
    );
    setConfirmation('');
  }, [showAutofillBanner]);

  React.useEffect(() => {
    setSelectedContactId(getResolvedContactId(contactIdParam));
    setSelectedTransactionId(prefillTransaction?.id ?? null);

    setAmount(getPrefillAmount(amountParam));
    setMemo(memoParam ?? '');

    if (
      transactionIdParam != null
      || contactIdParam != null
      || amountParam != null
      || memoParam != null
    ) {
      if (prefillTransaction != null) {
        const bannerMessage = (
          isPay && prefillTransaction.kind === 'requested'
            ? `${prefillTransaction.counterparty} requested ${formatCurrency(prefillTransaction.amount)}. We've filled in the payment for you.`
            : `${formatCurrency(prefillTransaction.amount)} and "${prefillTransaction.note}" were autofilled for ${prefillTransaction.counterparty}.`
        );
        showAutofillBanner(bannerMessage);
      } else if (amountParam != null || memoParam != null || contactIdParam != null) {
        showAutofillBanner(`${actionLabel} details were autofilled for you.`);
      }

      setConfirmation('');
    } else {
      setAutofillBanner('');
    }
  }, [
    actionLabel,
    amountParam,
    contactIdParam,
    isPay,
    memoParam,
    prefillTransaction,
    showAutofillBanner,
    transactionIdParam,
  ]);

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

        {autofillBanner.length > 0 && (
          <View style={styles.banner}>
            <Text style={styles.bannerText}>{autofillBanner}</Text>
          </View>
        )}

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
            placeholderTextColor={COLORS.muted}
            style={styles.input}
          />
        </View>

        <Text style={styles.sectionTitle}>{isPay ? 'Recent payments' : 'Recent requests'}</Text>
        <View style={styles.recentList}>
          {recentTransactions.map((transaction) => (
            <Pressable
              key={transaction.id}
              style={[
                styles.recentCard,
                selectedTransactionId != null
                  ? selectedTransactionId === transaction.id && styles.selectedCard
                  : selectedContactId === transaction.contactId && styles.selectedCard,
              ]}
              onPress={() => selectRecentTransaction(transaction)}
            >
              <Text style={styles.recentTitle} numberOfLines={1}>
                {transaction.counterparty}
              </Text>
              <Text style={styles.recentMeta} numberOfLines={2}>
                {transaction.note} | {transaction.date}
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
            placeholderTextColor={COLORS.muted}
            keyboardType="decimal-pad"
            style={[styles.input, styles.amountInput]}
          />
          <Text style={styles.label}>Memo</Text>
          <TextInput
            value={memo}
            onChangeText={setMemo}
            placeholder={isPay ? 'Dinner, rent, tickets' : 'What is this for?'}
            placeholderTextColor={COLORS.muted}
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
    backgroundColor: COLORS.pageBackground,
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
    color: COLORS.secondaryAlt,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: COLORS.heading,
    fontSize: 32,
    fontWeight: '900',
  },
  subtitle: {
    color: COLORS.body,
    fontSize: 15,
    lineHeight: 21,
  },
  banner: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surfaceTintStrong,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bannerText: {
    color: COLORS.secondaryAlt,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  card: {
    borderRadius: 8,
    backgroundColor: COLORS.surface,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.secondaryAlt,
    fontSize: 13,
    fontWeight: '800',
  },
  input: {
    minHeight: 44,
    borderWidth: 1,
    borderColor: COLORS.borderStrong,
    borderRadius: 8,
    paddingHorizontal: 12,
    color: COLORS.text,
    backgroundColor: COLORS.surface,
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
    borderColor: COLORS.borderStrong,
    backgroundColor: COLORS.surfaceTint,
    padding: 12,
    gap: 4,
  },
  shortcutTitle: {
    color: COLORS.secondaryAlt,
    fontSize: 15,
    fontWeight: '900',
  },
  shortcutCopy: {
    color: COLORS.body,
    fontSize: 12,
    lineHeight: 16,
  },
  amountInput: {
    fontSize: 24,
    fontWeight: '900',
  },
  sectionTitle: {
    color: COLORS.heading,
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
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    padding: 12,
    gap: 5,
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.surfaceTintStrong,
  },
  recentTitle: {
    color: COLORS.heading,
    fontSize: 14,
    fontWeight: '900',
  },
  recentMeta: {
    color: COLORS.body,
    fontSize: 12,
    lineHeight: 16,
  },
  recentAmount: {
    color: COLORS.secondaryAlt,
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
    backgroundColor: COLORS.surfaceTint,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CONTACT_AVATAR_PURPLE,
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
    color: COLORS.heading,
    fontSize: 15,
    fontWeight: '900',
  },
  contactHandle: {
    color: COLORS.body,
    fontSize: 12,
  },
  contactNote: {
    color: COLORS.muted,
    fontSize: 12,
    marginTop: 2,
  },
  favoriteLabel: {
    color: COLORS.secondaryAlt,
    fontSize: 11,
    fontWeight: '900',
  },
  emptyText: {
    color: COLORS.body,
    fontSize: 14,
  },
  selectionCopy: {
    color: COLORS.body,
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    minHeight: 46,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.buttonText,
    fontSize: 16,
    fontWeight: '900',
  },
  confirmation: {
    color: COLORS.secondaryAlt,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
});
