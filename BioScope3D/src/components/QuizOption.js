import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../theme/colors';

const QuizOption = ({ letter, text, isSelected, isCorrect, showResult, onPress }) => {
  let containerStyle = [styles.container];
  let letterContainerStyle = [styles.letterContainer];
  let letterTextStyle = [styles.letterText];
  let textStyle = [styles.text];

  if (isSelected) {
    containerStyle.push(styles.selectedContainer);
    letterContainerStyle.push(styles.selectedLetterContainer);
    letterTextStyle.push(styles.selectedLetterText);
    textStyle.push(styles.selectedText);
  }

  // Add logic for showing result (correct/incorrect) later if needed
  if (showResult) {
    if (isCorrect) {
      containerStyle.push(styles.correctContainer);
    } else if (isSelected && !isCorrect) {
      containerStyle.push(styles.incorrectContainer);
    }
  }

  return (
    <TouchableOpacity 
      style={containerStyle} 
      onPress={onPress}
      activeOpacity={0.7}
      disabled={showResult}
    >
      <View style={letterContainerStyle}>
        <Text style={letterTextStyle}>{letter}</Text>
      </View>
      <Text style={textStyle}>{text}</Text>
      
      {isSelected && !showResult && (
        <View style={styles.checkIconContainer}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: colors.primary,
    backgroundColor: '#F4F7FF',
  },
  correctContainer: {
    borderColor: '#00C48C',
    backgroundColor: '#E8F8F2',
  },
  incorrectContainer: {
    borderColor: '#FF647C',
    backgroundColor: '#FFF0F2',
  },
  letterContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  selectedLetterContainer: {
    backgroundColor: colors.primary,
  },
  letterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  selectedLetterText: {
    color: colors.white,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '500',
  },
  selectedText: {
    color: colors.primaryDark,
    fontWeight: 'bold',
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default QuizOption;
