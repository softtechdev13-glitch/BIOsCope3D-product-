import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import ProgressBar from '../../components/ProgressBar';
import QuizOption from '../../components/QuizOption';
import CustomButton from '../../components/CustomButton';
import quizService from '../../api/quizService';

const QuizQuestionScreen = ({ navigation, route }) => {
  const quizId = route?.params?.quizId;
  const systemName = route?.params?.systemName;

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        let data;
        if (systemName) {
          data = await quizService.getSystemQuiz(systemName);
        } else if (quizId) {
          data = await quizService.getQuizQuestions(quizId);
        } else {
          throw new Error('No quiz identifier provided');
        }
        setQuiz(data);
      } catch (error) {
        console.error('Error fetching quiz:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizData();
  }, [quizId, systemName]);

  // Timer logic
  useEffect(() => {
    if (loading || !quiz || quiz.questions.length === 0) return;
    
    if (timeLeft <= 0) {
      // Auto submit when time is up
      submitQuiz(score);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, quiz, score]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const submitQuiz = async (finalScore) => {
    try {
      await quizService.submitProgress(quiz.id, finalScore);
    } catch (err) {
      console.error('Error submitting progress:', err);
    }
    navigation.replace('QuizResult', { score: finalScore, total: quiz.questions.length, xp: quiz.xp_reward });
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textLight }}>No questions available for this quiz.</Text>
        <CustomButton title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleOptionSelect = (index) => {
    if (isAnswerRevealed) return; // Prevent changing answer
    setSelectedOption(index);
    setIsAnswerRevealed(true);
    
    if (currentQuestion.options[index]?.is_correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
    } else {
      // Finish quiz
      submitQuiz(score);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.icon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>BioScope 3D</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <Text style={styles.icon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Progress & Timer */}
        <View style={styles.progressHeader}>
          <View>
            <View style={styles.questionCountRow}>
              <Text style={styles.questionLabel}>QUESTION</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{currentQuestionIndex + 1} OF {quiz.questions.length}</Text>
              </View>
            </View>
          </View>
          <View style={styles.timerRow}>
            <Text style={styles.timerIcon}>⏱️</Text>
            <Text style={[styles.timerText, timeLeft < 60 && { color: 'red' }]}>{formatTime(timeLeft)}</Text>
          </View>
        </View>
        <ProgressBar progress={progress} color={colors.primary} height={4} />

        {/* Question Card */}
        <View style={styles.questionCard}>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{quiz.xp_reward} XP</Text>
          </View>
          <View style={styles.imagePlaceholder}>
            <Text style={styles.imageText}>{quiz.category} Model</Text>
          </View>
          <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {currentQuestion.options.map((opt, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            
            // Determine styles based on reveal state
            let bgColor = colors.white;
            let borderColor = colors.border;
            
            if (isAnswerRevealed) {
              if (opt.is_correct) {
                bgColor = '#E8F5E9'; // Light Green
                borderColor = '#4CAF50';
              } else if (selectedOption === index) {
                bgColor = '#FFEBEE'; // Light Red
                borderColor = '#F44336';
              }
            } else if (selectedOption === index) {
              bgColor = '#EAEFFF';
              borderColor = colors.primary;
            }

            return (
              <TouchableOpacity 
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 15,
                  borderRadius: 12,
                  borderWidth: 1,
                  marginBottom: 10,
                  backgroundColor: bgColor,
                  borderColor: borderColor
                }}
                onPress={() => handleOptionSelect(index)}
                activeOpacity={0.7}
              >
                <View style={{
                  width: 30, height: 30, borderRadius: 15, 
                  backgroundColor: isAnswerRevealed && opt.is_correct ? '#4CAF50' : (selectedOption === index ? colors.primary : '#F0F4F8'),
                  justifyContent: 'center', alignItems: 'center', marginRight: 15
                }}>
                  <Text style={{ color: selectedOption === index || (isAnswerRevealed && opt.is_correct) ? colors.white : colors.textLight, fontWeight: 'bold' }}>
                    {letter}
                  </Text>
                </View>
                <Text style={{ flex: 1, fontSize: 16, color: colors.textDark, fontWeight: '500' }}>{opt.text}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Explanation */}
        {isAnswerRevealed && currentQuestion.explanation ? (
          <View style={{ backgroundColor: '#FFF3CD', padding: 15, borderRadius: 12, marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', color: '#856404', marginBottom: 5 }}>Explanation:</Text>
            <Text style={{ color: '#856404', lineHeight: 20 }}>{currentQuestion.explanation}</Text>
          </View>
        ) : null}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <CustomButton 
            title={currentQuestionIndex < quiz.questions.length - 1 ? "Next Question →" : "Finish Quiz"} 
            onPress={handleNext} 
            style={[styles.nextButton, !isAnswerRevealed && { opacity: 0.5 }]}
            disabled={!isAnswerRevealed}
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
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  questionCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  questionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
    letterSpacing: 1,
    marginRight: 10,
  },
  badge: {
    backgroundColor: '#EAEFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: colors.primary,
  },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timerIcon: {
    fontSize: 14,
    marginRight: 5,
  },
  timerText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.border,
  },
  xpBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#00C48C',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 1,
  },
  xpText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 10,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    backgroundColor: '#F0F4F8',
    borderRadius: 75,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imageText: {
    color: colors.textLight,
    fontSize: 12,
  },
  questionText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    textAlign: 'center',
    lineHeight: 24,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  nextButton: {
    flex: 1,
    marginRight: 10,
  },
  hintButton: {
    width: 50,
    height: 50,
    backgroundColor: colors.white,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  hintIcon: {
    fontSize: 20,
  },
  skipContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  skipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
  },
});

export default QuizQuestionScreen;
