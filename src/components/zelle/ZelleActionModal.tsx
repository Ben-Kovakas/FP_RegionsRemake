import { useRouter } from 'expo-router';
import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ZelleRoute = '/zelle/request' | '/zelle/pay' | '/zelle/activity';

const actions: { label: string; route: ZelleRoute; helper: string }[] = [
  {
    label: 'Request',
    route: '/zelle/request',
    helper: 'Ask someone to send money.',
  },
  {
    label: 'Pay',
    route: '/zelle/pay',
    helper: 'Send money to a contact.',
  },
  {
    label: 'Activity',
    route: '/zelle/activity',
    helper: 'Review recent payments.',
  },
];

export default function ZelleActionModal({ visible, onClose }: Props) {
  const router = useRouter();

  const openRoute = React.useCallback((route: ZelleRoute) => {
    onClose();
    router.push(route as Parameters<typeof router.push>[0]);
  }, [onClose, router]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalRoot}>
        <Pressable
          accessibilityLabel="Close Zelle options"
          style={StyleSheet.absoluteFill}
          onPress={onClose}
        />
        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Zelle</Text>
          <Text style={styles.sheetSubtitle}>What would you like to do?</Text>
          <View style={styles.actionList}>
            {actions.map((action) => (
              <Pressable
                key={action.route}
                style={styles.actionButton}
                onPress={() => openRoute(action.route)}
              >
                <Text style={styles.actionLabel}>{action.label}</Text>
                <Text style={styles.actionHelper}>{action.helper}</Text>
              </Pressable>
            ))}
          </View>
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
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  sheetTitle: {
    color: '#21142d',
    fontSize: 24,
    fontWeight: '900',
  },
  sheetSubtitle: {
    marginTop: 4,
    color: '#5b5363',
    fontSize: 14,
    lineHeight: 19,
  },
  actionList: {
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: '#ded6eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  actionLabel: {
    color: '#6d1ed4',
    fontSize: 16,
    fontWeight: '800',
  },
  actionHelper: {
    marginTop: 2,
    color: '#60586a',
    fontSize: 12,
    lineHeight: 16,
  },
});
