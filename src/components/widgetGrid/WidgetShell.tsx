import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

// Valid size options for widgets
type WidgetSize = '1x1' | '2x1' | '1x2' | '2x2' | '2x4';

type Props = {
  size: WidgetSize;
  onPress?: () => void;  // optional — not every widget needs to be tappable
  children: React.ReactNode;
};

const UNIT = 80;
const GAP = 8;

const sizes: Record<WidgetSize, ViewStyle> = {
  '1x1': { width: UNIT,         height: UNIT },
  '2x1': { width: UNIT*2+GAP,   height: UNIT },
  '1x2': { width: UNIT,         height: UNIT*2+GAP },
  '2x2': { width: UNIT*2+GAP,   height: UNIT*2+GAP },
  '2x4': { width: UNIT*2+GAP,   height: UNIT*4+GAP*3 },
};

export default function WidgetShell({ size, onPress, children }: Props) {
  return (
    <TouchableOpacity style={[styles.base, sizes[size]]} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      {children}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    margin: GAP / 2,
    borderRadius: 12,
    backgroundColor: '#1e1e1e',
    overflow: 'hidden',
  },
});