import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../theme/colors';
import ProgressBar from './ProgressBar';

const { width } = Dimensions.get('window');

const RecentLearningCard = ({ title, subtitle, progress, imagePlaceholder, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        {/* Placeholder for the 3D organ image */}
        <View style={styles.imagePlaceholder}>
          <Text style={styles.imageText}>{imagePlaceholder}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{progress}% Done</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={1}>{title}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} color={colors.primary} height={3} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.65,
    backgroundColor: colors.white,
    borderRadius: 16,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    height: 120,
    backgroundColor: '#F0F4F8',
    position: 'relative',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageText: {
    color: colors.textLight,
    fontSize: 12,
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#00897B', // A teal/green color indicating progress
    fontSize: 12,
    fontWeight: 'bold',
  },
  infoContainer: {
    padding: 15,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textDark,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 'auto',
  },
});

export default RecentLearningCard;
