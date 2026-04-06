import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WidgetShell from "../widgetGrid/WidgetShell";

export default function ClockWidget4() {
    return (
        <WidgetShell size="2x4" onPress={() => console.log('tapped')}>
            <View style={styles.container}>
                <View style={styles.banner}>
                    <Text style={styles.bannerText}>WIDGET 1 - ALERTS</Text>
                </View>
                <View style={styles.row}>
                    <View style={styles.dot} />
                    <Text style={styles.title}>3 New Alerts</Text>
                </View>
                <Text style={styles.subtitle}>Unusual login · Low balance · Statement ready</Text>
                <Text style={styles.caption}>Just now</Text>
            </View>
        </WidgetShell>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        gap: 6,
        padding: 12,
        backgroundColor: '#FFFDE7',
        borderLeftWidth: 5,
        borderLeftColor: '#B71C1C',
    },
    banner: {
        marginHorizontal: -12,
        marginTop: -12,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#B71C1C',
    },
    bannerText: {
        color: '#FFEB3B',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#B71C1C',
        borderWidth: 2,
        borderColor: '#FFEB3B',
    },
    title: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1A0000',
    },
    subtitle: {
        fontSize: 12,
        color: '#3E2723',
        fontWeight: '600',
        lineHeight: 16,
    },
    caption: {
        fontSize: 11,
        fontWeight: '700',
        color: '#5D4037',
        marginTop: 2,
    },
});