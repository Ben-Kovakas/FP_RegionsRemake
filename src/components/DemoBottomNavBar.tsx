import { Theme, useThemeControls } from '@/theme';
import { Href, usePathname, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
  const { theme, mode, toggleTheme } = useThemeControls();
  const styles = useMemo(() => makeStyles(theme), [theme]);
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

  const rippleColor = theme.mode === 'dark' ? 'rgba(169,220,95,0.18)' : 'rgba(110,165,46,0.15)';
  const isDark = mode === 'dark';

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]} testID="demo-bottom-nav">
      {DEMO_NAV_ITEMS.map((item) => {
        const isActive = activeHref === String(item.href);
        return (
          <Pressable
            key={item.testID}
            testID={item.testID}
            onPress={() => {
              if (isActive) return;
              setActiveHref(String(item.href));
              router.replace(item.href);
            }}
            style={[styles.tab, isActive && styles.tabActive]}
            android_ripple={{ color: rippleColor, borderless: false }}
          >
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{item.label}</Text>
          </Pressable>
        );
      })}
      <Pressable
        testID="demo-theme-toggle"
        accessibilityLabel={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
        onPress={toggleTheme}
        style={styles.themeToggle}
        android_ripple={{ color: rippleColor, borderless: true }}
      >
        <Text style={styles.themeToggleIcon}>{isDark ? '\u2600' : '\u263E'}</Text>
      </Pressable>
    </View>
  );
}

function makeStyles(theme: Theme) {
  return StyleSheet.create({
    bar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
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
      backgroundColor: theme.colors.primarySoft,
    },
    tabLabel: {
      fontSize: 10,
      fontWeight: '600',
      color: theme.colors.textSecondary,
    },
    tabLabelActive: {
      color: theme.colors.primaryStrong,
    },
    themeToggle: {
      minWidth: 34,
      height: 34,
      paddingHorizontal: 8,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceMuted,
    },
    themeToggleIcon: {
      fontSize: 16,
      lineHeight: 18,
      color: theme.colors.textPrimary,
    },
  });
}
