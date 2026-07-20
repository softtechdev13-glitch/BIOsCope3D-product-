import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { colors } from '../../theme/colors';

const SettingsScreen = ({ navigation }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [quizResults, setQuizResults] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack()}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Dr. Julian Vance</Text>
            <Text style={styles.profileDesc}>Medical Resident • Level 12</Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </View>

        {/* Appearance Section */}
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.settingRow, styles.borderBottom]}>
            <View style={styles.settingIconContainer}>
              <Text style={styles.settingIcon}>🌙</Text>
            </View>
            <Text style={styles.settingText}>Dark Mode</Text>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode}
              trackColor={{ false: '#EAEFFF', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#E8F8F2' }]}>
              <Text style={[styles.settingIcon, { color: '#00C48C' }]}>TT</Text>
            </View>
            <Text style={styles.settingText}>Text Size</Text>
            <View style={styles.settingRight}>
              <Text style={styles.settingValueText}>Default</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>NOTIFICATIONS</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.settingRow, styles.borderBottom]}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#E0F7FA' }]}>
              <Text style={[styles.settingIcon, { color: '#00BCD4' }]}>🔔</Text>
            </View>
            <Text style={styles.settingText}>Daily Reminders</Text>
            <Switch 
              value={dailyReminders} 
              onValueChange={setDailyReminders}
              trackColor={{ false: '#EAEFFF', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={[styles.settingRow, styles.borderBottom]}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#FFF0F2' }]}>
              <Text style={[styles.settingIcon, { color: '#F44336' }]}>🏆</Text>
            </View>
            <Text style={styles.settingText}>Quiz Results</Text>
            <Switch 
              value={quizResults} 
              onValueChange={setQuizResults}
              trackColor={{ false: '#EAEFFF', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#F0F4F8' }]}>
              <Text style={[styles.settingIcon, { color: '#607D8B' }]}>🎉</Text>
            </View>
            <Text style={styles.settingText}>Achievement Alerts</Text>
            <Switch 
              value={achievementAlerts} 
              onValueChange={setAchievementAlerts}
              trackColor={{ false: '#EAEFFF', true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* General Section */}
        <Text style={styles.sectionTitle}>GENERAL</Text>
        <View style={styles.sectionCard}>
          <View style={[styles.settingRow, styles.borderBottom]}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#EAEFFF' }]}>
              <Text style={[styles.settingIcon, { color: colors.primary }]}>🌐</Text>
            </View>
            <Text style={styles.settingText}>Language</Text>
            <View style={styles.settingRight}>
              <Text style={styles.settingValueText}>English (US)</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
          <View style={[styles.settingRow, styles.borderBottom]}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#EAEFFF' }]}>
              <Text style={[styles.settingIcon, { color: colors.primary }]}>🛡️</Text>
            </View>
            <Text style={styles.settingText}>Privacy Policy</Text>
            <Text style={styles.chevron}>›</Text>
          </View>
          <View style={styles.settingRow}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#EAEFFF' }]}>
              <Text style={[styles.settingIcon, { color: colors.primary }]}>ℹ️</Text>
            </View>
            <Text style={styles.settingText}>About BioScope 3D</Text>
            <View style={styles.settingRight}>
              <Text style={styles.settingValueText}>v2.4.1</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </View>
        </View>

        {/* Data Sync Status */}
        <View style={styles.syncCard}>
          <Text style={styles.syncLabel}>DATA SYNC STATUS</Text>
          <Text style={styles.syncStatus}>Anatomy Cloud Connected</Text>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>Logged in as julian.vance@medical.edu</Text>

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
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: {
    width: 60,
  },
  backText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EAEFFF',
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 4,
  },
  profileDesc: {
    fontSize: 12,
    color: colors.textLight,
  },
  chevron: {
    fontSize: 20,
    color: colors.textLight,
    paddingLeft: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 10,
  },
  sectionCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingIcon: {
    fontSize: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValueText: {
    fontSize: 12,
    color: colors.textLight,
  },
  syncCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  syncLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 5,
  },
  syncStatus: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FFD1D9', // Light red border
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F', // Red text
  },
  footerText: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
  },
});

export default SettingsScreen;
