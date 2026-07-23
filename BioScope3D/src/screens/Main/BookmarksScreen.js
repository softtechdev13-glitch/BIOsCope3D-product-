import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { colors } from '../../theme/colors';
import bookmarkService from '../../api/bookmarkService';
import contentService from '../../api/contentService';
import { Bookmark, ChevronRight } from 'lucide-react-native';
import { scale, verticalScale, moderateScale } from '../../utils/responsive';

const BookmarksScreen = ({ navigation }) => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    try {
      setLoading(true);
      const data = await bookmarkService.getUserBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchBookmarks();
    });
    return unsubscribe;
  }, [navigation]);

  const handleBookmarkPress = async (item) => {
    try {
      setLoading(true);
      if (item.item_type === 'System') {
        const organs = await contentService.getSystemOrgans(item.item_id);
        const firstOrgan = organs && organs.length > 0 ? organs[0] : null;
        if (firstOrgan) {
          navigation.navigate('Learn', { organ: firstOrgan, systemName: item.title });
        } else {
          navigation.navigate('Viewer3D', { systemId: item.item_id, systemName: item.title });
        }
      } else if (item.item_type === 'Organ') {
        try {
          const organ = await contentService.getOrganById(item.item_id);
          if (organ) {
            const systemName = organ.BodySystem?.name || 'Anatomy';
            navigation.navigate('Learn', { organ, systemName });
          } else {
            navigation.navigate('Learn', {
              organ: { id: item.item_id, name: item.title, key_facts: `Details for ${item.title}` },
              systemName: 'Anatomy'
            });
          }
        } catch (err) {
          navigation.navigate('Learn', {
            organ: { id: item.item_id, name: item.title, key_facts: `Details for ${item.title}` },
            systemName: 'Anatomy'
          });
        }
      }
    } catch (error) {
      console.error('Error navigating to bookmark:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.bookmarkCard} onPress={() => handleBookmarkPress(item)}>
      <View style={styles.iconContainer}>
        <Bookmark size={moderateScale(20)} color={colors.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.item_type}</Text>
      </View>
      <ChevronRight size={moderateScale(20)} color={colors.textLight} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bookmarks</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : bookmarks.length === 0 ? (
        <View style={styles.centerContainer}>
          <Bookmark size={moderateScale(48)} color={colors.border} />
          <Text style={styles.emptyTitle}>No Bookmarks Yet</Text>
          <Text style={styles.emptyDesc}>Save lessons and anatomy modules to access them quickly later.</Text>
        </View>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
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
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(50),
    paddingBottom: verticalScale(15),
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backBtn: { width: 60 },
  backText: { fontSize: 16, color: colors.primary, fontWeight: 'bold' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: colors.textDark },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: moderateScale(18),
    fontWeight: 'bold',
    color: colors.textDark,
    marginTop: verticalScale(15),
    marginBottom: verticalScale(8),
  },
  emptyDesc: {
    fontSize: moderateScale(14),
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: moderateScale(20),
  },
  listContent: {
    padding: scale(20),
  },
  bookmarkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: moderateScale(16),
    padding: moderateScale(15),
    marginBottom: verticalScale(15),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: verticalScale(2) },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconContainer: {
    width: moderateScale(40),
    height: moderateScale(40),
    borderRadius: moderateScale(20),
    backgroundColor: '#EAEFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(15),
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: moderateScale(16),
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: verticalScale(2),
  },
  cardSubtitle: {
    fontSize: moderateScale(12),
    color: colors.textLight,
  },
});

export default BookmarksScreen;
