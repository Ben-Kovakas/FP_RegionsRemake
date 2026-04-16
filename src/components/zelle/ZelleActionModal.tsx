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

const COLORS = {
  sheetBackground: '#ffffff',
  sheetBorder: '#dde2e7',
  buttonBackground: '#ffffff',
  buttonBorder: '#d9dfe5',
  buttonPressed: '#f3f5f7',
  heading: '#171717',
  body: '#5e656d',
  actionLabel: '#171717',
  actionHelper: '#5f6670',
  shadow: '#000000',
};

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
                style={({ pressed }) => [
                  styles.actionButton,
                  pressed && styles.actionButtonPressed,
                ]}
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
    borderWidth: 1,
    borderColor: COLORS.sheetBorder,
    backgroundColor: COLORS.sheetBackground,
    padding: 18,
    shadowColor: COLORS.shadow,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  sheetTitle: {
    color: COLORS.heading,
    fontSize: 24,
    fontWeight: '900',
  },
  sheetSubtitle: {
    marginTop: 4,
    color: COLORS.body,
    fontSize: 14,
    lineHeight: 19,
  },
  actionList: {
    gap: 10,
    marginTop: 18,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: COLORS.buttonBorder,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: COLORS.buttonBackground,
  },
  actionButtonPressed: {
    borderColor: '#c6ccd3',
    backgroundColor: COLORS.buttonPressed,
  },
  actionLabel: {
    color: COLORS.actionLabel,
    fontSize: 16,
    fontWeight: '800',
  },
  actionHelper: {
    marginTop: 2,
    color: COLORS.actionHelper,
    fontSize: 12,
    lineHeight: 16,
  },
});
