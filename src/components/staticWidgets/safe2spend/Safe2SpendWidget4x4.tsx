import { Theme, useTheme } from '@/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import WidgetShell from '../../widgetGrid/WidgetShell';
import Safe2SpendDetailModal from './Safe2SpendDetailModal';

const SAFE_AMOUNT = 482.50;
const TOTAL_BUDGET = 1200.00;
const NEXT_PAYDAY_DAYS = 6;
const RATIO = SAFE_AMOUNT / TOTAL_BUDGET;

// Inlined copy of the DonutRing used by the other Safe2Spend widgets so this
// accessibility-sized variant stays self-contained and does not force
// modifications to the shared file.
function DonutRing({ size, strokeWidth }: { size: number; strokeWidth: number }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const greenArc = circumference * RATIO;
    const center = size / 2;

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke="#ffffff"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${greenArc} ${circumference - greenArc}`}
                strokeDashoffset={circumference / 4}
                strokeLinecap="round"
            />
        </Svg>
    );
}

export function Safe2SpendWidget4x4(): JSX.Element {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const [modalOpen, setModalOpen] = React.useState(false);
    const openModal = React.useCallback(() => setModalOpen(true), []);
    const closeModal = React.useCallback(() => setModalOpen(false), []);
    const spent = TOTAL_BUDGET - SAFE_AMOUNT;

    return (
        <>
            <WidgetShell size="4x4" onPress={openModal}>
                <View style={styles.container}>
                    <View style={styles.donutWrap}>
                        <DonutRing size={220} strokeWidth={14} />
                        <View style={styles.donutCenter}>
                            <Text style={styles.amountLarge}>${SAFE_AMOUNT.toFixed(2)}</Text>
                            <Text style={styles.amountCaption}>safe to spend</Text>
                        </View>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Budget</Text>
                        <Text style={styles.rowValue}>${TOTAL_BUDGET.toLocaleString()}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={styles.rowLabel}>Spent</Text>
                        <Text style={styles.rowValue}>${spent.toFixed(2)}</Text>
                    </View>
                    <View style={styles.row}>
                        <Text style={[styles.rowLabel, styles.boldLabel]}>Safe to spend</Text>
                        <Text style={[styles.rowValue, styles.boldValue]}>${SAFE_AMOUNT.toFixed(2)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.paydayRow}>
                        <Text style={styles.payday}>Next payday</Text>
                        <Text style={styles.paydayDays}>{NEXT_PAYDAY_DAYS} days</Text>
                    </View>
                </View>
            </WidgetShell>
            <Safe2SpendDetailModal visible={modalOpen} onClose={closeModal} />
        </>
    );
}

function makeStyles(theme: Theme) {
    const onPrimary = theme.colors.onPrimary;
    const onPrimaryMuted = theme.colors.onPrimaryMuted;
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: 24,
            justifyContent: 'center',
            gap: 6,
        },
        donutWrap: {
            alignSelf: 'center',
            position: 'relative',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20,
        },
        donutCenter: {
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'center',
        },
        amountLarge: {
            fontSize: 30,
            fontWeight: '600',
            color: onPrimary,
            textAlign: 'center',
        },
        amountCaption: {
            fontSize: 18,
            color: onPrimaryMuted,
            textAlign: 'center',
            marginTop: 4,
        },
        row: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 6,
        },
        rowLabel: {
            fontSize: 18,
            color: onPrimaryMuted,
        },
        rowValue: {
            fontSize: 18,
            color: onPrimary,
            fontWeight: '400',
        },
        boldLabel: {
            fontWeight: '600',
            color: onPrimary,
        },
        boldValue: {
            fontWeight: '600',
        },
        paydayRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: 4,
        },
        payday: {
            fontSize: 18,
            color: onPrimaryMuted,
        },
        paydayDays: {
            fontSize: 20,
            fontWeight: '600',
            color: onPrimary,
        },
        divider: {
            height: 0.5,
            backgroundColor: 'rgba(255,255,255,0.3)',
            marginVertical: 4,
        },
    });
}
