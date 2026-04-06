import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';

type Props = {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
};

function GridContainer({ children, headerContent }: Props) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      {headerContent && <View style={styles.header}>{headerContent}</View>}
      <View style={styles.grid}>
        {children}
      </View>
    </ScrollView>
  );
}

export default GridContainer;

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 32 },
  header: { paddingHorizontal: 16, paddingVertical: 12 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
});