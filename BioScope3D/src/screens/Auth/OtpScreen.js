import React, { useState, useContext, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, KeyboardAvoidingView, Platform, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';
import { AuthContext } from '../../context/AuthContext';

const OtpScreen = ({ route, navigation }) => {
  const { email, type = 'SIGNUP' } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const { verifyAndRegister, verifyResetOtp, isLoading } = useContext(AuthContext);

  useEffect(() => {
    if (!email) {
      Alert.alert('Error', 'Missing email parameter');
      navigation.goBack();
    }
  }, [email]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance
    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length < 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    if (type === 'SIGNUP') {
      const result = await verifyAndRegister(email, otpString);
      if (!result.success) {
        Alert.alert('Verification Failed', result.message);
      }
    } else {
      // It's a password reset OTP verification step
      // Navigate to Reset Password Screen with email and OTP
      navigation.navigate('ResetPassword', { email, otp: otpString });
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>
        <Text style={styles.title}>Verify Your Email</Text>
        <Text style={styles.subtitle}>
          We've sent a 6-digit code to <Text style={styles.emailText}>{email}</Text>
        </Text>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <CustomButton 
        title={isLoading ? "Verifying..." : "Verify Code"} 
        onPress={handleVerify}
        disabled={isLoading || otp.join('').length < 6}
        style={{ marginTop: 30 }}
      />

      <TouchableOpacity style={styles.resendContainer} disabled={isLoading}>
        <Text style={styles.resendText}>Didn't receive the code? <Text style={styles.resendLink}>Resend</Text></Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconContainer: {
    width: 70,
    height: 70,
    backgroundColor: '#EAEFFF',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  emailText: {
    fontWeight: 'bold',
    color: colors.textDark,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.white,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  resendContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 14,
    color: colors.textLight,
  },
  resendLink: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default OtpScreen;
