import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import { colors } from '../../theme/colors';
import AchievementBadge from '../../components/AchievementBadge';
import CertificateCard from '../../components/CertificateCard';
import userService from '../../api/userService';
import quizService from '../../api/quizService';
import { AuthContext } from '../../context/AuthContext';
import { API_CONFIG } from '../../config/apiConfig';
import * as ImagePicker from 'react-native-image-picker';
import { Pencil, Shield, Lightbulb, Flame, Star, Heart, Bone, Settings, ChevronRight, LogOut, Trophy, Brain, Medal } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const ProfileScreen = ({ navigation }) => {
  // Authentication context
  const { logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleEditAvatar = () => {
    Alert.alert(
      'Upload Profile Picture',
      'Choose an option',
      [
        { text: 'Camera', onPress: () => launchImagePicker('camera') },
        { text: 'Gallery', onPress: () => launchImagePicker('gallery') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const launchImagePicker = (type) => {
    const options = { mediaType: 'photo', quality: 0.8 };
    const callback = async (response) => {
      if (response.didCancel || response.errorCode) return;
      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        try {
          setUploadingImage(true);
          const data = await userService.uploadProfileImage(asset.uri, asset.fileName, asset.type);
          setProfile({ ...profile, profile_image: data.profile_image });
          Alert.alert('Success', 'Profile image updated successfully!');
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to upload image.');
        } finally {
          setUploadingImage(false);
        }
      }
    };
    if (type === 'camera') {
      ImagePicker.launchCamera(options, callback);
    } else {
      ImagePicker.launchImageLibrary(options, callback);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileData, historyData] = await Promise.all([
          userService.getProfile(),
          quizService.getHistory()
        ]);
        setProfile(profileData);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching data in ProfileScreen:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <LinearGradient colors={['#F4F7FF', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>BioScope 3D</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* User Info */}
        <View style={styles.userInfoContainer}>
          <View style={styles.largeAvatarContainer}>
            {profile?.profile_image ? (
              <Image source={{ uri: `${API_CONFIG.BASE_URL.replace('/api', '')}${profile.profile_image}` }} style={styles.largeAvatar} />
            ) : (
              <View style={styles.largeAvatar} />
            )}
            <TouchableOpacity style={styles.editBtn} onPress={handleEditAvatar} disabled={uploadingImage}>
              {uploadingImage ? <ActivityIndicator size="small" color={colors.white} /> : <Pencil size={12} color={colors.white} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{profile?.full_name || 'Student'}</Text>
          <View style={styles.levelBadge}>
            <Shield size={12} color="#00838F" style={{marginRight: 5}} />
            <Text style={styles.levelText}>LEVEL {profile?.level || 1} STUDENT</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile?.xp || 0}</Text>
            <Text style={styles.statLabel}>TOTAL XP</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile?.streak || 0}</Text>
            <Text style={styles.statLabel}>STREAK</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{profile?.certificates || 0}</Text>
            <Text style={styles.statLabel}>CERTIFICATES</Text>
          </View>
        </View>

        {/* Recent Achievements */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.viewAllTextActive}>View Progress</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.achievementsGrid}>
          {profile?.streak >= 3 ? <AchievementBadge icon={<Flame size={24} color="#FF6D00" />} color="#FF6D00" /> : null}
          {profile?.level >= 2 ? <AchievementBadge icon={<Trophy size={24} color="#00C48C" />} color="#00C48C" /> : null}
          {profile?.level >= 5 ? <AchievementBadge icon={<Brain size={24} color={colors.primary} />} color={colors.primary} /> : null}
          {profile?.certificates >= 5 ? <AchievementBadge icon={<Medal size={24} color="#00897B" />} color="#00897B" /> : null}
          {!(profile?.streak >= 3 || profile?.level >= 2) && <AchievementBadge isLocked={true} />}
        </View>

        {/* Active Certificates (From Quiz History) */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Active Certificates</Text>
        </View>
        <View style={styles.certificatesList}>
          {history.length > 0 ? (
            history.slice(0, 3).map((item, index) => (
              <CertificateCard 
                key={item.id || index}
                icon={<Star size={24} color="#F59E0B" />}
                title={item.Quiz?.title || 'Unknown Quiz'}
                date={new Date(item.completed_at).toLocaleDateString()}
                level={item.Quiz?.difficulty || 'General'}
                onPress={() => {}}
              />
            ))
          ) : (
            <Text style={{ color: colors.textLight, textAlign: 'center', marginVertical: 10 }}>Complete quizzes to earn certificates.</Text>
          )}
        </View>

        {/* Settings Button */}
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <View style={styles.settingsIconContainer}>
            <Settings size={20} color={colors.textDark} />
          </View>
          <Text style={styles.settingsText}>Settings & Preferences</Text>
          <ChevronRight size={20} color={colors.textLight} />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <View style={[styles.settingsIconContainer, { backgroundColor: '#FFEBEB' }]}>
            <LogOut size={20} color="#D32F2F" />
          </View>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.memberSince}>
          Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'recently'}
        </Text>

      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'transparent',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholderSmall: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EAEFFF',
    marginRight: 10,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  notificationBtn: {
    padding: 8,
  },
  bellIcon: {
    fontSize: 18,
    color: colors.primaryDark,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 110,
  },
  userInfoContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 10,
  },
  largeAvatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: colors.primary,
    backgroundColor: '#EAEFFF',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
  editIcon: {
    fontSize: 12,
    color: colors.white,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA', // Light cyan
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelIcon: {
    fontSize: 12,
    marginRight: 5,
  },
  levelText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#00838F',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statBox: {
    flex: 0.31,
    backgroundColor: colors.white,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: colors.textLight,
    letterSpacing: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  viewAllTextActive: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: 'bold',
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  certificatesList: {
    marginBottom: 20,
  },
  settingsBtn: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  settingsIcon: {
    fontSize: 20,
  },
  settingsText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
  },
  chevron: {
    fontSize: 20,
    color: colors.textLight,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FFEBEB',
  },
  logoutText: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  memberSince: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
    textAlign: 'center',
  },
});

export default ProfileScreen;
