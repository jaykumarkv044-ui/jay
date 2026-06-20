import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';

export default function ResultsView({ result, onReset }) {
  if (!result) return null;

  if (!result.found) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorTitle}>Not Found</Text>
        <Text style={styles.text}>{result.message}</Text>
        <TouchableOpacity style={styles.resetButton} onPress={onReset}>
          <Text style={styles.resetButtonText}>Search Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { isCovered, procedureName, mbsItem, clinicalCategory, explanation, waitingPeriod, disclaimer } = result;

  const handleCompareClick = () => {
    // Placeholder affiliate link
    Linking.openURL('https://compareclub.com.au/?utm_source=healthchecker');
  };

  return (
    <View style={[styles.container, isCovered ? styles.coveredContainer : styles.notCoveredContainer]}>
      <View style={styles.resultHeader}>
        <Text style={styles.resultTitle}>{isCovered ? 'YES' : 'NO'}</Text>
        <Text style={styles.resultSubtitle}>
          {isCovered ? 'This procedure is covered.' : 'This procedure is NOT covered.'}
        </Text>
      </View>

      <View style={styles.detailsBox}>
        <Text style={styles.detailLabel}>Procedure:</Text>
        <Text style={styles.detailText}>{procedureName} (Item {mbsItem})</Text>

        <Text style={styles.detailLabel}>Clinical Category:</Text>
        <Text style={styles.detailText}>{clinicalCategory}</Text>

        <View style={styles.explanationBox}>
          <Text style={styles.explanationText}>💡 {explanation}</Text>
        </View>

        <Text style={styles.detailLabel}>Waiting Period Info:</Text>
        <Text style={styles.detailText}>{waitingPeriod}</Text>
      </View>

      {!isCovered && (
        <View style={styles.affiliateBox}>
          <Text style={styles.affiliateText}>
            This service is not covered under your current product.
          </Text>
          <TouchableOpacity style={styles.affiliateButton} onPress={handleCompareClick}>
            <Text style={styles.affiliateButtonText}>Compare products that do cover it</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.disclaimer}>{disclaimer}</Text>

      <TouchableOpacity style={styles.resetButton} onPress={onReset}>
        <Text style={styles.resetButtonText}>Check Another</Text>
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
    borderTopWidth: 6,
  },
  coveredContainer: {
    borderTopColor: '#28a745',
  },
  notCoveredContainer: {
    borderTopColor: '#dc3545',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 12,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#333',
  },
  resultSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#555',
  },
  detailsBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#777',
    textTransform: 'uppercase',
    marginTop: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  explanationBox: {
    backgroundColor: '#e9ecef',
    padding: 12,
    borderRadius: 4,
    marginVertical: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#495057',
    fontStyle: 'italic',
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  disclaimer: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  resetButton: {
    backgroundColor: '#e0e0e0',
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 16,
  },
  affiliateBox: {
    backgroundColor: '#fff3cd',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffeeba',
    alignItems: 'center',
    marginBottom: 16,
  },
  affiliateText: {
    color: '#856404',
    fontSize: 14,
    marginBottom: 12,
    textAlign: 'center',
  },
  affiliateButton: {
    backgroundColor: '#ffc107',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
  },
  affiliateButtonText: {
    color: '#212529',
    fontWeight: 'bold',
  }
});
