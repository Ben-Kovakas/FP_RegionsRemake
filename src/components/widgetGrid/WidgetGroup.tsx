import React from 'react';
import { StyleSheet, View } from 'react-native';

import WidgetShell from './WidgetShell';
import {
  WidgetGridParticipationContext,
  WidgetSlotIdContext,
} from './widgetGridContext';
import { GAP } from './widgetLayout';

export type WidgetGroupVariant =
  | 'four_1x1'
  | 'two_2x1'
  | 'two_1x2'
  | 'two_1x1_plus_1x2'
  | 'two_1x1_plus_2x1';

type Props = {
  variant: WidgetGroupVariant;
  children: React.ReactNode;
};

function renderChildSlot(child: React.ReactNode, fallbackKey: string) {
  if (child == null) {
    return null;
  }
  return (
    <View key={fallbackKey} style={styles.slot}>
      {child}
    </View>
  );
}

export default function WidgetGroup({ variant, children }: Props) {
  const items = React.Children.toArray(children);
  const [first, second, third, fourth] = items;

  return (
    <WidgetShell size="2x2" transparentBackground>
      <WidgetGridParticipationContext.Provider value={false}>
        <WidgetSlotIdContext.Provider value={null}>
          <View style={styles.container}>
            {variant === 'four_1x1' && (
              <View style={styles.fourGrid}>
                <View style={styles.row}>
                  {renderChildSlot(first, 'group-a')}
                  {renderChildSlot(second, 'group-b')}
                </View>
                <View style={styles.row}>
                  {renderChildSlot(third, 'group-c')}
                  {renderChildSlot(fourth, 'group-d')}
                </View>
              </View>
            )}

            {variant === 'two_2x1' && (
              <>
                <View style={styles.column}>
                  {renderChildSlot(first, 'group-a')}
                  {renderChildSlot(second, 'group-b')}
                </View>
              </>
            )}

            {variant === 'two_1x2' && (
              <View style={styles.row}>
                {renderChildSlot(first, 'group-a')}
                {renderChildSlot(second, 'group-b')}
              </View>
            )}

            {/* order: [1x2, 1x1, 1x1] */}
            {variant === 'two_1x1_plus_1x2' && (
              <View style={styles.row}>
                {renderChildSlot(first, 'group-a')}
                <View style={styles.column}>
                  {renderChildSlot(second, 'group-b')}
                  {renderChildSlot(third, 'group-c')}
                </View>
              </View>
            )}

            {/* order: [2x1, 1x1, 1x1] */}
            {variant === 'two_1x1_plus_2x1' && (
              <View style={styles.column}>
                {renderChildSlot(first, 'group-a')}
                <View style={styles.row}>
                  {renderChildSlot(second, 'group-b')}
                  {renderChildSlot(third, 'group-c')}
                </View>
              </View>
            )}
          </View>
        </WidgetSlotIdContext.Provider>
      </WidgetGridParticipationContext.Provider>
    </WidgetShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fourGrid: {
    flex: 1,
    gap: GAP,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: GAP,
  },
  column: {
    flex: 1,
    gap: GAP,
  },
  slot: {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
  },
});
