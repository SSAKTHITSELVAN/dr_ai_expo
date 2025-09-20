import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage helpers
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.error('Error storing data:', e);
  }
};

export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error getting data:', e);
    return null;
  }
};

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data:', e);
  }
};

// Format helpers
export const formatCurrency = (amount) => {
  return `₹${amount?.toLocaleString('en-IN') || 0}`;
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN');
};

export const truncateText = (text, maxLength) => {
  if (text?.length <= maxLength) return text;
  return text?.substring(0, maxLength) + '...';
};