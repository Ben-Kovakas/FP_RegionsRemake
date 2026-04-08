import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  compact?: boolean;
  markOnly?: boolean;
};

//it actually proved difficult to just import the logo as a png as it didn't really format properly
//so I just made it from scratch lol
export default function ZelleLogo({ compact = false, markOnly = false }: Props) {
  return (
    <View style={[styles.logo, compact && styles.logoCompact]}>
      <View style={[styles.mark, compact && styles.markCompact]}>
        <Text style={[styles.markText, compact && styles.markTextCompact]}>Z</Text>
        <Text style={[styles.dollarText, compact && styles.dollarTextCompact]}>$</Text>
      </View>
      {!markOnly && (
        <Text style={[styles.wordmark, compact && styles.wordmarkCompact]}>
          Zelle
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logo: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  logoCompact: {
    flexDirection: 'row',
    gap: 4,
  },
  mark: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#6d1ed4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  markCompact: {
    width: 28,
    height: 28,
    borderRadius: 7,
  },
  markText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 30,
  },
  markTextCompact: {
    fontSize: 18,
    lineHeight: 21,
  },
  dollarText: {
    position: 'absolute',
    right: 5,
    bottom: 1,
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '900',
  },
  dollarTextCompact: {
    right: 3,
    bottom: 0,
    fontSize: 7,
  },
  wordmark: {
    color: '#21142d',
    fontSize: 18,
    fontWeight: '900',
  },
  wordmarkCompact: {
    fontSize: 12,
  },
});
