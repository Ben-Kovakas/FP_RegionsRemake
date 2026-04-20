import { Theme, useTheme } from '@/theme';
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
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
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

function makeStyles(theme: Theme) {
  return StyleSheet.create({
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
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surfaceElevated,
      padding: 18,
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
    sheetTitle: {
      color: theme.colors.textPrimary,
      fontSize: 24,
      fontWeight: '900',
    },
    sheetSubtitle: {
      marginTop: 4,
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 19,
    },
    actionList: {
      gap: 10,
      marginTop: 18,
    },
    actionButton: {
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: theme.colors.surface,
    },
    actionButtonPressed: {
      borderColor: theme.colors.primaryStrong,
      backgroundColor: theme.colors.surfaceMuted,
    },
    actionLabel: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: '800',
    },
    actionHelper: {
      marginTop: 2,
      color: theme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 16,
    },
  });
}
