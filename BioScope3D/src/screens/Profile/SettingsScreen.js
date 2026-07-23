import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Modal, Image, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import userService from '../../api/userService';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/apiConfig';
import { moderateScale, scale, verticalScale } from '../../utils/responsive';

const SettingsScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [dailyReminders, setDailyReminders] = useState(true);
  const [quizResults, setQuizResults] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile in SettingsScreen:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

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
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation?.goBack()}>
          {loading ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 15 }} />
          ) : profile?.profile_image ? (
            <Image 
              source={{ uri: `${API_CONFIG.BASE_URL.replace('/api', '')}${profile.profile_image}` }} 
              style={styles.avatarImage} 
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{profile?.full_name || 'Medical Student'}</Text>
            <Text style={styles.profileDesc}>
              {profile?.email || 'User'} • Level {profile?.level || 1}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

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
          <TouchableOpacity style={styles.settingRow} onPress={() => setAboutModalVisible(true)}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#EAEFFF' }]}>
              <Text style={[styles.settingIcon, { color: colors.primary }]}>ℹ️</Text>
            </View>
            <Text style={styles.settingText}>About BioScope 3D</Text>
            <View style={styles.settingRight}>
              <Text style={styles.settingValueText}>v2.4.1</Text>
              <Text style={styles.chevron}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Data Sync Status */}
        <View style={styles.syncCard}>
          <Text style={styles.syncLabel}>DATA SYNC STATUS</Text>
          <Text style={styles.syncStatus}>Anatomy Cloud Connected</Text>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Logged in as {profile?.email || 'medical student'}
        </Text>

      </ScrollView>

      {/* About BioScope 3D Popup Modal */}
      <Modal
        visible={aboutModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setAboutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.appIconBadge}>
                <Text style={{ fontSize: 24 }}>🧬</Text>
              </View>
              <Text style={styles.modalTitle}>BioScope 3D</Text>
              <Text style={styles.versionBadge}>Version 2.4.1</Text>
            </View>

            <ScrollView style={{ maxHeight: 300 }} showsVerticalScrollIndicator={false}>
              <Text style={styles.aboutSectionHeading}>ABOUT THE APP</Text>
              <Text style={styles.aboutDescription}>
                BioScope 3D is a state-of-the-art interactive 3D human anatomy visualization and learning platform built for medical students, healthcare practitioners, and biology enthusiasts.
              </Text>

              <Text style={styles.aboutSectionHeading}>KEY FEATURES</Text>
              <View style={styles.featureRow}>
                <Text style={styles.featureBullet}>🦴</Text>
                <Text style={styles.featureDetail}>Interactive 3D System & Organ Atlas</Text>
              </View>
              <View style={styles.featureRow}>
                <Text style={styles.featureBullet}>👩‍🏫</Text>
                <Text style={styles.featureDetail}>AI Anatomy Tutor with Clinical Insights</Text>
              </View>
              <View style={styles.featureRow}>
                <Text style={styles.featureBullet}>🏆</Text>
                <Text style={styles.featureDetail}>Adaptive Quizzes, XP Levels & Certificates</Text>
              </View>
              <View style={styles.featureRow}>
                <Text style={styles.featureBullet}>🔖</Text>
                <Text style={styles.featureDetail}>Custom Bookmarks & Recent Progress Sync</Text>
              </View>

              <Text style={styles.aboutSectionHeading}>SYSTEM INFO</Text>
              <Text style={styles.infoText}>Backend Engine: Express & PostgreSQL Cloud</Text>
              <Text style={styles.infoText}>3D Engine: Sketchfab WebGL Renderer</Text>
              <Text style={styles.copyrightText}>© 2026 BioScope 3D Inc. All rights reserved.</Text>
            </ScrollView>

            <TouchableOpacity 
              style={styles.closeModalBtn} 
              onPress={() => setAboutModalVisible(false)}
            >
              <Text style={styles.closeModalBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarInitial: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
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
    borderColor: '#FFD1D9',
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  footerText: {
    fontSize: 10,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  appIconBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EAEFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  versionBadge: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  aboutSectionHeading: {
    fontSize: 11,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 6,
  },
  aboutDescription: {
    fontSize: 13,
    color: colors.textDark,
    lineHeight: 20,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  featureBullet: {
    fontSize: 14,
    marginRight: 8,
  },
  featureDetail: {
    fontSize: 13,
    color: colors.textDark,
  },
  infoText: {
    fontSize: 12,
    color: colors.textLight,
    marginBottom: 2,
  },
  copyrightText: {
    fontSize: 11,
    color: colors.textLight,
    marginTop: 10,
    fontStyle: 'italic',
  },
  closeModalBtn: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 15,
  },
  closeModalBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;
