import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, SafeAreaView, Alert } from 'react-native';

const CORRECT_PIN = '1234';
const PIN_DOTS = [0, 1, 2, 3];
const KEYPAD_NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const ParentPINScreen = ({ navigation }) => {
  const [pin, setPin] = useState('');

  const handlePinEntry = (val) => {
    const newPin = pin + val;
    setPin(newPin);

    if (newPin.length === 4) {
      if (newPin === CORRECT_PIN) {
        setPin('');
        navigation.replace('ParentDashboard');
      } else {
        Alert.alert("Incorrect PIN", "Please try again.", [{ text: "OK", onPress: () => setPin('') }]);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Parents Only</Text>
      <Text style={styles.subtitle}>Enter PIN to access settings: {CORRECT_PIN}</Text>

      <View style={styles.pinDisplay}>
        {PIN_DOTS.map((_, i) => (
          <View key={i} style={[styles.pinDot, pin.length > i && styles.pinDotFilled]} />
        ))}
      </View>

      <View style={styles.keypad}>
        {KEYPAD_NUMBERS.map((num) => (
          <TouchableOpacity key={num} style={styles.keyButton} onPress={() => handlePinEntry(num.toString())}>
            <Text style={styles.keyText}>{num}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.keyButtonEmpty} />
        <TouchableOpacity style={styles.keyButton} onPress={() => handlePinEntry('0')}>
          <Text style={styles.keyText}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.keyButton} onPress={() => setPin(pin.slice(0, -1))}>
          <Text style={styles.keyText}>⌫</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    padding: 15,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#455A64',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#263238',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#546E7A',
    marginBottom: 40,
  },
  pinDisplay: {
    flexDirection: 'row',
    marginBottom: 40,
  },
  pinDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#78909C',
    marginHorizontal: 10,
  },
  pinDotFilled: {
    backgroundColor: '#263238',
    borderColor: '#263238',
  },
  keypad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 280,
    justifyContent: 'space-between',
  },
  keyButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
    elevation: 2,
  },
  keyButtonEmpty: {
    width: 80,
    height: 80,
  },
  keyText: {
    fontSize: 28,
    color: '#37474F',
  }
});

export default ParentPINScreen;
