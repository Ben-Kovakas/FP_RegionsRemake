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
  const [isActionModalVisible, setIsActionModalVisible] = React.useState(false);
  const latestTransaction = zelleTransactions[0];
  const isActivity = variant === 'activity';

  return (
    <WidgetShell
      size={isActivity ? '2x1' : '1x1'}
      onPress={() => setIsActionModalVisible(true)}
    >
      <View style={[styles.tile, isActivity && styles.activityTile]}>
        {isActivity ? (
          <>
            <View style={styles.activityTopRow}>
              <View style={styles.activityIdentity}>
                <ZelleLogo compact markOnly />
                <View style={styles.activityHeaderText}>
                  <Text style={styles.activityEyebrow}>Zelle activity</Text>
                  <Text style={styles.activityName} numberOfLines={1}>
                    {latestTransaction.counterparty}
                  </Text>
                </View>
              </View>
              <Text
                style={styles.activityAmount}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.8}
              >
                {getSignedAmount(latestTransaction)}
              </Text>
            </View>
            <View style={styles.activityMetaRow}>
              <Text style={styles.activityNote} numberOfLines={1}>
                {latestTransaction.note}
              </Text>
              <Text style={styles.activityDate} numberOfLines={1}>
                {latestTransaction.date}
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

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#ffffff',
  },
  activityTile: {
    alignItems: 'stretch',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 8,
    gap: 8,
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
    color: '#6d1ed4',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.4,
    lineHeight: 9,
    textTransform: 'uppercase',
  },
  activityName: {
    color: '#21142d',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 13,
  },
  activityAmount: {
    color: '#21142d',
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
    color: '#4f4659',
    flex: 1,
    fontSize: 9,
    fontWeight: '700',
    lineHeight: 11,
  },
  activityDate: {
    color: '#7c7288',
    fontSize: 9,
    fontWeight: '700',
  },
});
