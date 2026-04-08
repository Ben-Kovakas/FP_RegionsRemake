import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useLocalSearchParams, useNavigation } from 'expo-router';

export default function TransferSuccess() {
  const router = useRouter();
  const navigation = useNavigation();

  const { from, to, amount } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.checkmarkCircle}>
          <Icon name="check" size={80} color="#ffffff" />
      </View>
      <Text style={styles.header}>Transfer Successful!</Text>

      <View style={styles.details}>
        <Text style={styles.detailText}>From: {from}</Text>
        <Text style={styles.detailText}>To: {to}</Text>
        <Text style={styles.detailText}>Amount: ${amount}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
                navigation.pop(2);
          }}
      >
        <Text style={styles.buttonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  checkmark: {
    fontSize: 80,
    marginBottom: 24
  },
  checkmarkCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#16a34a', marginBottom: 32 },
  details: {
    width: '100%',
    backgroundColor: '#dcfce7',
    padding: 20,
    borderRadius: 12,
    marginBottom: 40
  },
  detailText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#166534',
    marginBottom: 8
  },
  button: {
    backgroundColor: '#22c55e',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  },
});