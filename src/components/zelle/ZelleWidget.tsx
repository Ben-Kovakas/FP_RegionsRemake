import { Theme, useTheme } from '@/theme';
import { Href, useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import WidgetShell from '../widgetGrid/WidgetShell';
import ZelleActionModal from './ZelleActionModal';
import { getSignedAmount, zelleTransactions } from './zelleData';
import ZelleLogo from './ZelleLogo';

type ZelleWidgetVariant = 'logo' | 'activity';

type Props = {
  variant: ZelleWidgetVariant;
};

function ZelleWidget({ variant }: Props) {
  const theme = useTheme();
  const styles = React.useMemo(() => makeStyles(theme), [theme]);
  const router = useRouter();
  const [isActionModalVisible, setIsActionModalVisible] = React.useState(false);
  const isActivity = variant === 'activity';
  const featuredTransaction = React.useMemo(() => (
    zelleTransactions.find((transaction) => transaction.kind === 'requested')
    ?? zelleTransactions[0]
    ?? null
  ), []);

  const handlePress = React.useCallback(() => {
    if (!isActivity) {
      setIsActionModalVisible(true);
      return;
    }

    if (featuredTransaction == null) {
      return;
    }

    const destination: Href = featuredTransaction.kind === 'requested'
      ? {
        pathname: '/zelle/pay',
        params: { transactionId: featuredTransaction.id },
      }
      : {
        pathname: '/zelle/activity',
        params: { transactionId: featuredTransaction.id },
      };

    router.push(destination);
  }, [featuredTransaction, isActivity, router]);

  return (
    <WidgetShell
      size={isActivity ? '2x1' : '1x1'}
      onPress={handlePress}
    >
      <View style={[styles.tile, isActivity && styles.activityTile]}>
        {isActivity && featuredTransaction != null ? (
          <>
            <View style={styles.activityTopRow}>
              <View style={styles.activityIdentity}>
                <ZelleLogo compact markOnly />
                <View style={styles.activityHeaderText}>
                  <Text style={styles.activityEyebrow}>
                    {featuredTransaction.kind === 'requested' ? 'Pending request' : 'Zelle activity'}
                  </Text>
                  <Text style={styles.activityName} numberOfLines={1}>
                    {featuredTransaction.counterparty}
                  </Text>
                </View>
              </View>
              <Text
                style={styles.activityAmount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {getSignedAmount(featuredTransaction)}
              </Text>
            </View>
            <View style={styles.activityMetaRow}>
              <Text style={styles.activityNote} numberOfLines={1}>
                {featuredTransaction.note}
              </Text>
              <Text style={styles.activityDate} numberOfLines={1}>
                {featuredTransaction.kind === 'requested'
                  ? `${featuredTransaction.status} | ${featuredTransaction.date}`
                  : featuredTransaction.date}
              </Text>
            </View>
          </>
        ) : (
          <ZelleLogo />
        )}
      </View>
      <ZelleActionModal
        visible={isActionModalVisible}
        onClose={() => setIsActionModalVisible(false)}
      />
    </WidgetShell>
  );
}

export function ZelleLogoWidget() {
  return <ZelleWidget variant="logo" />;
}

export function ZelleActivityWidget() {
  return <ZelleWidget variant="activity" />;
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    tile: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 8,
      backgroundColor: theme.colors.surface,
    },
    activityTile: {
      alignItems: 'stretch',
      justifyContent: 'space-between',
      paddingHorizontal: 10,
      paddingVertical: 8,
      gap: 8,
      backgroundColor: theme.colors.surfaceMuted,
    },
    activityTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8,
    },
    activityIdentity: {
      flex: 1,
      minWidth: 0,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    activityHeaderText: {
      flex: 1,
      minWidth: 0,
    },
    activityEyebrow: {
      color: theme.colors.primaryStrong,
      fontSize: 7,
      fontWeight: '900',
      letterSpacing: 0.4,
      lineHeight: 9,
      textTransform: 'uppercase',
    },
    activityName: {
      color: theme.colors.textPrimary,
      fontSize: 11,
      fontWeight: '800',
      lineHeight: 13,
    },
    activityAmount: {
      color: theme.colors.textPrimary,
      fontSize: 15,
      fontWeight: '900',
      flexShrink: 1,
      textAlign: 'right',
    },
    activityMetaRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    activityNote: {
      color: theme.colors.textSecondary,
      flex: 1,
      fontSize: 9,
      fontWeight: '700',
      lineHeight: 11,
    },
    activityDate: {
      color: theme.colors.textMuted,
      fontSize: 9,
      fontWeight: '700',
    },
  });
}
