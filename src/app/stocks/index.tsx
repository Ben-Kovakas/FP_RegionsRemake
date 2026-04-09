import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CHART_POINTS, STOCKS } from '@/components/stockWidget/stockData';

const stockList = Object.values(STOCKS);

export default function StocksScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Stocks</Text>

        {stockList.map((stock) => {
          const isPositive = stock.changePercent >= 0;
          const changeColor = isPositive ? '#4CAF50' : '#F44336';
          const changePrefix = isPositive ? '+' : '';

          return (
            <Pressable
              key={stock.ticker}
              style={styles.card}
              onPress={() => router.push(`/stock/${stock.ticker}`)}
            >
              <View style={styles.cardLeft}>
                <Text style={styles.ticker}>{stock.ticker}</Text>
                <Text style={styles.company}>{stock.company}</Text>
              </View>

              <View style={styles.miniChart}>
                {CHART_POINTS.map((point, i) => {
                  const max = Math.max(...CHART_POINTS);
                  const min = Math.min(...CHART_POINTS);
                  const range = max - min || 1;
                  const height = ((point - min) / range) * 32;
                  return (
                    <View key={i} style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          { height, backgroundColor: changeColor + (i === CHART_POINTS.length - 1 ? 'ff' : '77') },
                        ]}
                      />
                    </View>
                  );
                })}
              </View>

              <View style={styles.cardRight}>
                <Text style={styles.price}>${stock.price.toFixed(2)}</Text>
                <View style={[styles.badge, { backgroundColor: changeColor + '22' }]}>
                  <Text style={[styles.badgeText, { color: changeColor }]}>
                    {changePrefix}{stock.changePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5faf6' },
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: '#1a1a1a' },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flex: 1 },
  ticker: { fontSize: 18, fontWeight: '800', color: '#1a1a1a' },
  company: { fontSize: 12, color: '#888', marginTop: 2 },

  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 36,
    width: 80,
    gap: 2,
    marginHorizontal: 12,
  },
  barWrapper: { flex: 1, justifyContent: 'flex-end' },
  bar: { borderRadius: 1.5, minHeight: 2 },

  cardRight: { alignItems: 'flex-end' },
  price: { fontSize: 16, fontWeight: '700', color: '#1a1a1a' },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 4,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
});
