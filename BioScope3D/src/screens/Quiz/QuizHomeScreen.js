import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Linking } from 'react-native';
import { colors } from '../../theme/colors';
import QuizPathCard from '../../components/QuizPathCard';
import quizService from '../../api/quizService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../../config/apiConfig';
import LinearGradient from 'react-native-linear-gradient';

const QuizHomeScreen = ({ navigation }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizData, historyData] = await Promise.all([
          quizService.getQuizzes(),
          quizService.getHistory()
        ]);
        setQuizzes(quizData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching quiz data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Check if user scored >= 10 on any Basic quiz
  const isAdvanceUnlocked = history.some(h => h.Quiz?.difficulty === 'Basic' && h.score >= 10);

  const handleDownloadPdf = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        alert('You must be logged in to download the PDF.');
        return;
      }
      
      const fullUrl = `${API_CONFIG.BASE_URL}/quizzes/history/pdf?token=${token}`;
      
      // Use Linking to open URL in external browser which handles PDF downloads natively
      Linking.openURL(fullUrl).catch(err => {
        console.error('Failed to open PDF link:', err);
        alert('Could not open PDF link');
      });
    } catch (error) {
      console.error('Error getting PDF url:', error);
      alert('Could not open PDF link');
    }
  };

  return (
    <LinearGradient colors={['#F4F7FF', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>Quiz</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Knowledge Check Title */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>Knowledge Check</Text>
          <Text style={styles.subtitle}>Challenge your understanding of the human anatomy.</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>📝</Text>
            <View>
              <Text style={styles.statLabel}>ATTEMPTS</Text>
              <Text style={styles.statValue}>{history.length}</Text>
            </View>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statIcon}>🏆</Text>
            <View>
              <Text style={styles.statLabel}>BEST SCORE</Text>
              <Text style={styles.statValue}>
                {history.length > 0 ? Math.max(...history.map(h => h.score)) : 0}
              </Text>
            </View>
          </View>
        </View>

        {/* Learning Paths */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Learning Paths</Text>
          <TouchableOpacity onPress={handleDownloadPdf}>
            <Text style={styles.viewAllText}>Download PDF</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color={colors.primary} />
        ) : (
          <View>
            {quizzes.map((quiz, index) => {
              const images = [
                'https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
                'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
              ];
              const imageUri = images[index % images.length];
              
              // Determine if locked
              let locked = false;
              if (quiz.difficulty === 'Advanced' || quiz.title.includes('Advanced')) {
                locked = !isAdvanceUnlocked;
              }

              return (
                <QuizPathCard 
                  key={quiz.id}
                  title={quiz.title}
                  description={quiz.description}
                  level={quiz.difficulty}
                  time="10 min"
                  xp={quiz.xp_reward ? quiz.xp_reward.toString() : '100'}
                  isLocked={locked}
                  imageUri={imageUri}
                  onPress={() => {
                    if (locked) {
                      alert('You must score at least 10 in the Basic Quiz to unlock Advance Mode!');
                    } else {
                      navigation.navigate('QuizQuestion', { quizId: quiz.id });
                    }
                  }}
                />
              );
            })}
          </View>
        )}

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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  notificationBtn: {
    padding: 8,
  },
  bellIcon: {
    fontSize: 18,
    color: colors.primaryDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  titleSection: {
    marginBottom: 20,
  },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 15,
    borderRadius: 16,
    flex: 0.48,
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
    marginRight: 10,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  viewAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
});

export default QuizHomeScreen;
