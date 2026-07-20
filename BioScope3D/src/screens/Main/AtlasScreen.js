import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Image } from 'react-native';
import { colors } from '../../theme/colors';
import contentService from '../../api/contentService';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';
import { Menu, Search, Play } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

const AtlasScreen = ({ navigation }) => {
  const [systems, setSystems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystems = async () => {
      try {
        const data = await contentService.getSystems();
        setSystems(data);
      } catch (error) {
        console.error('Error fetching systems in Atlas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSystems();
  }, []);

  return (
    <LinearGradient colors={['#F4F7FF', '#FFFFFF']} style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>BioScope 3D</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Search size={moderateScale(16)} color={colors.textLight} style={{ marginRight: scale(10) }} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search systems, organs, or bones..."
            placeholderTextColor={colors.textLight}
          />
        </View>

        {/* Daily Insight Banner */}
        {systems.length > 0 && (
          <View style={styles.insightBanner}>
            <View style={styles.insightBadge}>
              <Text style={styles.insightBadgeText}>Featured Module</Text>
            </View>
            <Text style={styles.insightTitle}>{systems[0]?.name}</Text>
            <Text style={styles.insightSubtitle}>Interactive 3D structural breakdown</Text>
            <TouchableOpacity 
              style={styles.view3DBtn}
              onPress={() => navigation.navigate('Viewer3D', { 
                systemId: systems[0]?.id, 
                systemName: systems[0]?.name,
                sketchfabId: systems[0]?.sketchfabId,
                cameraEye: systems[0]?.cameraEye,
                cameraTarget: systems[0]?.cameraTarget
              })}
            >
              <Text style={styles.view3DText}>View 3D</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Body Systems Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Body Systems</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gridContainer}>
          {systems.map((sys) => (
            <TouchableOpacity 
              key={sys.id} 
              style={styles.systemCard}
              onPress={() => navigation.navigate('Viewer3D', { 
                systemId: sys.id, 
                systemName: sys.name,
                sketchfabId: sys.sketchfabId,
                cameraEye: sys.cameraEye,
                cameraTarget: sys.cameraTarget
              })}
            >
              <View style={styles.cardImagePlaceholder}>
                <Image 
                  source={{ uri: sys.thumbnail_url }} 
                  style={{ width: '100%', height: '100%', borderRadius: moderateScale(12) }} 
                  resizeMode="cover" 
                />
              </View>
              <Text style={styles.cardTitle}>{sys.name}</Text>
              <Text style={styles.cardSubtitle}>{sys.elementCount} elements</Text>
            </TouchableOpacity>
          ))}
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(15),
    backgroundColor: 'transparent',
  },
  menuBtn: {
    padding: moderateScale(5),
  },
  menuIcon: {
    fontSize: moderateScale(24),
    color: colors.primaryDark,
  },
  logoText: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.primaryDark,
  },
  avatarPlaceholderSmall: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: '#EAEFFF',
  },
  scrollContent: {
    padding: scale(20),
    paddingBottom: verticalScale(110),
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(12),
    paddingHorizontal: scale(15),
    height: verticalScale(45),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchIcon: {
    fontSize: moderateScale(16),
    marginRight: scale(10),
    color: colors.textLight,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14),
    color: colors.textDark,
  },
  insightBanner: {
    backgroundColor: '#7A91FF', 
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
    marginBottom: verticalScale(25),
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  insightBadge: {
    backgroundColor: colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: moderateScale(12),
    marginBottom: verticalScale(10),
  },
  insightBadgeText: {
    color: colors.white,
    fontSize: moderateScale(10),
    fontWeight: 'bold',
  },
  insightTitle: {
    color: colors.white,
    fontSize: moderateScale(22),
    fontWeight: 'bold',
    marginBottom: verticalScale(5),
  },
  insightSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: moderateScale(12),
    marginBottom: verticalScale(15),
  },
  view3DBtn: {
    backgroundColor: colors.white,
    alignSelf: 'flex-end',
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(8),
    borderRadius: moderateScale(20),
  },
  view3DText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: moderateScale(12),
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: verticalScale(15),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
  },
  seeAllText: {
    fontSize: moderateScale(12),
    color: colors.primary,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: verticalScale(20),
  },
  systemCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImagePlaceholder: {
    width: '100%',
    height: verticalScale(100),
    borderRadius: moderateScale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  cardTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: verticalScale(4),
  },
  cardSubtitle: {
    fontSize: moderateScale(10),
    color: colors.textLight,
  },
  pathologyCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    alignItems: 'center',
    marginBottom: verticalScale(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  radialContainer: {
    marginRight: scale(15),
  },
  radialCircle: {
    width: moderateScale(50),
    height: moderateScale(50),
    borderRadius: moderateScale(25),
    borderWidth: moderateScale(4),
    borderColor: '#00C48C',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopColor: '#00C48C',
    borderRightColor: '#00C48C',
    borderBottomColor: '#E8F8F2',
    borderLeftColor: '#00C48C',
    transform: [{ rotate: '45deg' }],
  },
  scoreText: {
    fontSize: moderateScale(12),
    fontWeight: 'bold',
    color: '#00897B',
    transform: [{ rotate: '-45deg' }],
  },
  pathologyContent: {
    flex: 1,
  },
  pathologyTitle: {
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: verticalScale(4),
  },
  pathologySubtitle: {
    fontSize: moderateScale(11),
    color: colors.textLight,
  },
  playBtn: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: colors.white,
    fontSize: moderateScale(16),
    marginLeft: scale(4),
  },
});

export default AtlasScreen;
