import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import * as Speech from 'expo-speech';
import { updateStats } from '../utils/storage';

const { width } = Dimensions.get('window');
const ROUNDS_PER_SESSION = 5;

const RewardScreen = ({ navigation }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Save stats upon completing a session
    updateStats(ROUNDS_PER_SESSION);

    // Play celebration audio
    Speech.speak("Great job! You are an emotion detective!", { rate: 0.9, pitch: 1.2 });

    // Animate the reward appearance
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();

  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>You did it!</Text>

        <Animated.View style={[styles.rewardContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.trophy}>🏆</Text>
          <View style={styles.starsContainer}>
            {[...Array(ROUNDS_PER_SESSION)].map((_, i) => (
              <Text key={i} style={styles.star}>⭐️</Text>
            ))}
          </View>
        </Animated.View>

        <TouchableOpacity
          style={styles.playAgainButton}
          onPress={() => navigation.replace('Game')}
        >
          <Text style={styles.playAgainButtonText}>PLAY AGAIN 🔄</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.homeButtonText}>Home 🏠</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9' // light green
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 40,
  },
  rewardContainer: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 40,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    marginBottom: 50,
  },
  trophy: {
    fontSize: 100,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  star: {
    fontSize: 30,
    marginHorizontal: 5,
  },
  playAgainButton: {
    backgroundColor: '#4CAF50', // green
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  playAgainButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  homeButton: {
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4CAF50',
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  homeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
  }
});

export default RewardScreen;
