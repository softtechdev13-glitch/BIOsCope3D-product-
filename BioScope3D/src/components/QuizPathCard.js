import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';

const QuizPathCard = ({ title, description, level, time, xp, isLocked, imageUri, onPress }) => {
  return (
    <TouchableOpacity 
      style={[styles.card, isLocked && styles.lockedCard]} 
      onPress={onPress}
      disabled={isLocked}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        {imageUri && (
          <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
        )}
        <View style={styles.gradientOverlay} />
        {isLocked ? (
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedIcon}>🔒</Text>
          </View>
        ) : (
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{xp} XP</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description} numberOfLines={2}>{description}</Text>
        
        {!isLocked ? (
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>📊</Text>
              <Text style={styles.statText}>{level}</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statIcon}>🕒</Text>
              <Text style={styles.statText}>{time}</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.lockedSubtitle}>Reach Level 10 to unlock Expert Quizzes</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  lockedCard: {
    opacity: 0.8,
  },
  imageContainer: {
    height: 140,
    backgroundColor: '#EAEFFF',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cardImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  xpBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#00C48C',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  xpText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 12,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 30,
    color: colors.primaryDark,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: colors.textLight,
    marginBottom: 15,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  statIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  statText: {
    fontSize: 12,
    color: colors.textLight,
    fontWeight: '500',
  },
  lockedSubtitle: {
    fontSize: 13,
    color: colors.textLight,
    fontStyle: 'italic',
  },
});

export default QuizPathCard;
