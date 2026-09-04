import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function ProgressBar({ progress = 0, color = '#2ECC71' }) {
  // Garante que o progresso é um número válido e está estritamente entre 0 e 100
  const validProgress = Number(progress) || 0;
  const clampedProgress = Math.min(Math.max(validProgress, 0), 100);

  return (
    <View style={styles.container}>
      <View style={styles.background}>
        <View 
          style={[
            styles.fill, 
            { 
              width: `${clampedProgress}%`,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  background: {
    height: 8,
    backgroundColor: '#DDDDDD',
    borderRadius: 100,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 100,
  },
});