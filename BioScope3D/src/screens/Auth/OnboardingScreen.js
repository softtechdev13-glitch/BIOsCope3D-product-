import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Explore Human Anatomy\nin 3D',
    description: 'Dive into a high-fidelity laboratory experience. Rotate, zoom, and dissect anatomical systems with intuitive touch gestures.',
    imageSource: require('../../assets/images/onboarding_1.png')
  },
  {
    id: '2',
    title: 'Learn Faster with\nInteractive Quizzes',
    description: 'Gamify your medical education with flashcards and quizzes designed for long-term retention of complex terminology.',
    imageSource: require('../../assets/images/onboarding_2.png')
  },
  {
    id: '3',
    title: 'Track Your Progress and\nMaster Anatomy',
    description: 'Personalized learning paths that adapt to your knowledge gaps. Earn XP and badges as you master every organ system.',
    imageSource: require('../../assets/images/onboarding_3.png')
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login'); 
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BioScope 3D</Text>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Image 
          source={currentSlide.imageSource} 
          style={styles.onboardingImage} 
          resizeMode="contain"
        />

        <Text style={styles.title}>{currentSlide.title}</Text>
        <Text style={styles.description}>
          {currentSlide.description}
        </Text>

        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index && styles.activeDot
              ]} 
            />
          ))}
        </View>
      </View>

      <View style={styles.footer}>
        <CustomButton 
          title={currentIndex === slides.length - 1 ? "Get Started" : "Next →"} 
          onPress={handleNext} 
          style={currentIndex === slides.length - 1 ? styles.getStartedButton : styles.nextButton}
          textStyle={currentIndex === slides.length - 1 ? styles.getStartedButtonText : styles.nextButtonText}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  skipText: {
    fontSize: 14,
    color: colors.textLight,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    alignItems: 'center',
  },
  onboardingImage: {
    width: width * 0.8,
    height: 300,
    marginBottom: 40,
    borderRadius: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1D5DB',
    marginHorizontal: 4,
  },
  activeDot: {
    width: 20,
    backgroundColor: colors.primary,
  },
  footer: {
    paddingBottom: 40,
  },
  nextButton: {
    backgroundColor: '#EAEFFF',
    borderRadius: 25,
  },
  nextButtonText: {
    color: colors.primary,
  },
  getStartedButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
  },
  getStartedButtonText: {
    color: colors.white,
  },
});

export default OnboardingScreen;
