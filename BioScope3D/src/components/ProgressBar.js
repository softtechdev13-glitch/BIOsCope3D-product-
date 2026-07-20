import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';

const ProgressBar = ({ progress, color = colors.primary, height = 4 }) => {
  return (
    <View style={[styles.container, { height }]}>
      <View 
        style={[
          styles.fill, 
          { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: color }
        ]} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: colors.border,
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
});

export default ProgressBar;
