import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import FakeQrCode from './FakeQrCode';
import { getContactById, zelleAccount } from './zelleData';

export type ZelleQrMode = 'my-code' | 'scan';

type Props = {
  mode: ZelleQrMode | null;
  visible: boolean;
  onClose: () => void;
  onUseScannedContact: (contactId: string) => void;
};

const scannedContactId = 'jordan';

export default function ZelleQrModal({
  mode,
  visible,
  onClose,
  onUseScannedContact,
}: Props) {
  const scannedContact = getContactById(scannedContactId);

  if (mode == null) {
    return null;
  }

  const isMyCode = mode === 'my-code';

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close QR modal"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <Text style={styles.title}>
            {isMyCode ? 'Your Zelle QR code' : 'Scan a friend\'s QR code'}
          </Text>
          <Text style={styles.subtitle}>
            {isMyCode
              ? 'Share this code so someone can find you faster.'
              : 'Point the camera at a friend\'s code to start a payment.'}
          </Text>

          {isMyCode ? (
            <View style={styles.codeCard}>
              <FakeQrCode
                size={208}
                value={`${zelleAccount.name}-${zelleAccount.handle}-${zelleAccount.phone}`}
              />
              <Text style={styles.accountName}>{zelleAccount.name}</Text>
              <Text style={styles.accountHandle}>{zelleAccount.handle}</Text>
              <Text style={styles.accountHandle}>{zelleAccount.phone}</Text>
            </View>
          ) : (
            <View style={styles.scanCard}>
              <View style={styles.scannerFrame}>
                <View style={[styles.corner, styles.cornerTopLeft]} />
                <View style={[styles.corner, styles.cornerTopRight]} />
                <View style={[styles.corner, styles.cornerBottomLeft]} />
                <View style={[styles.corner, styles.cornerBottomRight]} />
                <View style={styles.scanLine} />
                <Text style={styles.scannerHint}>Align QR code inside the frame</Text>
              </View>
              <View style={styles.scanResult}>
                <Text style={styles.resultLabel}>Ready to use</Text>
                <Text style={styles.resultName}>
                  {scannedContact?.name ?? 'Jordan Ellis'}
                </Text>
                <Text style={styles.resultMeta}>
                  {scannedContact?.handle ?? 'jordan.ellis@email.com'}
                </Text>
              </View>
              <Pressable
                style={styles.primaryButton}
                onPress={() => {
                  onUseScannedContact(scannedContactId);
                  onClose();
                }}
              >
                <Text style={styles.primaryButtonText}>
                  Use {scannedContact?.name ?? 'Jordan Ellis'}
                </Text>
              </Pressable>
            </View>
          )}

          <Pressable style={styles.secondaryButton} onPress={onClose}>
            <Text style={styles.secondaryButtonText}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 18,
    gap: 14,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  title: {
    color: '#21142d',
    fontSize: 22,
    fontWeight: '900',
  },
  subtitle: {
    color: '#5b5363',
    fontSize: 14,
    lineHeight: 19,
  },
  codeCard: {
    alignItems: 'center',
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2dce8',
    backgroundColor: '#f7f6fb',
    padding: 14,
  },
  accountName: {
    color: '#21142d',
    fontSize: 18,
    fontWeight: '900',
  },
  accountHandle: {
    color: '#5d5669',
    fontSize: 13,
    fontWeight: '700',
  },
  scanCard: {
    gap: 12,
  },
  scannerFrame: {
    height: 220,
    borderRadius: 8,
    backgroundColor: '#21142d',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 34,
    height: 34,
    borderColor: '#ffffff',
  },
  cornerTopLeft: {
    top: 18,
    left: 18,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 18,
    right: 18,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 18,
    left: 18,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    right: 18,
    bottom: 18,
    borderRightWidth: 4,
    borderBottomWidth: 4,
  },
  scanLine: {
    width: '74%',
    height: 2,
    borderRadius: 2,
    backgroundColor: '#a969ff',
  },
  scannerHint: {
    position: 'absolute',
    bottom: 24,
    color: '#e8dffd',
    fontSize: 13,
    fontWeight: '700',
  },
  scanResult: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2dce8',
    backgroundColor: '#f7f6fb',
    padding: 12,
    gap: 3,
  },
  resultLabel: {
    color: '#6d1ed4',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  resultName: {
    color: '#21142d',
    fontSize: 18,
    fontWeight: '900',
  },
  resultMeta: {
    color: '#5d5669',
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
  secondaryButton: {
    minHeight: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f2f0f6',
  },
  secondaryButtonText: {
    color: '#352a40',
    fontSize: 15,
    fontWeight: '800',
  },
});
