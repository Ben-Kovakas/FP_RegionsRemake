import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;  // optional — anything above the widget grid
};

export default function GridContainer({ children, headerContent }: Props) {
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      
      {/* Anything above the grid — header, stats, etc. */}
      {headerContent && <View style={styles.header}>{headerContent}</View>}

      {/* Widget grid */}
      <View style={styles.grid}>
        {children}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,  // so last widgets aren't flush against the bottom
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  grid: {
    flexDirection: 'row',   // widgets sit side by side
    flexWrap: 'wrap',       // wraps to next line when row is full
    paddingHorizontal: 12,
  },
});