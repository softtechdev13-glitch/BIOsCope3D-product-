import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '../../theme/colors';

const PaywallScreen = ({ navigation }) => {
  const [selectedPlan, setSelectedPlan] = useState('yearly');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Close Button */}
        <TouchableOpacity style={styles.closeBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.closeIcon}>×</Text>
        </TouchableOpacity>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.proBadge}>
            <Text style={styles.proBadgeIcon}>★</Text>
            <Text style={styles.proBadgeText}>BIOSCOPE PRO</Text>
          </View>
          <Text style={styles.title}>Unlock the Full Human Experience</Text>
          <Text style={styles.subtitle}>Master anatomy with high-fidelity 3D models and AI-powered guidance.</Text>
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          <View style={styles.featureBox}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#EAEFFF' }]}>
              <Text style={styles.featureIcon}>👩‍🏫</Text>
            </View>
            <Text style={styles.featureText}>Unlimited AI Tutor access</Text>
          </View>
          <View style={styles.featureBox}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#E8F8F2' }]}>
              <Text style={styles.featureIcon}>📝</Text>
            </View>
            <Text style={styles.featureText}>Expert Quiz levels</Text>
          </View>
          <View style={styles.featureBox}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#E0F7FA' }]}>
              <Text style={styles.featureIcon}>🧭</Text>
            </View>
            <Text style={styles.featureText}>Offline 3D Atlas</Text>
          </View>
          <View style={styles.featureBox}>
            <View style={[styles.featureIconContainer, { backgroundColor: '#F0F4F8' }]}>
              <Text style={styles.featureIcon}>📊</Text>
            </View>
            <Text style={styles.featureText}>Detailed Progress Reports</Text>
          </View>
        </View>

        {/* Pricing Plans */}
        <View style={styles.plansContainer}>
          
          {/* Monthly Plan */}
          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planCardActive]}
            onPress={() => setSelectedPlan('monthly')}
          >
            <View style={styles.radioContainer}>
              <View style={[styles.radio, selectedPlan === 'monthly' && styles.radioActive]}>
                {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Monthly</Text>
              <Text style={styles.planDesc}>Cancel anytime</Text>
            </View>
            <View style={styles.planPriceInfo}>
              <Text style={styles.planPrice}>$9.99</Text>
              <Text style={styles.planPeriod}>/month</Text>
            </View>
          </TouchableOpacity>

          {/* Yearly Plan */}
          <TouchableOpacity 
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planCardActive, { marginTop: 15 }]}
            onPress={() => setSelectedPlan('yearly')}
          >
            {/* Best Value Badge */}
            <View style={styles.bestValueBadge}>
              <Text style={styles.bestValueText}>BEST VALUE</Text>
            </View>

            <View style={styles.radioContainer}>
              <View style={[styles.radio, selectedPlan === 'yearly' && styles.radioActive]}>
                {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Yearly</Text>
              <Text style={styles.planDesc}>Save 33% per year</Text>
            </View>
            <View style={styles.planPriceInfo}>
              <Text style={styles.planPrice}>$79.99</Text>
              <Text style={styles.planPeriod}>/year</Text>
            </View>
          </TouchableOpacity>

        </View>

        {/* CTA Button */}
        <TouchableOpacity style={styles.ctaBtn}>
          <Text style={styles.ctaText}>Upgrade to Pro</Text>
          <Text style={styles.ctaIcon}>›</Text>
        </TouchableOpacity>

        {/* Footer */}
        <TouchableOpacity style={styles.restoreBtn}>
          <Text style={styles.restoreText}>RESTORE PURCHASE</Text>
        </TouchableOpacity>
        <Text style={styles.disclaimerText}>
          Subscriptions will automatically renew unless canceled 24 hours before the end of the current period.
        </Text>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  scrollContent: {
    padding: 25,
    paddingTop: 50,
    paddingBottom: 40,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  closeIcon: {
    fontSize: 24,
    color: colors.textDark,
    lineHeight: 26,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  proBadge: {
    flexDirection: 'row',
    backgroundColor: '#EAEFFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
  },
  proBadgeIcon: {
    color: colors.primary,
    marginRight: 6,
    fontSize: 12,
  },
  proBadgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 35,
  },
  featureBox: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 18,
  },
  featureText: {
    fontSize: 12,
    color: colors.textDark,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 18,
  },
  plansContainer: {
    marginBottom: 30,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 16,
    padding: 20,
    backgroundColor: colors.white,
  },
  planCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#F5F7FF', // Very light primary tint
  },
  radioContainer: {
    marginRight: 15,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioActive: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  planDesc: {
    fontSize: 12,
    color: colors.textLight,
  },
  planPriceInfo: {
    alignItems: 'flex-end',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  planPeriod: {
    fontSize: 10,
    color: colors.textLight,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
  },
  bestValueText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  ctaBtn: {
    flexDirection: 'row',
    backgroundColor: colors.primaryDark, // Matching the dark blue CTA
    paddingVertical: 18,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ctaIcon: {
    color: colors.white,
    fontSize: 22,
    marginLeft: 10,
    lineHeight: 24,
  },
  restoreBtn: {
    alignItems: 'center',
    marginBottom: 15,
  },
  restoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  disclaimerText: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 16,
  },
});

export default PaywallScreen;
