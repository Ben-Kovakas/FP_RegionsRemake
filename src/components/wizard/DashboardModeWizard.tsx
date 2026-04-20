import { Theme, useTheme } from '@/theme';
import { Href, useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
};

type ModeTile = {
  emoji: string;
  title: string;
  description: string;
  route: Href;
};

const TILES: ModeTile[] = [
  {
    emoji: '🏠',
    title: 'Standard',
    description: 'Your usual dashboard with all widgets.',
    route: '/',
  },
  {
    emoji: '👁️',
    title: 'Visually impaired',
    description: 'Larger tiles for easier reading.',
    route: '/accessibilityHome',
  },
  {
    emoji: '🧸',
    title: 'Kids',
    description: 'Simple screen for allowance and safe spending.',
    route: '/kidsHome',
  },
];

export default function DashboardModeWizard({ visible, onClose }: Props): JSX.Element {
  const theme = useTheme();
  const router = useRouter();
  const styles = useMemo(() => makeStyles(theme), [theme]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        {/* Inner Pressable swallows taps so the card itself doesn't close the modal */}
        <Pressable style={styles.card} onPress={() => {}}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Choose a view</Text>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.tileList}>
            {TILES.map((tile) => (
              <Pressable
                key={tile.title}
                accessibilityRole="button"
                accessibilityLabel={`${tile.title} — ${tile.description}`}
                style={styles.tile}
                onPress={() => {
                  onClose();
                  router.replace(tile.route);
                }}
              >
                <View style={styles.emojiChip}>
                  <Text style={styles.emoji}>{tile.emoji}</Text>
                </View>
                <View style={styles.tileTextWrap}>
                  <Text style={styles.tileTitle}>{tile.title}</Text>
                  <Text style={styles.tileDescription} numberOfLines={2}>
                    {tile.description}
                  </Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.55)',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
    },
    card: {
      width: '100%',
      maxWidth: 400,
      padding: 22,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceElevated,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.textPrimary,
    },
    closeBtn: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.surfaceMuted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeBtnText: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      lineHeight: 16,
    },
    tileList: {
      gap: 12,
    },
    tile: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      borderRadius: 14,
      paddingVertical: 18,
      paddingHorizontal: 16,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    emojiChip: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: theme.colors.primarySoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emoji: {
      fontSize: 24,
    },
    tileTextWrap: {
      flex: 1,
    },
    tileTitle: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.colors.textPrimary,
    },
    tileDescription: {
      fontSize: 13,
      color: theme.colors.textSecondary,
    },
  });
}
