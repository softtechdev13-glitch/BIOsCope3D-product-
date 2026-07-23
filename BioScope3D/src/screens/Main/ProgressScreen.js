import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import AchievementBadge from '../../components/AchievementBadge';
import userService from '../../api/userService';
import quizService from '../../api/quizService';
import contentService from '../../api/contentService';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { Flame, ChevronRight, Trophy, Brain, Medal } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProgressScreen = () => {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [totalModules, setTotalModules] = useState(16);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, historyData, systemsData] = await Promise.all([
          userService.getProfile(),
          quizService.getHistory(),
          contentService.getSystems()
        ]);
        setProfile(profileData);
        setHistory(historyData);
        setTotalModules(systemsData.length > 0 ? systemsData.length : 16);
      } catch (error) {
        console.error('Error fetching data in ProgressScreen:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // Calculate dynamic values
  const completedModules = profile?.certificates || 0;
  const masteryPercentage = totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0;
  const currentXp = profile?.xp || 0;
  const currentLevel = profile?.level || 1;
  const streak = profile?.streak || 0;
  const nextLevelXp = currentLevel * 500;
  const xpPercentage = Math.min(Math.round((currentXp / nextLevelXp) * 100), 100);

  // Get last 6 quiz scores
  const last6Quizzes = history.slice(0, 6).reverse();
  const getBadgeColor = (score) => {
    if (score >= 80) return '#00C48C';
    if (score >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <LinearGradient colors={['#F4F7FF', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <Text style={styles.logoText}>BioScope 3D</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Mastery Ring */}
        <View style={styles.masteryCard}>
          <View style={styles.radialContainer}>
            <View style={styles.radialCircle}>
              <Text style={styles.scoreText}>{masteryPercentage}%</Text>
              <Text style={styles.scoreLabel}>OVERALL</Text>
            </View>
          </View>
          <Text style={styles.masteryTitle}>Curriculum Mastery</Text>
          <Text style={styles.masterySubtitle}>You've completed {completedModules}/{totalModules} modules</Text>
        </View>

        {/* Level Progress */}
        <View style={styles.levelCard}>
          <View style={styles.levelHeader}>
            <View>
              <Text style={styles.levelLabel}>LEVEL {currentLevel}</Text>
              <Text style={styles.levelTitle}>BioScope Explorer</Text>
              <Text style={styles.levelXp}>{currentXp.toLocaleString()} XP</Text>
            </View>
            <View style={styles.proBadge}>
              <Text style={styles.proText}>{profile?.is_premium ? 'PRO' : 'FREE'}</Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBarFill, { width: `${xpPercentage}%` }]} />
          </View>
          <Text style={styles.nextLevelText}>Next: {nextLevelXp.toLocaleString()} XP</Text>
        </View>

        {/* Daily Streak */}
        <TouchableOpacity style={styles.streakCard}>
          <View style={styles.streakIconContainer}>
            <Flame size={moderateScale(18)} color="#FF6D00" />
          </View>
          <View style={styles.streakContent}>
            <Text style={styles.streakLabel}>Daily Streak</Text>
            <Text style={styles.streakValue}>{streak} Days</Text>
          </View>
          <ChevronRight size={moderateScale(20)} color={colors.textLight} />
        </TouchableOpacity>

        {/* Quiz Performance Chart */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Quiz Performance</Text>
          <Text style={styles.viewAllText}>Last {last6Quizzes.length} Quizzes</Text>
        </View>
        <View style={styles.chartCard}>
          <View style={styles.mockChartGrid} />
          
          {last6Quizzes.length === 0 ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: colors.textLight }}>No quizzes taken yet.</Text>
            </View>
          ) : (
            <>
              <View style={styles.mockBarsContainer}>
                {last6Quizzes.map((quiz, index) => {
                  const heightPercent = Math.max(10, Math.min(100, (quiz.score / 20) * 100)); // assuming 20 questions
                  return (
                    <View 
                      key={quiz.id || index} 
                      style={[styles.mockBar, { height: `${heightPercent}%`, backgroundColor: getBadgeColor((quiz.score/20)*100) }]} 
                    />
                  );
                })}
              </View>
              <View style={styles.chartLabels}>
                {last6Quizzes.map((quiz, index) => (
                  <Text key={index} style={styles.chartLabelText}>Q{index + 1}</Text>
                ))}
              </View>
            </>
          )}
        </View>

        {/* Study Engagement (Real Total Data instead of mock daily chart) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Total Study Engagement</Text>
        </View>
        <View style={[styles.chartCard, { height: verticalScale(100), justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={{ fontSize: moderateScale(32), fontWeight: 'bold', color: colors.primary }}>
            {profile?.study_time_minutes || 0}
          </Text>
          <Text style={{ fontSize: moderateScale(14), color: colors.textLight }}>Total Minutes Studied</Text>
        </View>

        {/* Recent Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllTextActive}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          {streak >= 3 && <AchievementBadge icon={<Flame size={moderateScale(24)} color="#FF6D00" />} label="Streak Master" color="#FF6D00" />}
          {currentLevel >= 2 && <AchievementBadge icon={<Trophy size={moderateScale(24)} color="#00C48C" />} label="Fast Learner" color="#00C48C" />}
          {currentLevel >= 5 && <AchievementBadge icon={<Brain size={moderateScale(24)} color={colors.primary} />} label="Brainiac" color={colors.primary} />}
          {completedModules >= 5 && <AchievementBadge icon={<Medal size={moderateScale(24)} color="#00897B" />} label="Expert" color="#00897B" />}
          {streak < 3 && currentLevel < 2 && completedModules < 5 && (
            <Text style={{ color: colors.textLight, marginLeft: scale(10) }}>Keep studying to unlock achievements!</Text>
          )}
        </ScrollView>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(15),
    backgroundColor: 'transparent',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.primaryDark,
    textAlign: 'center',
  },
  notificationBtn: {
    padding: moderateScale(8),
  },
  bellIcon: {
    fontSize: moderateScale(18),
    color: colors.primaryDark,
  },
  scrollContent: {
    padding: moderateScale(20),
    paddingBottom: verticalScale(110),
  },
  masteryCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(20),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radialContainer: {
    marginVertical: verticalScale(10),
  },
  radialCircle: {
    width: moderateScale(120),
    height: moderateScale(120),
    borderRadius: moderateScale(60),
    borderWidth: moderateScale(8),
    borderColor: colors.primary, // Progress color
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: colors.primary,
    borderRightColor: colors.primary,
    borderBottomColor: '#EAEFFF',
    borderLeftColor: colors.primary, 
    transform: [{ rotate: '45deg' }], // Simulated 75%
  },
  scoreText: {
    fontSize: moderateScale(28),
    fontWeight: 'bold',
    color: colors.primaryDark,
    transform: [{ rotate: '-45deg' }],
  },
  scoreLabel: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
    transform: [{ rotate: '-45deg' }],
  },
  masteryTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: verticalScale(10),
    marginBottom: verticalScale(4),
  },
  masterySubtitle: {
    fontSize: moderateScale(12),
    color: colors.textLight,
  },
  levelCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: verticalScale(15),
  },
  levelLabel: {
    fontSize: moderateScale(10),
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginBottom: verticalScale(4),
  },
  levelTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: verticalScale(4),
  },
  levelXp: {
    fontSize: moderateScale(12),
    color: colors.textLight,
  },
  proBadge: {
    backgroundColor: '#E8F8F2',
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(10),
  },
  proText: {
    color: '#00C48C',
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: verticalScale(8),
    backgroundColor: '#EAEFFF',
    borderRadius: moderateScale(4),
    marginBottom: verticalScale(8),
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: moderateScale(4),
  },
  nextLevelText: {
    fontSize: moderateScale(10),
    color: colors.textLight,
    textAlign: 'right',
  },
  streakCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    alignItems: 'center',
    marginBottom: verticalScale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  streakIconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#FFF0F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  streakIcon: {
    fontSize: moderateScale(18),
  },
  streakContent: {
    flex: 1,
  },
  streakLabel: {
    fontSize: moderateScale(10),
    color: colors.textLight,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  streakValue: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
  },
  chevron: {
    fontSize: moderateScale(20),
    color: colors.textLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
  },
  viewAllText: {
    fontSize: moderateScale(12),
    color: colors.textLight,
    fontWeight: '500',
  },
  viewAllTextActive: {
    fontSize: moderateScale(12),
    color: colors.primary,
    fontWeight: 'bold',
  },
  chartCard: {
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(25),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
    height: verticalScale(200),
  },
  mockChartGrid: {
    position: 'absolute',
    top: verticalScale(20),
    bottom: verticalScale(40),
    left: scale(20),
    right: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mockBarsContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mockBar: {
    width: scale(12),
    backgroundColor: '#EAEFFF',
    borderTopLeftRadius: moderateScale(6),
    borderTopRightRadius: moderateScale(6),
  },
  mockLineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: verticalScale(10),
    overflow: 'hidden',
  },
  mockCurve: {
    width: '120%',
    height: verticalScale(80),
    borderTopWidth: verticalScale(3),
    borderTopColor: colors.primary,
    borderRadius: moderateScale(100), // Makes a curve
    marginTop: verticalScale(60),
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: verticalScale(10),
  },
  chartLabelText: {
    fontSize: moderateScale(10),
    color: colors.textLight,
  },
  achievementsScroll: {
    marginBottom: verticalScale(20),
  },
});

export default ProgressScreen;
