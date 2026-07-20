import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { colors } from '../../theme/colors';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    // Simulate loading time before navigating to Onboarding
    setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image 
          source={require('../../assets/images/splash.png')} 
          style={styles.splashImage} 
        />
        <Text style={styles.title}>BioScope <Text style={styles.highlight}>3D</Text></Text>
        <Text style={styles.subtitle}>EXPLORE THE HUMAN BODY IN 3D</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.progressBar} />
        <Text style={styles.loadingText}>Loading Skeletal Assets...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splashBackground,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  splashImage: {
    width: 250,
    height: 350,
    borderRadius: 20,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    color: colors.white,
    fontWeight: 'bold',
  },
  highlight: {
    color: '#00E5FF', // Cyan highlight for "3D"
  },
  subtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 10,
    letterSpacing: 1.5,
  },
  footer: {
    paddingBottom: 50,
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    marginBottom: 10,
  },
  loadingText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
  },
});

export default SplashScreen;
