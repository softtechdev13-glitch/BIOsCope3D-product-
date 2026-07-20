import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Lock } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const AchievementBadge = ({ icon, label, color, isLocked }) => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.iconContainer, 
        { backgroundColor: isLocked ? '#F0F4F8' : color + '20' } // 20 is for 12% opacity hex
      ]}>
        {isLocked ? <Lock size={moderateScale(24)} color="#A0AABF" /> : icon}
      </View>
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginRight: scale(20),
    marginBottom: verticalScale(15),
  },
  iconContainer: {
    width: moderateScale(60),
    height: moderateScale(60),
    borderRadius: moderateScale(16),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(8),
  },
  icon: {
    fontSize: moderateScale(24),
  },
  label: {
    fontSize: moderateScale(10),
    color: colors.textDark,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AchievementBadge;
