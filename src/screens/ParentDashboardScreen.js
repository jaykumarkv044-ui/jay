import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { getStats, clearStats } from '../utils/storage';

const ParentDashboardScreen = ({ navigation }) => {
  const [stats, setStats] = useState({ totalSessions: 0, totalStars: 0 });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const currentStats = await getStats();
    setStats(currentStats);
  };

  const handleReset = () => {
    Alert.alert(
      "Reset Progress?",
      "Are you sure you want to delete all stars and session history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await clearStats();
            loadStats();
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Parent Dashboard</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Activity Summary</Text>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Play Sessions:</Text>
          <Text style={styles.statValue}>{stats.totalSessions}</Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Total Stars Earned:</Text>
          <Text style={styles.statValue}>⭐️ {stats.totalStars}</Text>
        </View>

      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          Privacy Note: All progress is stored locally on this device. We do not collect or send any personal data to the cloud.
        </Text>
      </View>

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>Reset All Progress</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 20,
  },
  backButton: {
    padding: 10,
  },
  backButtonText: {
    fontSize: 18,
    color: '#0288D1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#263238',
  },
  placeholder: {
    width: 60,
  },
  card: {
    backgroundColor: '#fff',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#37474F',
    borderBottomWidth: 1,
    borderBottomColor: '#CFD8DC',
    paddingBottom: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statLabel: {
    fontSize: 18,
    color: '#546E7A',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
  },
  infoBox: {
    marginHorizontal: 20,
    padding: 15,
    backgroundColor: '#E1F5FE',
    borderRadius: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#0277BD',
    lineHeight: 20,
    textAlign: 'center',
  },
  resetButton: {
    margin: 20,
    marginTop: 'auto',
    marginBottom: 40,
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D32F2F',
    borderRadius: 10,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#D32F2F',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

export default ParentDashboardScreen;
