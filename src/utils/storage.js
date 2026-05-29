import AsyncStorage from '@react-native-async-storage/async-storage';

const STATS_KEY = '@emotion_detective_stats';

export const getStats = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(STATS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : { totalSessions: 0, totalStars: 0 };
  } catch (e) {
    console.error("Failed to fetch stats", e);
    return { totalSessions: 0, totalStars: 0 };
  }
};

export const updateStats = async (newStars) => {
  try {
    const currentStats = await getStats();
    const updatedStats = {
      totalSessions: currentStats.totalSessions + 1,
      totalStars: currentStats.totalStars + newStars,
    };
    await AsyncStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
    return updatedStats;
  } catch (e) {
    console.error("Failed to update stats", e);
  }
};

export const clearStats = async () => {
  try {
    await AsyncStorage.removeItem(STATS_KEY);
  } catch (e) {
    console.error("Failed to clear stats", e);
  }
};
