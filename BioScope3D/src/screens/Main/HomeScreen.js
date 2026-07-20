import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { colors } from '../../theme/colors';
import BodySystemCard from '../../components/BodySystemCard';
import contentService from '../../api/contentService';
import userService from '../../api/userService';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { Search, Box, FileQuestion, Bookmark, TrendingUp, Heart, Brain, Wind, Apple, Bone, Dumbbell, Droplet, Activity, Flame } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [bodySystems, setBodySystems] = React.useState([]);
  const [profile, setProfile] = React.useState(null);
  const [lastActivity, setLastActivity] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [systems, userProfile, activity] = await Promise.all([
          contentService.getSystems(),
          userService.getProfile(),
          userService.getLastActivity().catch(() => null)
        ]);
        setBodySystems(systems);
        setProfile(userProfile);
        setLastActivity(activity);
      } catch (error) {
        console.error('Error fetching home screen data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getFirstName = (fullName) => {
    if (!fullName) return 'Student';
    return fullName.split(' ')[0];
  };

  const formatStudyTime = (minutes) => {
    if (!minutes || minutes === 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = (minutes / 60).toFixed(1);
    return `${hours}h`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning,';
    if (hour < 18) return 'Good afternoon,';
    return 'Good evening,';
  };

  return (
    <LinearGradient colors={['#F4F7FF', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileRow}>
          <View>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
            <Text style={styles.userName}>{getFirstName(profile?.full_name)}</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={moderateScale(16)} color={colors.textLight} style={{ marginRight: scale(10) }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search organs, systems, or topics..."
            placeholderTextColor={colors.textLight}
          />
        </View>

        {/* Hero Card */}
        {lastActivity ? (
          <LinearGradient 
            colors={[colors.primary, colors.primaryDark]} 
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.heroCard}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>LAST VIEWED MODULE</Text>
            </View>
            <Text style={styles.heroTitle}>{lastActivity.system_name}</Text>
            <Text style={styles.heroSubtitle}>{lastActivity.organ_name}</Text>
            <TouchableOpacity style={styles.resumeBtn} onPress={() => {}}>
              <Text style={styles.resumeBtnText}>Resume Session</Text>
            </TouchableOpacity>
            
            <View style={styles.progressBox}>
              <View style={styles.circularProgress}>
                <Text style={styles.progressPercent}>{lastActivity.progress || 0}%</Text>
              </View>
              <View style={styles.progressBoxText}>
                <Text style={styles.progressLabel}>Progress</Text>
                <Text style={styles.progressDetails}>Keep it up!</Text>
              </View>
            </View>
          </LinearGradient>
        ) : (
          <LinearGradient 
            colors={[colors.primary, colors.secondary]} 
            start={{x: 0, y: 0}} end={{x: 1, y: 1}}
            style={styles.heroCard}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>WELCOME</Text>
            </View>
            <Text style={styles.heroTitle}>Start Exploring</Text>
            <Text style={styles.heroSubtitle}>Choose a body system below to begin.</Text>
            <TouchableOpacity style={styles.resumeBtn} onPress={() => navigation.navigate('Atlas')}>
              <Text style={styles.resumeBtnText}>Go to Atlas</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>LEVEL</Text>
            <Text style={[styles.statValue, { color: colors.primaryDark }]}>{profile?.level || 1}</Text>
            <View style={styles.statLine} />
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>STREAK</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Flame size={moderateScale(16)} color="#FF6D00" />
              <Text style={[styles.statValue, { marginLeft: scale(4) }]}>{profile?.streak || 0}</Text>
            </View>
            <Text style={styles.statSub}>Days</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={styles.statLabel}>STUDY TIME</Text>
            <Text style={[styles.statValue, { color: '#00897B' }]}>{formatStudyTime(profile?.study_time_minutes)}</Text>
            <Text style={styles.statSub}>Total</Text>
          </View>
        </View>

        {/* Quick Actions Row */}
        <View style={styles.quickActionsRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Atlas')}>
            <View style={styles.actionIconBox}><Box size={moderateScale(20)} color="#1E293B" /></View>
            <Text style={styles.actionLabel}>3D Anatomy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Quiz')}>
            <View style={styles.actionIconBox}><FileQuestion size={moderateScale(20)} color="#1E293B" /></View>
            <Text style={styles.actionLabel}>Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Bookmarks')}>
            <View style={styles.actionIconBox}><Bookmark size={moderateScale(20)} color="#1E293B" /></View>
            <Text style={styles.actionLabel}>Bookmarks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Progress')}>
            <View style={styles.actionIconBox}><TrendingUp size={moderateScale(20)} color="#1E293B" /></View>
            <Text style={styles.actionLabel}>Progress</Text>
          </TouchableOpacity>
        </View>

        {/* Body Systems Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Body Systems</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>View All</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.bodySystemsContainer}>
          {bodySystems.map((sys) => {
            let subtitle = "Explore System";
            let customIcon = sys.icon;
            let iconBg = '#F8FAFC';

            if (sys.name.includes("Cardiovascular") || sys.name.includes("Circulatory")) {
              subtitle = "Heart & Vessels"; customIcon = <Heart size={moderateScale(24)} color={colors.secondary} />; iconBg = colors.pastelRed;
            } else if (sys.name.includes("Nervous")) {
              subtitle = "Brain & Spines"; customIcon = <Brain size={moderateScale(24)} color={colors.primary} />; iconBg = colors.pastelPurple;
            } else if (sys.name.includes("Respiratory")) {
              subtitle = "Lungs & Airways"; customIcon = <Wind size={moderateScale(24)} color={colors.info} />; iconBg = colors.pastelBlue;
            } else if (sys.name.includes("Digestive")) {
              subtitle = "Stomach & Gut"; customIcon = <Apple size={moderateScale(24)} color={colors.warning} />; iconBg = colors.pastelOrange;
            } else if (sys.name.includes("Skeletal")) {
              subtitle = "Bones & Joints"; customIcon = <Bone size={moderateScale(24)} color="#64748B" />; iconBg = '#F1F5F9';
            } else if (sys.name.includes("Muscular")) {
              subtitle = "Tissue & Flexion"; customIcon = <Dumbbell size={moderateScale(24)} color={colors.success} />; iconBg = colors.pastelGreen;
            } else if (sys.name.includes("Urinary")) {
              subtitle = "Kidneys & Bladder"; customIcon = <Droplet size={moderateScale(24)} color={colors.info} />; iconBg = colors.pastelBlue;
            } else {
              customIcon = <Activity size={moderateScale(24)} color="#64748B" />;
            }

            return (
              <BodySystemCard 
                key={sys.id}
                title={sys.name.replace(' System', '')}
                subtitle={subtitle}
                icon={customIcon}
                iconBg={iconBg}
                thumbnailUrl={sys.thumbnail_url}
                onPress={async () => {
                  try {
                    const organs = await contentService.getSystemOrgans(sys.id);
                    const firstOrgan = organs && organs.length > 0 ? organs[0] : null;
                    if (firstOrgan) {
                      navigation.navigate('Learn', { organ: firstOrgan, systemName: sys.name });
                    } else {
                      navigation.navigate('Viewer3D', { 
                        systemId: sys.id, systemName: sys.name, sketchfabId: sys.sketchfabId,
                        cameraEye: sys.cameraEye, cameraTarget: sys.cameraTarget
                      });
                    }
                  } catch (error) {
                    console.error('Error fetching organs for navigation:', error);
                  }
                }}
              />
            );
          })}
        </View>

        {/* Microscopic View */}
        <View style={styles.microCard}>
          <Text style={styles.microTitle}>Microscopic View</Text>
          <Text style={styles.microDesc}>Explore cellular structures in 3D with our new high-fidelity models.</Text>
          <TouchableOpacity>
            <Text style={styles.microLink}>Try it now →</Text>
          </TouchableOpacity>
        </View>

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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(10),
    backgroundColor: 'transparent',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: moderateScale(40), height: moderateScale(40), borderRadius: moderateScale(20),
    backgroundColor: '#CBD5E1', marginRight: scale(12),
  },
  greetingText: {
    fontSize: moderateScale(12), color: '#64748B', fontWeight: '500',
  },
  userName: {
    fontSize: moderateScale(16), fontWeight: 'bold', color: colors.primaryDark,
  },
  notificationBtn: { padding: moderateScale(8) },
  bellIcon: { fontSize: moderateScale(20), color: colors.primaryDark },
  
  scrollContent: { paddingBottom: verticalScale(110) },
  
  searchContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    marginHorizontal: scale(20), marginTop: verticalScale(10), paddingHorizontal: scale(15),
    borderRadius: moderateScale(12), height: verticalScale(45),
    shadowColor: '#000', shadowOffset: { width: 0, height: verticalScale(2) }, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2,
  },
  searchIcon: { fontSize: moderateScale(16), marginRight: scale(10), color: colors.textLight },
  searchInput: { flex: 1, fontSize: moderateScale(13), color: colors.textDark },
  
  heroCard: {
    marginHorizontal: scale(20), marginTop: verticalScale(25), padding: moderateScale(25), borderRadius: moderateScale(24),
    shadowColor: colors.primaryDark, shadowOffset: { width: 0, height: verticalScale(10) }, shadowOpacity: 0.4, shadowRadius: 20, elevation: 10,
  },
  heroBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', alignSelf: 'flex-start',
    paddingHorizontal: scale(10), paddingVertical: verticalScale(4), borderRadius: moderateScale(8), marginBottom: verticalScale(15),
  },
  heroBadgeText: { color: colors.white, fontSize: moderateScale(10), fontWeight: 'bold', letterSpacing: 0.5 },
  heroTitle: { color: colors.white, fontSize: moderateScale(24), fontWeight: 'bold', marginBottom: verticalScale(8), lineHeight: moderateScale(30) },
  heroSubtitle: { color: 'rgba(255, 255, 255, 0.8)', fontSize: moderateScale(12), marginBottom: verticalScale(20) },
  resumeBtn: {
    backgroundColor: colors.white, alignSelf: 'flex-start',
    paddingHorizontal: scale(20), paddingVertical: verticalScale(10), borderRadius: moderateScale(20), marginBottom: verticalScale(25),
  },
  resumeBtnText: { color: '#00509E', fontWeight: 'bold', fontSize: moderateScale(12) },
  progressBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)',
    padding: moderateScale(15), borderRadius: moderateScale(16),
  },
  circularProgress: {
    width: moderateScale(46), height: moderateScale(46), borderRadius: moderateScale(23), borderWidth: moderateScale(4), borderColor: colors.success,
    justifyContent: 'center', alignItems: 'center', marginRight: scale(15),
  },
  progressPercent: { color: colors.white, fontSize: moderateScale(12), fontWeight: 'bold' },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: moderateScale(11), marginBottom: verticalScale(2) },
  progressDetails: { color: colors.white, fontSize: moderateScale(13), fontWeight: 'bold' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: scale(20), marginTop: verticalScale(25),
  },
  statPill: {
    flex: 1, backgroundColor: colors.white, borderRadius: moderateScale(16), paddingVertical: verticalScale(15), paddingHorizontal: scale(10),
    alignItems: 'center', marginHorizontal: scale(4),
    shadowColor: '#000', shadowOffset: { width: 0, height: verticalScale(2) }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  statLabel: { fontSize: moderateScale(10), color: '#94A3B8', fontWeight: 'bold', marginBottom: verticalScale(8), letterSpacing: 0.5 },
  statValue: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#1E293B', marginBottom: verticalScale(4) },
  statLine: { width: scale(30), height: verticalScale(3), backgroundColor: colors.primaryDark, borderRadius: moderateScale(2), marginTop: verticalScale(4) },
  statSub: { fontSize: moderateScale(10), color: '#94A3B8' },

  quickActionsRow: {
    flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: scale(20), marginTop: verticalScale(25),
  },
  actionBtn: { alignItems: 'center', flex: 1 },
  actionIconBox: {
    width: moderateScale(50), height: moderateScale(50), backgroundColor: colors.white, borderRadius: moderateScale(16),
    justifyContent: 'center', alignItems: 'center', marginBottom: verticalScale(8),
    shadowColor: '#000', shadowOffset: { width: 0, height: verticalScale(2) }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  actionIcon: { fontSize: moderateScale(20) },
  actionLabel: { fontSize: moderateScale(11), color: '#475569', fontWeight: '500' },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: scale(20), marginTop: verticalScale(35), marginBottom: verticalScale(15),
  },
  sectionTitle: { fontSize: moderateScale(18), fontWeight: 'bold', color: '#1E293B' },
  seeAllText: { fontSize: moderateScale(13), color: colors.primary, fontWeight: 'bold' },
  
  bodySystemsContainer: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: scale(20),
  },

  microCard: {
    backgroundColor: '#EAEFFF', marginHorizontal: scale(20), marginTop: verticalScale(15), padding: moderateScale(25), borderRadius: moderateScale(20),
  },
  microTitle: { fontSize: moderateScale(16), fontWeight: 'bold', color: colors.primaryDark, marginBottom: verticalScale(8) },
  microDesc: { fontSize: moderateScale(13), color: '#475569', lineHeight: moderateScale(20), marginBottom: verticalScale(15) },
  microLink: { fontSize: moderateScale(13), fontWeight: 'bold', color: colors.primaryDark },
});

export default HomeScreen;
