import React from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CHART_POINTS, MARKET_INDICES, STOCKS, StockData } from '@/components/stockWidget/stockData';

const allStocks = Object.values(STOCKS);

// Sort categories
const mostActive = [...allStocks].sort((a, b) => b.volumeNum - a.volumeNum);
const topGainers = [...allStocks].filter((s) => s.changePercent > 0).sort((a, b) => b.changePercent - a.changePercent);
const topLosers = [...allStocks].filter((s) => s.changePercent < 0).sort((a, b) => a.changePercent - b.changePercent);

function formatVolume(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return String(num);
}

/* ─── Mini sparkline bar chart ─── */
function MiniChart({ color }: { color: string }) {
  const max = Math.max(...CHART_POINTS);
  const min = Math.min(...CHART_POINTS);
  const range = max - min || 1;
  return (
    <View style={styles.miniChart}>
      {CHART_POINTS.map((point, i) => {
        const height = ((point - min) / range) * 28;
        return (
          <View key={i} style={styles.miniBarWrap}>
            <View
              style={[
                styles.miniBar,
                { height, backgroundColor: color + (i === CHART_POINTS.length - 1 ? 'ff' : '55') },
              ]}
            />
          </View>
        );
      })}
    </View>
  );
}

/* ─── Horizontal category card ─── */
function CategoryCard({ stock, variant }: { stock: StockData; variant: 'active' | 'gainer' | 'loser' }) {
  const router = useRouter();
  const isPositive = stock.changePercent >= 0;
  const changeColor = isPositive ? '#00C805' : '#FF5000';
  const changePrefix = isPositive ? '+' : '';

  return (
    <Pressable
      style={styles.catCard}
      onPress={() => router.push(`/stock/${stock.ticker}`)}
    >
      <View style={styles.catCardTop}>
        <Text style={styles.catTicker}>{stock.ticker}</Text>
        <View style={[styles.catBadge, { backgroundColor: changeColor + '18' }]}>
          <Text style={[styles.catBadgeText, { color: changeColor }]}>
            {changePrefix}{stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      <Text style={styles.catCompany} numberOfLines={1}>{stock.company}</Text>

      <MiniChart color={changeColor} />

      <Text style={styles.catPrice}>${stock.price.toFixed(2)}</Text>

      {variant === 'active' && (
        <Text style={styles.catVolume}>Vol {formatVolume(stock.volumeNum)}</Text>
      )}
    </Pressable>
  );
}

/* ─── All Stocks list row ─── */
function StockRow({ stock }: { stock: StockData }) {
  const router = useRouter();
  const isPositive = stock.changePercent >= 0;
  const changeColor = isPositive ? '#00C805' : '#FF5000';
  const changePrefix = isPositive ? '+' : '';

  return (
    <Pressable
      style={styles.row}
      onPress={() => router.push(`/stock/${stock.ticker}`)}
    >
      <View style={styles.rowLeft}>
        <Text style={styles.rowTicker}>{stock.ticker}</Text>
        <Text style={styles.rowCompany}>{stock.company}</Text>
      </View>

      <MiniChart color={changeColor} />

      <View style={styles.rowRight}>
        <Text style={styles.rowPrice}>${stock.price.toFixed(2)}</Text>
        <View style={[styles.rowBadge, { backgroundColor: changeColor }]}>
          <Text style={styles.rowBadgeText}>
            {changePrefix}{stock.changePercent.toFixed(2)}%
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

/* ─── Main Screen ─── */
export default function StocksScreen() {
  return (
    <View style={styles.root}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.title}>Stocks</Text>

        {/* Market Indices */}
        <View style={styles.indicesRow}>
          {MARKET_INDICES.map((idx) => {
            const isUp = idx.changePercent >= 0;
            const color = isUp ? '#00C805' : '#FF5000';
            return (
              <View key={idx.name} style={styles.indexCard}>
                <Text style={styles.indexName}>{idx.name}</Text>
                <Text style={styles.indexValue}>{idx.value.toLocaleString()}</Text>
                <Text style={[styles.indexChange, { color }]}>
                  {isUp ? '+' : ''}{idx.changePercent.toFixed(2)}%
                </Text>
              </View>
            );
          })}
        </View>

        {/* Most Active */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Most Active</Text>
            <Text style={styles.sectionSub}>By volume today</Text>
          </View>
          <FlatList
            data={mostActive.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.ticker}
            contentContainerStyle={styles.catList}
            renderItem={({ item }) => <CategoryCard stock={item} variant="active" />}
          />
        </View>

        {/* Top Gainers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Gainers</Text>
            <Text style={[styles.sectionSub, { color: '#00C805' }]}>Biggest price spike</Text>
          </View>
          <FlatList
            data={topGainers.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.ticker}
            contentContainerStyle={styles.catList}
            renderItem={({ item }) => <CategoryCard stock={item} variant="gainer" />}
          />
        </View>

        {/* Top Losers */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Losers</Text>
            <Text style={[styles.sectionSub, { color: '#FF5000' }]}>Biggest price drop</Text>
          </View>
          <FlatList
            data={topLosers.slice(0, 6)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.ticker}
            contentContainerStyle={styles.catList}
            renderItem={({ item }) => <CategoryCard stock={item} variant="loser" />}
          />
        </View>

        {/* All Stocks */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Stocks</Text>
          </View>
          {allStocks.map((stock) => (
            <StockRow key={stock.ticker} stock={stock} />
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0b0b0f' },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 60, paddingBottom: 40 },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  /* ── Market Indices ── */
  indicesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 28,
  },
  indexCard: {
    flex: 1,
    backgroundColor: '#16161e',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  indexName: { fontSize: 11, fontWeight: '600', color: '#888', marginBottom: 4 },
  indexValue: { fontSize: 14, fontWeight: '700', color: '#fff', marginBottom: 2 },
  indexChange: { fontSize: 12, fontWeight: '700' },

  /* ── Sections ── */
  section: { marginBottom: 28 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: '#fff' },
  sectionSub: { fontSize: 12, color: '#666' },

  /* ── Horizontal Category Cards ── */
  catList: { paddingLeft: 20, paddingRight: 8, gap: 10 },
  catCard: {
    width: 148,
    backgroundColor: '#16161e',
    borderRadius: 14,
    padding: 14,
  },
  catCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  catTicker: { fontSize: 16, fontWeight: '800', color: '#fff' },
  catBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  catBadgeText: { fontSize: 11, fontWeight: '700' },
  catCompany: { fontSize: 11, color: '#666', marginBottom: 8 },
  catPrice: { fontSize: 15, fontWeight: '700', color: '#fff', marginTop: 8 },
  catVolume: { fontSize: 11, color: '#888', marginTop: 2 },

  /* ── Mini Chart ── */
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 28,
    gap: 1.5,
  },
  miniBarWrap: { flex: 1, justifyContent: 'flex-end' },
  miniBar: { borderRadius: 1, minHeight: 1.5 },

  /* ── All Stocks Rows ── */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#1e1e2a',
  },
  rowLeft: { flex: 1 },
  rowTicker: { fontSize: 16, fontWeight: '800', color: '#fff' },
  rowCompany: { fontSize: 12, color: '#666', marginTop: 1 },
  rowRight: { alignItems: 'flex-end', marginLeft: 12 },
  rowPrice: { fontSize: 15, fontWeight: '700', color: '#fff' },
  rowBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
    minWidth: 64,
    alignItems: 'center',
  },
  rowBadgeText: { fontSize: 12, fontWeight: '700', color: '#fff' },
});
