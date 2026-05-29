import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Emotion Detective 🔍</Text>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Game')}
        >
          <Text style={styles.playButtonText}>PLAY ▶️</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.parentsButton}
        onLongPress={() => navigation.navigate('ParentPIN')}
        delayLongPress={1500} // Require a 1.5s hold to access
      >
        <Text style={styles.parentsButtonText}>Parents (Hold)</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F7FA' // light blue background
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#006064',
    marginBottom: 60,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#FFEB3B', // yellow
    paddingVertical: 20,
    paddingHorizontal: 60,
    borderRadius: 50,
    elevation: 5, // shadow for android
    shadowColor: '#000', // shadow for ios
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    minWidth: width * 0.6,
    alignItems: 'center',
  },
  playButtonText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#E65100', // orange
  },
  parentsButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
  },
  parentsButtonText: {
    fontSize: 16,
    color: '#555',
    fontWeight: '600',
  }
});

export default HomeScreen;
