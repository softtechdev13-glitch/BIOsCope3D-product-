import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';

const { width } = Dimensions.get('window');

const SubscriptionScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.closeIcon}>✕</Text>
      </TouchableOpacity>
      
      <View style={styles.content}>
        <Text style={styles.emoji}>💎</Text>
        <Text style={styles.title}>Unlock Premium</Text>
        <Text style={styles.subtitle}>You've reached your free daily limit for the AI Anatomy Tutor.</Text>
        
        <View style={styles.features}>
          <Text style={styles.featureItem}>✓ Unlimited AI Tutor Questions</Text>
          <Text style={styles.featureItem}>✓ Access to All 3D Models</Text>
          <Text style={styles.featureItem}>✓ Expert Level Quizzes</Text>
          <Text style={styles.featureItem}>✓ Ad-Free Experience</Text>
        </View>

        <View style={styles.pricingCard}>
          <Text style={styles.price}>$9.99<Text style={styles.period}>/mo</Text></Text>
          <Text style={styles.savings}>Cancel anytime</Text>
        </View>

        <CustomButton 
          title="Upgrade Now" 
          onPress={() => {
            // Fake payment success
            navigation.goBack();
          }} 
          style={styles.upgradeBtn} 
        />
        
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.skipText}>Maybe Later</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    padding: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 10,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textDark,
  },
  content: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 30,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  features: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 12,
    fontWeight: '500',
  },
  pricingCard: {
    width: '100%',
    padding: 20,
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  period: {
    fontSize: 16,
    color: colors.textLight,
  },
  savings: {
    fontSize: 12,
    color: '#00C48C',
    fontWeight: 'bold',
    marginTop: 5,
  },
  upgradeBtn: {
    width: '100%',
    marginBottom: 20,
  },
  skipText: {
    color: colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SubscriptionScreen;
