import { Href, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type DemoNavItem = {
  href: Href;
  label: string;
  testID: string;
};

const DEMO_NAV_ITEMS: DemoNavItem[] = [
  { href: '/stocks', label: 'Stocks', testID: 'demo-nav-stocks' },
  { href: '/transferScreen', label: 'Transfer', testID: 'demo-nav-transfer' },
  { href: '/', label: 'Main', testID: 'demo-nav-main' },
  { href: '/zelle/pay', label: 'Pay', testID: 'demo-nav-pay' },
  { href: '/zelle/request', label: 'Request', testID: 'demo-nav-request' },
  { href: '/zelle/activity', label: 'Activity', testID: 'demo-nav-activity' },
];

export default function DemoBottomNavBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [activeHref, setActiveHref] = useState<string>('/');

  // Sync activeHref when pathname changes from external navigation (e.g. back button, deep link)
  useEffect(() => {
    const match = DEMO_NAV_ITEMS.find((item) => {
      const route = String(item.href);
      if (route === '/') return pathname === '/';
      if (route === '/stocks') return pathname === '/stocks' || pathname.startsWith('/stock/');
      return pathname === route || pathname.startsWith(`${route}/`);
    });
    if (match) {
      setActiveHref(String(match.href));
    }
  }, [pathname]);

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} testID="demo-bottom-nav">
      {DEMO_NAV_ITEMS.map((item) => {
        const isActive = activeHref === String(item.href);
        return (
          <Pressable
            key={item.testID}
            testID={item.testID}
            onPress={() => {
              setActiveHref(String(item.href));
              router.replace(item.href);
            }}
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
