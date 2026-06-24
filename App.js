import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView } from 'react-native';
import CheckForm from './src/components/CheckForm';
import ResultsView from './src/components/ResultsView';

export default function App() {
  const [result, setResult] = useState(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>AusHealth Check</Text>
          <Text style={styles.headerSubtitle}>Instantly check your hospital cover</Text>
        </View>

        {!result ? (
          <CheckForm onCheckResult={setResult} />
        ) : (
          <ResultsView result={result} onReset={() => setResult(null)} />
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            This tool provides general information only and is not personal advice.
            Always confirm coverage, waiting periods, and costs directly with your health insurer and healthcare provider.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginVertical: 32,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0066cc',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 32,
    paddingBottom: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  }
});
