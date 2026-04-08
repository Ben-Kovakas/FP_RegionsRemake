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
            <View style={styles.activityHeader}>
              <ZelleLogo compact markOnly />
              <View style={styles.activityHeaderText}>
                <Text style={styles.activityEyebrow}>Activity</Text>
                <Text style={styles.activityName} numberOfLines={2}>
                  {latestTransaction.counterparty}
                </Text>
              </View>
            </View>
            <Text style={styles.activityAmount}>
              {getSignedAmount(latestTransaction)}
            </Text>
            <Text style={styles.activityNote} numberOfLines={2}>
              {latestTransaction.note}
            </Text>
            <Text style={styles.activityDate} numberOfLines={1}>
              {latestTransaction.date}
            </Text>
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
    padding: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  activityHeaderText: {
    flex: 1,
    minWidth: 0,
  },
  activityEyebrow: {
    color: '#6d1ed4',
    fontSize: 8,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  activityName: {
    color: '#21142d',
    fontSize: 10,
    fontWeight: '800',
    lineHeight: 12,
  },
  activityAmount: {
    color: '#21142d',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 8,
  },
  activityNote: {
    color: '#4f4659',
    fontSize: 10,
    fontWeight: '700',
    lineHeight: 13,
  },
  activityDate: {
    color: '#7c7288',
    fontSize: 9,
    fontWeight: '700',
  },
});
