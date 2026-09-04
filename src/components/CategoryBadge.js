import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCategoryById, getStatusByValue } from '../services/categoryService';

export default function CategoryBadge({ category, status, size = 'medium' }) {
  const categoryData = getCategoryById(category);
  const statusData = getStatusByValue(status);
  
  const data = status ? statusData : categoryData;
  const label = status ? statusData?.label : category;
  const backgroundColor = data?.color || '#999999';

  const sizes = {
    small: { paddingVertical: 4, paddingHorizontal: 8, fontSize: 10 },
    medium: { paddingVertical: 6, paddingHorizontal: 12, fontSize: 12 },
    large: { paddingVertical: 8, paddingHorizontal: 16, fontSize: 14 },
  };

  const currentSize = sizes[size];

  return (
    <View 
      style={[
        styles.badge, 
        { backgroundColor, ...currentSize }
      ]}
    >
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    marginRight: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});