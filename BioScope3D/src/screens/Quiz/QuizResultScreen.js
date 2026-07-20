import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';

const QuizResultScreen = ({ navigation, route }) => {
  const { score = 0, total = 20, xp = 100 } = route?.params || {};
  
  const percentage = Math.round((score / total) * 100) || 0;
  const isAdvanceUnlocked = score >= 10;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('MainApp', { screen: 'Quiz' })} style={styles.iconBtn}>
          <Text style={styles.icon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>BioScope 3D</Text>
        <View style={styles.headerRight}>
          <View style={styles.avatarPlaceholderSmall} />
          <TouchableOpacity style={styles.iconBtn}>
            <Text style={styles.icon}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Radial Progress Placeholder */}
        <View style={styles.radialContainer}>
          <View style={styles.radialCircle}>
            <Text style={styles.scoreText}>{percentage}%</Text>
            <Text style={styles.scoreLabel}>SCORE</Text>
          </View>
        </View>

        <Text style={styles.title}>{percentage >= 80 ? 'Excellent Work!' : percentage >= 50 ? 'Good Effort!' : 'Keep Practicing!'}</Text>
        
        {isAdvanceUnlocked ? (
          <Text style={[styles.subtitle, { color: '#4CAF50', fontWeight: 'bold' }]}>
            🎉 Congratulations! You scored 10 or more. Advance Mode is now unlocked!
          </Text>
        ) : (
          <Text style={styles.subtitle}>
            Score at least 10 out of 20 to unlock Advance Mode. You scored {score}.
          </Text>
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>⭐</Text>
            <Text style={styles.statValue}>+{isAdvanceUnlocked ? xp : Math.floor(xp/2)}</Text>
            <Text style={styles.statLabel}>XP Earned</Text>
          </View>
          <View style={styles.statBox}>
            <View style={styles.statIconWrapper}>
              <Text style={styles.statIconWhite}>✓</Text>
            </View>
            <Text style={styles.statValue}>{score}/{total}</Text>
            <Text style={styles.statLabel}>Correct</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.retryButton} onPress={() => navigation.navigate('MainApp', { screen: 'Quiz' })}>
            <Text style={styles.retryText}>Back to Quizzes</Text>
          </TouchableOpacity>
          <CustomButton 
            title="Continue Learning →" 
            onPress={() => navigation.navigate('MainApp')} 
            style={styles.continueButton}
          />
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: colors.white,
  },
  iconBtn: {
    padding: 5,
  },
  icon: {
    fontSize: 18,
    color: colors.textDark,
  },
  logoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholderSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#EAEFFF',
    marginRight: 10,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    alignItems: 'center',
  },
  radialContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  radialCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: '#00897B', // Progress color
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#00897B',
    borderRightColor: '#00897B',
    borderBottomColor: '#00897B',
    borderLeftColor: '#EAEFFF', // Unfilled portion
    transform: [{ rotate: '45deg' }], // Simple trick to make it look like 85%
  },
  scoreText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.textDark,
    transform: [{ rotate: '-45deg' }],
  },
  scoreLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
    transform: [{ rotate: '-45deg' }],
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  statBox: {
    flex: 0.48,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  statIconWrapper: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#00C48C',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statIconWhite: {
    color: colors.white,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textLight,
  },
  areasSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
    letterSpacing: 1,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 10,
  },
  strongPill: {
    backgroundColor: '#E8F8F2',
  },
  strongPillText: {
    color: '#00897B',
    fontSize: 12,
    fontWeight: 'bold',
  },
  focusPill: {
    backgroundColor: '#FFF0F2',
  },
  focusPillText: {
    color: '#FF647C',
    fontSize: 12,
    fontWeight: 'bold',
  },
  recommendedCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  recommendedIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#EAEFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  recommendedIcon: {
    fontSize: 20,
  },
  recommendedContent: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  recommendedSubtitle: {
    fontSize: 12,
    color: colors.textLight,
    lineHeight: 18,
  },
  chevron: {
    fontSize: 24,
    color: colors.textLight,
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  retryButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 25,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    marginRight: 10,
    flex: 0.4,
    alignItems: 'center',
  },
  retryText: {
    color: colors.textDark,
    fontWeight: 'bold',
  },
  continueButton: {
    flex: 0.6,
  },
});

export default QuizResultScreen;
