import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

// We use basic picker for react native web simplicity in this MVP
// A more robust app would use @react-native-picker/picker or similar
const Select = ({ value, onValueChange, items, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    style={styles.select}
  >
    <option value="" disabled>{placeholder}</option>
    {items.map((item, index) => (
      <option key={index} value={item}>{item}</option>
    ))}
  </select>
);

export default function CheckForm({ onCheckResult }) {
  const [insurers, setInsurers] = useState([]);
  const [products, setProducts] = useState([]);

  const [selectedInsurer, setSelectedInsurer] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [mbsInput, setMbsInput] = useState('');

  const [loadingInsurers, setLoadingInsurers] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // Use relative path for API calls since we'll run both on localhost for dev,
  // but let's hardcode localhost for the MVP for simplicity across mobile/web testing
  const API_BASE = 'http://localhost:3000/api';

  useEffect(() => {
    fetch(`${API_BASE}/insurers`)
      .then(res => res.json())
      .then(data => {
        setInsurers(data.insurers || []);
        setLoadingInsurers(false);
      })
      .catch(err => {
        console.error("Failed to fetch insurers", err);
        setError("Could not load insurers.");
        setLoadingInsurers(false);
      });
  }, []);

  useEffect(() => {
    if (selectedInsurer) {
      setLoadingProducts(true);
      fetch(`${API_BASE}/products/${encodeURIComponent(selectedInsurer)}`)
        .then(res => res.json())
        .then(data => {
          setProducts(data.products || []);
          setLoadingProducts(false);
        })
        .catch(err => {
          console.error("Failed to fetch products", err);
          setLoadingProducts(false);
        });
    } else {
      setProducts([]);
    }
    // Reset product when insurer changes
    setSelectedProduct('');
  }, [selectedInsurer]);

  const handleCheck = () => {
    if (!selectedInsurer || !selectedProduct || !mbsInput) {
      setError("Please fill in all fields.");
      return;
    }
    setError('');
    setChecking(true);

    const url = `${API_BASE}/check-hospital?insurer=${encodeURIComponent(selectedInsurer)}&product=${encodeURIComponent(selectedProduct)}&mbs=${encodeURIComponent(mbsInput)}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        setChecking(false);
        onCheckResult(data);
      })
      .catch(err => {
        console.error("Check failed", err);
        setError("Failed to check coverage. Please try again.");
        setChecking(false);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Check Hospital Cover</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <View style={styles.formGroup}>
        <Text style={styles.label}>1. Select Insurer</Text>
        {loadingInsurers ? <ActivityIndicator /> : (
          <Select
            value={selectedInsurer}
            onValueChange={setSelectedInsurer}
            items={insurers}
            placeholder="Choose an insurer..."
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>2. Select Product</Text>
        {loadingProducts ? <ActivityIndicator /> : (
          <Select
            value={selectedProduct}
            onValueChange={setSelectedProduct}
            items={products}
            placeholder={selectedInsurer ? "Choose a product..." : "Select insurer first"}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>3. Enter MBS Item or Procedure</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. 47916 or 'knee'"
          value={mbsInput}
          onChangeText={setMbsInput}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, (!selectedInsurer || !selectedProduct || !mbsInput) && styles.buttonDisabled]}
        onPress={handleCheck}
        disabled={checking || !selectedInsurer || !selectedProduct || !mbsInput}
      >
        {checking ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Check Coverage</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#555',
  },
  select: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 12,
  }
});
