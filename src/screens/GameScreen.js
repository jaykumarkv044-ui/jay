import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
  Animated
} from 'react-native';
import * as Speech from 'expo-speech';

const EMOTIONS = [
  { id: 'happy', emoji: '😊', prompt: 'Can you find the happy face?', name: 'happy' },
  { id: 'sad', emoji: '😢', prompt: 'Where is the sad face?', name: 'sad' },
  { id: 'sleepy', emoji: '😴', prompt: 'Who is feeling sleepy?', name: 'sleepy' },
  { id: 'surprised', emoji: '😲', prompt: 'Can you find the surprised face?', name: 'surprised' },
];

const ROUNDS_PER_SESSION = 5;

const GameScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [currentRound, setCurrentRound] = useState(0);
  const [targetEmotion, setTargetEmotion] = useState(null);
  const [options, setOptions] = useState([]);
  const [isAnswering, setIsAnswering] = useState(false);

  // Timeouts for cleanup
  const timeoutRefs = useRef([]);

  // Animations for emojis
  const shakeAnimations = useRef(EMOTIONS.map(() => new Animated.Value(0))).current;
  const bounceAnimations = useRef(EMOTIONS.map(() => new Animated.Value(1))).current;

  useEffect(() => {
    startNewRound();

    return () => {
      // Cleanup all timeouts on unmount
      timeoutRefs.current.forEach(clearTimeout);
    };
  }, [currentRound]);

  const startNewRound = () => {
    // Clear any pending timeouts from previous rounds
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];

    if (currentRound >= ROUNDS_PER_SESSION) {
      navigation.replace('Reward');
      return;
    }

    setIsAnswering(false);

    // Pick a random target emotion
    const target = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTargetEmotion(target);

    // Pick 3 random emotions including the target to form options
    // Using Fisher-Yates shuffle
    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
      }
      return array;
    };

    let shuffledOptions = shuffleArray([...EMOTIONS]);

    // Ensure target is in the first 3
    if (!shuffledOptions.slice(0, 3).includes(target)) {
      const targetIndex = shuffledOptions.findIndex(e => e.id === target.id);
      // swap target with the first element
      const temp = shuffledOptions[0];
      shuffledOptions[0] = target;
      shuffledOptions[targetIndex] = temp;
    }

    const finalOptions = shuffleArray(shuffledOptions.slice(0, 3));
    setOptions(finalOptions);

    // Reset animations
    shakeAnimations.forEach(anim => anim.setValue(0));
    bounceAnimations.forEach(anim => anim.setValue(1));

    // Play prompt after a short delay
    const initialPromptTimeout = setTimeout(() => {
      speakPrompt(target.prompt);
    }, 500);
    timeoutRefs.current.push(initialPromptTimeout);
  };

  const speakPrompt = (text) => {
    Speech.stop();
    Speech.speak(text, {
      rate: 0.8, // slower for toddlers
      pitch: 1.2, // slightly higher pitch for friendly tone
    });
  };

  const handleTap = (selectedOption, index) => {
    if (isAnswering) return; // Prevent multiple taps

    if (selectedOption.id === targetEmotion.id) {
      // Correct answer!
      setIsAnswering(true);

      // Cheerful feedback
      Speech.stop();
      Speech.speak("Yay! You found it!", { rate: 0.9, pitch: 1.3 });

      // Bounce animation
      Animated.sequence([
        Animated.timing(bounceAnimations[index], { toValue: 1.5, duration: 300, useNativeDriver: true }),
        Animated.timing(bounceAnimations[index], { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        // Move to next round
        const nextRoundTimeout = setTimeout(() => {
          setCurrentRound(prev => prev + 1);
        }, 500);
        timeoutRefs.current.push(nextRoundTimeout);
      });

    } else {
      // Incorrect answer
      Speech.stop();
      Speech.speak("Oops, try again!", { rate: 0.9, pitch: 1.0 });

      // Gentle shake animation
      Animated.sequence([
        Animated.timing(shakeAnimations[index], { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimations[index], { toValue: -10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimations[index], { toValue: 10, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnimations[index], { toValue: 0, duration: 100, useNativeDriver: true })
      ]).start();

      // Re-prompt after a delay
      const repromptTimeout = setTimeout(() => {
        speakPrompt(targetEmotion.prompt);
      }, 2000);
      timeoutRefs.current.push(repromptTimeout);
    }
  };

  if (!targetEmotion) return null;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.progressText}>⭐️ {currentRound} / {ROUNDS_PER_SESSION}</Text>
        <TouchableOpacity style={styles.speakerButton} onPress={() => speakPrompt(targetEmotion.prompt)}>
          <Text style={styles.speakerIcon}>🔊</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option, index) => {
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.emojiCard, { width: width * 0.4 }]}
              onPress={() => handleTap(option, index)}
              activeOpacity={0.7}
            >
              <Animated.Text style={[
                { fontSize: width * 0.25 },
                {
                  transform: [
                    { translateX: shakeAnimations[index] },
                    { scale: bounceAnimations[index] }
                  ]
                }
              ]}>
                {option.emoji}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9C4', // light yellow
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 24,
  },
  progressText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F57F17',
  },
  speakerButton: {
    padding: 15,
    backgroundColor: '#03A9F4', // light blue
    borderRadius: 40,
    elevation: 3,
  },
  speakerIcon: {
    fontSize: 28,
  },
  optionsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignContent: 'center',
    padding: 10,
  },
  emojiCard: {
    backgroundColor: '#fff',
    aspectRatio: 1,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});

export default GameScreen;
