import { Theme, useTheme } from '@/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from "../../widgetGrid/WidgetShell";

const payments = [
    { name: 'Netflix',  amount: 15.99,   daysLeft: 1,  cycleDays: 30 },
    { name: 'Rent',     amount: 1250.00, daysLeft: 8,  cycleDays: 30 },
    { name: 'Spotify',  amount: 9.99,    daysLeft: 14, cycleDays: 30 },
];

function ProgressBar({ daysLeft, cycleDays }: { daysLeft: number; cycleDays: number }) {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const progress = 1 - daysLeft / cycleDays;
    const urgent = daysLeft <= 3;
    return (
        <View style={styles.trackOuter}>
            <View style={[
                styles.trackFill,
                { width: `${Math.round(progress * 100)}%` as any },
                urgent && styles.trackUrgent,
            ]} />
        </View>
    );
}

// ─── 2x1 ─────────────────────────────────────────────────────────────────────

export function RecurringWidget2x1() {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const next = payments[0];
    return (
        <WidgetShell size="2x1" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.sectionLabel}>Next due</Text>
                    <Text style={styles.urgentTag}>{next.daysLeft} day{next.daysLeft !== 1 ? 's' : ''}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.paymentName}>{next.name}</Text>
                    <Text style={styles.paymentAmount}>${next.amount.toFixed(2)}</Text>
                </View>
                <ProgressBar daysLeft={next.daysLeft} cycleDays={next.cycleDays} />
                <View style={styles.divider} />
                {payments.slice(1, 3).map((p, i) => (
                    <View key={i} style={styles.miniRow}>
                        <Text style={styles.miniName} numberOfLines={1}>{p.name}</Text>
                        <Text style={styles.miniDays}>{p.daysLeft}d</Text>
                        <View style={styles.miniTrackOuter}>
                            <View style={[
                                styles.miniTrackFill,
                                { width: `${Math.round((1 - p.daysLeft / p.cycleDays) * 100)}%` as any },
                            ]} />
                        </View>
                        <Text style={styles.miniAmount}>${p.amount.toFixed(2)}</Text>
                    </View>
                ))}
            </View>
        </WidgetShell>
    );
}

// ─── 2x2 ─────────────────────────────────────────────────────────────────────

export function RecurringWidget2x2() {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const total = payments.reduce((sum, p) => sum + p.amount, 0);
    return (
        <WidgetShell size="4x2" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.row}>
                    <Text style={styles.sectionLabel}>Recurring</Text>
                    <Text style={styles.totalLabel}>${total.toFixed(2)}/mo</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.paymentList}>
                    {payments.map((p, i) => (
                        <View key={i} style={styles.paymentBlock}>
                            <View style={styles.row}>
                                <Text style={styles.paymentName} numberOfLines={1}>{p.name}</Text>
                                <Text style={styles.paymentAmount}>${p.amount.toFixed(2)}</Text>
                            </View>
                            <Text style={[styles.daysLabel, p.daysLeft <= 3 && styles.daysUrgent]}>
                                {p.daysLeft}d
                            </Text>
                            <ProgressBar daysLeft={p.daysLeft} cycleDays={p.cycleDays} />
                            {i < payments.length - 1 && <View style={styles.dividerThin} />}
                        </View>
                    ))}
                </View>
                <View style={styles.divider} />
                <Text style={styles.footerLabel}>Next payday in 6 days</Text>
            </View>
        </WidgetShell>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(theme: Theme) {
    const onPrimary = theme.colors.onPrimary;
    const onPrimaryMuted = theme.colors.onPrimaryMuted;
    const softFill = 'rgba(255,255,255,0.18)';
    const softFillWeak = 'rgba(255,255,255,0.12)';
    const trackFill = '#f1ecb3';
    const trackUrgent = '#fff176';
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: 10,
            justifyContent: 'center',
            gap: 4,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        sectionLabel: {
            fontSize: 10,
            color: onPrimaryMuted,
        },
        totalLabel: {
            fontSize: 10,
            fontWeight: '500',
            color: onPrimary,
        },
        urgentTag: {
            fontSize: 10,
            fontWeight: '500',
            color: '#fff8e0',
        },
        paymentName: {
            fontSize: 12,
            fontWeight: '500',
            color: onPrimary,
            flex: 1,
            marginRight: 6,
        },
        paymentAmount: {
            fontSize: 11,
            fontWeight: '500',
            color: onPrimary,
        },

        // Progress bar track and fill
        trackOuter: {
            height: 3,
            backgroundColor: softFillWeak,
            overflow: 'hidden',
            alignSelf: 'stretch',
            marginTop: 1,
        },
        trackFill: {
            height: 3,
            backgroundColor: trackFill,
        },
        trackUrgent: {
            backgroundColor: trackUrgent,
        },

        divider: {
            height: 0.5,
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginVertical: 2,
        },
        dividerThin: {
            height: 0.5,
            backgroundColor: softFillWeak,
            marginVertical: 3,
        },

        // Mini rows (2x1)
        miniRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
        },
        miniName: {
            fontSize: 10,
            color: onPrimaryMuted,
            width: 44,
        },
        miniDays: {
            fontSize: 9,
            color: onPrimaryMuted,
            width: 16,
            textAlign: 'right',
        },
        miniTrackOuter: {
            flex: 1,
            height: 3,
            backgroundColor: softFill,
            overflow: 'hidden',
        },
        miniTrackFill: {
            height: '100%',
            backgroundColor: trackFill,
        },
        miniAmount: {
            fontSize: 10,
            color: onPrimary,
            width: 42,
            textAlign: 'right',
        },

        // 2x2 payment blocks
        paymentList: {
            flex: 0,
            justifyContent: 'center',
            gap: 0,
        },
        paymentBlock: {
            gap: 0,
            flexDirection: 'column',
        },
        daysLabel: {
            fontSize: 9,
            color: onPrimaryMuted,
        },
        daysUrgent: {
            color: '#fff176',
        },
        footerLabel: {
            fontSize: 10,
            color: onPrimaryMuted,
            textAlign: 'center',
        },
    });
}
