import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { RotateCcw, Bookmark } from 'lucide-react-native';
import { colors } from '../../theme/colors';
import CustomButton from '../../components/CustomButton';
import contentService from '../../api/contentService';
import bookmarkService from '../../api/bookmarkService';

const { height, width } = Dimensions.get('window');

const Viewer3DScreen = ({ navigation, route }) => {
  const systemId = route?.params?.systemId || null;
  const systemName = route?.params?.systemName || 'Select a System from Atlas';
  const sketchfabId = route?.params?.sketchfabId || '2f888b3ad214430fb895604437090786'; // fallback to skeleton
  const cameraEye = route?.params?.cameraEye || [0, -2.8, 1];
  const cameraTarget = route?.params?.cameraTarget || [0, 8, 0];
  
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentOrganIndex, setCurrentOrganIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const webviewRef = useRef(null);

  useEffect(() => {
    if (systemId) {
      const fetchOrgans = async () => {
        setLoading(true);
        try {
          // If systemId is not a valid UUID (e.g. 1, 2, 3, 4), skip the API call to prevent 500 error
          if (String(systemId).includes('-')) {
            const data = await contentService.getSystemOrgans(systemId);
            if (data && data.length > 0) {
              setOrgans(data);
            } else {
              setOrgans([{ name: systemName, key_facts: 'General overview of the ' + systemName }]);
            }
          } else {
            // Mock data for hardcoded integer IDs
            setOrgans([{ name: systemName, key_facts: 'General overview of the ' + systemName }]);
          }
          setCurrentOrganIndex(0);
        } catch (error) {
          console.error('Error fetching organs:', error);
          // Fallback to mock data on error so the bottom sheet still works
          setOrgans([{ name: systemName, key_facts: 'General overview of the ' + systemName }]);
          setCurrentOrganIndex(0);
        } finally {
          setLoading(false);
        }
      };
      fetchOrgans();
    }
  }, [systemId, systemName]);

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        if (!systemId) return;
        const bookmarks = await bookmarkService.getUserBookmarks();
        const exists = bookmarks.find(b => b.item_type === 'System' && String(b.item_id) === String(systemId));
        setIsBookmarked(!!exists);
      } catch (error) {
        console.error('Error checking bookmark:', error);
      }
    };
    checkBookmark();
  }, [systemId]);

  const toggleBookmark = async () => {
    if (!systemId) return;
    try {
      if (isBookmarked) {
        await bookmarkService.removeBookmark('System', systemId);
        setIsBookmarked(false);
      } else {
        await bookmarkService.addBookmark('System', systemId, systemName);
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Error updating bookmark:', error);
      const msg = error.message || error.error || 'Server error';
      alert(`Error updating bookmark: ${msg}`);
    }
  };

  const currentOrgan = organs.length > 0 ? organs[currentOrganIndex] : null;

  const sketchfabHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif; }
          html, body { height: 100%; width: 100%; background-color: #0F172A; overflow: hidden; }
          iframe { border: none; width: 100%; height: 100%; }
        </style>
        <script src="https://static.sketchfab.com/api/sketchfab-viewer-1.12.1.js"></script>
      </head>
      <body>
        <iframe id="sketchfab-iframe" allow="autoplay; fullscreen; xr-spatial-tracking"></iframe>
        <script>
          const iframe = document.getElementById('sketchfab-iframe');
          const client = new Sketchfab('1.12.0', iframe);
          let api;
          let animations = [];
          let currentAnimIndex = 0;
          let isPlaying = true;

          client.init('${sketchfabId}', {
            success: (apiInstance) => {
              api = apiInstance;
              api.start(() => {
                api.getAnimations((err, anims) => {
                  if (!err && anims.length > 0) {
                    animations = anims;
                  }
                });
              });
            },
            error: () => console.error('Sketchfab Error'),
            autostart: 1,
            preload: 1,
            ui_controls: 0,
            ui_infos: 0
          });

          function toggleAnimation() {
            if (!api || animations.length === 0) return;
            const btn = document.getElementById('anim-btn');
            if (isPlaying) {
              api.pause();
              btn.innerText = 'Play';
              btn.classList.remove('active');
            } else {
              api.play();
              btn.innerText = 'Pause';
              btn.classList.add('active');
            }
            isPlaying = !isPlaying;
          }

          function nextAnimation() {
            if (!api || animations.length === 0) return;
            currentAnimIndex = (currentAnimIndex + 1) % animations.length;
            api.setCurrentAnimationByUID(animations[currentAnimIndex].uid);
            api.play();
            const btn = document.getElementById('anim-btn');
            btn.innerText = 'Pause';
            btn.classList.add('active');
            isPlaying = true;
          }

          function sendMessage(action) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ action }));
          }

          function moveCamera(view) {
            if (!api) return;
            const pos = { eye: [${cameraEye.join(',')}], target: [${cameraTarget.join(',')}] };
            api.setCameraLookAt(pos.eye, pos.target, 1.5);
          }
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      {/* 3D Area */}
      <View style={styles.mock3DArea}>
        <WebView
          ref={webviewRef}
          originWhitelist={["*"]}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mixedContentMode="always"
          source={{ html: sketchfabHTML }}
          style={styles.webview}
          onMessage={(event) => {
            const message = JSON.parse(event.nativeEvent.data);
            switch (message.action) {
              case "anatomy": navigation.navigate("Home"); break;
            }
          }}
        />

        {/* Back Button Overlay */}
        <View style={styles.headerOverlay}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
            <Text style={styles.icon}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Premium Reset Button */}
        <TouchableOpacity 
          style={styles.premiumResetBtn}
          onPress={() => webviewRef.current?.injectJavaScript("moveCamera('reset'); true;")}
        >
          <RotateCcw size={20} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Bottom Action Sheet */}
      <View style={styles.bottomSheet}>
        {currentOrgan ? (
          <>
            <View style={styles.sheetHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.organTitle}>{currentOrgan.name}</Text>
                <Text style={styles.organSubtitle} numberOfLines={2}>
                  {currentOrgan.key_facts ? currentOrgan.key_facts.substring(0, 80) + '...' : 'Explore anatomy in 3D.'}
                </Text>
              </View>
              <View style={styles.actionButtons}>
                {organs.length > 1 && (
                  <TouchableOpacity 
                    style={styles.actionBtn}
                    onPress={() => setCurrentOrganIndex((prev) => (prev + 1) % organs.length)}
                  >
                    <Text style={styles.actionIcon}>⏭️</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.actionBtn} onPress={toggleBookmark}>
                  <Bookmark size={16} color={isBookmarked ? colors.primary : colors.textLight} fill={isBookmarked ? colors.primary : 'transparent'} />
                </TouchableOpacity>
              </View>
            </View>
            <CustomButton 
              title="Start Lesson 📖" 
              onPress={() => navigation.navigate('Learn', { organ: currentOrgan, systemName })} 
              style={styles.lessonBtn}
            />
          </>
        ) : (
           !loading && <Text style={{ color: colors.textLight, textAlign: 'center', marginTop: 20 }}>Please select a Body System from the Atlas tab to view details.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
  },
  mock3DArea: {
    flex: 1,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  headerOverlay: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 10,
  },
  iconBtn: { padding: 5 },
  icon: { fontSize: 18, color: colors.textDark },
  logoText: { fontSize: 16, fontWeight: 'bold', color: colors.primaryDark },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  avatarPlaceholderSmall: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#EAEFFF', marginLeft: 10,
  },
  badgeOverlay: { 
    position: 'absolute',
    top: 120,
    left: 20,
    zIndex: 10,
  },
  liveBadge: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginBottom: 10,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#00C48C', marginRight: 6 },
  liveText: { color: colors.white, fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  categoryBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)', alignSelf: 'flex-start',
    paddingHorizontal: 15, paddingVertical: 8, borderRadius: 12,
  },
  categoryText: { color: colors.white, fontSize: 16, fontWeight: '600' },
  premiumResetBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheet: {
    backgroundColor: colors.background, borderTopLeftRadius: 30, borderTopRightRadius: 30,
    padding: 25, shadowColor: '#000', shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1, shadowRadius: 10, elevation: 10,
    height: 180, // Keep it fixed at bottom to leave space for WebView controls
  },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  organTitle: { fontSize: 24, fontWeight: 'bold', color: colors.textDark, marginBottom: 8 },
  organSubtitle: { fontSize: 12, color: colors.textLight, lineHeight: 18, maxWidth: '80%' },
  actionButtons: { flexDirection: 'row' },
  actionBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#EAEFFF',
    justifyContent: 'center', alignItems: 'center', marginLeft: 10,
  },
  actionIcon: { fontSize: 16, color: colors.primary },
  lessonBtn: { marginTop: 10 },
});

export default Viewer3DScreen;
