import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { colors } from '../theme/colors';
import { scale, verticalScale, moderateScale } from '../utils/responsive';

const BodySystemCard = ({ title, subtitle, icon, iconBg, thumbnailUrl, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* Faded Background Watermark Icon */}
      <View style={styles.watermarkContainer}>
        {/* We just omit the watermark text scaling to avoid complex SVG manipulation here */}
      </View>
      
      {/* Main Content */}
      <View style={[styles.iconContainer, { backgroundColor: iconBg || '#F8FAFC', overflow: 'hidden' }]}>
        {thumbnailUrl ? (
          <Image source={{ uri: thumbnailUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        ) : (
          icon
        )}
      </View>
      
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: moderateScale(20),
    padding: moderateScale(16),
    marginBottom: verticalScale(16),
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F4F8',
    // Soft shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    minHeight: verticalScale(140),
    justifyContent: 'space-between',
  },
  watermarkContainer: {
    position: 'absolute',
    top: verticalScale(-10),
    right: scale(-15),
    opacity: 0.05,
    transform: [{ scale: 3 }],
  },
  watermarkIcon: {
    fontSize: moderateScale(40),
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    backgroundColor: '#F8FAFC',
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(20),
  },
  icon: {
    fontSize: moderateScale(20),
  },
  textContainer: {
    marginTop: 'auto',
  },
  title: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: verticalScale(4),
  },
  subtitle: {
    fontSize: moderateScale(11),
    color: '#64748B',
    fontWeight: '500',
  },
});

export default BodySystemCard;
