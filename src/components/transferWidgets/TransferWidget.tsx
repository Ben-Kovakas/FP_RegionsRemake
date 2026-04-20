import { Theme, useTheme } from '@/theme';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import WidgetShell from "../widgetGrid/WidgetShell";

const useScale = () => {
    const { width } = useWindowDimensions();
    const baseWidth = 375;
    const scale = width / baseWidth;

    return (size: number) => Math.round(size * scale);
};

export function TransferWidget() {
    const theme = useTheme();
    const styles = React.useMemo(() => makeStyles(theme), [theme]);
    const router = useRouter();
    const s = useScale();

    return (
        <WidgetShell size="1x1" onPress={() => router.push('/transferScreen')}>
            <View style={styles.container}>

                <View style={styles.iconWrapper}>
                    <Text
                        style={[
                            styles.transferIcon,
                            { fontSize: Math.min(s(30), 50) }
                        ]}
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        ⇄
                    </Text>
                </View>

                <Text
                    style={[styles.transferLabel, { fontSize: s(11) }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                >
                    Transfer
                </Text>

            </View>
        </WidgetShell>
    );
}

function makeStyles(theme: Theme) {
    return StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.primary,
            padding: 6,
        },

        iconWrapper: {
            ...StyleSheet.absoluteFillObject,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 16,
        },

        transferIcon: {
            // Dark glyph on lime-green tile; intentional fixed contrast.
            color: '#1A1F17',
            fontWeight: '600',
        },

        transferLabel: {
            position: 'absolute',
            bottom: 8,
            left: 4,
            right: 4,
            textAlign: 'center',
            color: theme.colors.onPrimary,
            fontWeight: '700',
        },
    });
}
