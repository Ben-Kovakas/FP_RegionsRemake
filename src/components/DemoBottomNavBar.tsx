import { Href, usePathname, useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DemoNavItem = {
  href: Href;
  label: string;
  testID: string;
};

const DEMO_NAV_ITEMS: DemoNavItem[] = [
  { href: '/', label: 'Stocks', testID: 'demo-nav-stocks' },
  { href: '/transferScreen', label: 'Transfer', testID: 'demo-nav-transfer' },
  { href: '/zelle/pay', label: 'Zelle Pay', testID: 'demo-nav-zelle-pay' },
  { href: '/zelle/request', label: 'Request', testID: 'demo-nav-zelle-request' },
  { href: '/zelle/activity', label: 'Activity', testID: 'demo-nav-zelle-activity' },
];

function isActivePath(pathname: string, href: Href) {
  const route = String(href);
  if (route === '/') {
    return pathname === '/';
  }
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function DemoBottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} testID="demo-bottom-nav">
      {DEMO_NAV_ITEMS.map((item) => {
        const isActive = isActivePath(pathname, item.href);
        return (
          <Pressable
            key={item.testID}
            testID={item.testID}
            onPress={() => router.push(item.href)}
            style={[styles.tab, isActive && styles.tabActive]}
            android_ripple={{ color: 'rgba(54, 138, 74, 0.15)', borderless: false }}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#d6e5da',
    backgroundColor: '#f5faf6',
    paddingHorizontal: 8,
    paddingTop: 8,
    gap: 6,
  },
  tab: {
    flex: 1,
    minHeight: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  tabActive: {
    backgroundColor: '#dcefe2',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#5f7164',
  },
  tabLabelActive: {
    color: '#256f38',
  },
});
