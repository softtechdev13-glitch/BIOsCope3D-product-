import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';
import { Bookmark } from 'lucide-react-native';
import bookmarkService from '../../api/bookmarkService';

const { height } = Dimensions.get('window');

const LearnScreen = ({ navigation, route }) => {
  const [activeTab, setActiveTab] = useState('Key Facts');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const tabs = ['Key Facts', 'Functions', 'Diseases'];
  
  const currentOrgan = route?.params?.organ;
  const systemName = route?.params?.systemName || 'System';

  React.useEffect(() => {
    const checkBookmark = async () => {
      try {
        if (!currentOrgan) return;
        const bookmarks = await bookmarkService.getUserBookmarks();
        const exists = bookmarks.find(b => b.item_type === 'Organ' && b.item_id === currentOrgan.id);
        setIsBookmarked(!!exists);
      } catch (error) {
        console.error('Error checking bookmark:', error);
      }
    };
    checkBookmark();
  }, [currentOrgan]);

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark('Organ', currentOrgan.id);
        setIsBookmarked(false);
      } else {
        await bookmarkService.addBookmark('Organ', currentOrgan.id, currentOrgan.name);
        setIsBookmarked(true);
      }
    } catch (error) {
      alert('Error updating bookmark');
    }
  };

  if (!currentOrgan) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.textDark }}>Organ data not found.</Text>
        <CustomButton title="Go Back" onPress={() => navigation.goBack()} style={{ marginTop: 20 }} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Text style={styles.icon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.logoText}>{currentOrgan.name} Lesson</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={toggleBookmark}>
          <Bookmark size={20} color={isBookmarked ? colors.primary : colors.textDark} fill={isBookmarked ? colors.primary : 'transparent'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Title Section */}
        <View style={styles.titleSection}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{systemName}</Text>
          </View>
          <Text style={styles.organTitle}>{currentOrgan.name}</Text>
          <Text style={styles.organSubtitle}>
            {currentOrgan.key_facts ? currentOrgan.key_facts.substring(0, 100) + '...' : 'Detailed anatomical lesson.'}
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity 
                key={tab} 
                style={[styles.tab, activeTab === tab && styles.activeTab]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        <View style={styles.tabContent}>
          {activeTab === 'Key Facts' && (
            <View>
              <Text style={styles.sectionTitle}>Key Anatomical Facts</Text>
              <Text style={styles.paragraph}>
                {currentOrgan.key_facts || 'No facts available.'}
              </Text>
            </View>
          )}

          {activeTab === 'Functions' && (
            <View>
              <Text style={styles.sectionTitle}>Biological Functions</Text>
              <Text style={styles.paragraph}>
                {currentOrgan.functions || 'No functions available.'}
              </Text>
            </View>
          )}

          {activeTab === 'Diseases' && (
            <View>
              <Text style={styles.sectionTitle}>Common Pathologies</Text>
              <View style={styles.alertBox}>
                <View style={styles.alertIconContainer}>
                  <Text style={styles.alertIcon}>⚠️</Text>
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>Clinical Notes</Text>
                  <Text style={styles.alertText}>{currentOrgan.clinical_diseases || 'No clinical data available.'}</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Start Quiz Button */}
        <View style={styles.actionContainer}>
          <CustomButton 
            title={`❓ Take Quiz`}
            onPress={() => navigation.navigate('QuizQuestion', { systemName })} 
            style={styles.quizBtn}
          />
        </View>

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
  iconBtn: { padding: 5 },
  icon: { fontSize: 18, color: colors.textDark },
  logoText: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark },
  scrollContent: { paddingBottom: 40 },
  titleSection: { padding: 20, backgroundColor: colors.white, marginBottom: 15 },
  categoryBadge: {
    backgroundColor: '#EAEFFF', alignSelf: 'flex-start',
    paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginBottom: 10,
  },
  categoryText: { color: colors.primary, fontSize: 10, fontWeight: 'bold' },
  organTitle: { fontSize: 28, fontWeight: 'bold', color: colors.textDark, marginBottom: 8 },
  organSubtitle: { fontSize: 14, color: colors.textLight, lineHeight: 20 },
  tabsContainer: { backgroundColor: colors.white, borderBottomWidth: 1, borderBottomColor: colors.border, paddingHorizontal: 20 },
  tab: { paddingVertical: 15, paddingHorizontal: 15, marginRight: 10 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText: { fontSize: 14, color: colors.textLight, fontWeight: '600' },
  activeTabText: { color: colors.primary },
  tabContent: { padding: 20, backgroundColor: colors.white, minHeight: height * 0.4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textDark, marginBottom: 15 },
  paragraph: { fontSize: 14, color: colors.textLight, lineHeight: 24, marginBottom: 25 },
  alertBox: { flexDirection: 'row', backgroundColor: '#FFF0F2', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#FFD1D9', marginBottom: 30 },
  alertIconContainer: { marginRight: 10 },
  alertIcon: { fontSize: 18 },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 14, fontWeight: 'bold', color: colors.textDark, marginBottom: 4 },
  alertText: { fontSize: 13, color: colors.textLight, lineHeight: 20 },
  actionContainer: { padding: 20 },
  quizBtn: { marginTop: 10 },
});

export default LearnScreen;
