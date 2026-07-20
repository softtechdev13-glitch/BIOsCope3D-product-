import React, { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AppState, View } from 'react-native';
import { LayoutGrid, Layers, Sparkles, Gamepad2, User } from 'lucide-react-native';
import { colors } from '../theme/colors';
import userService from '../api/userService';

import AtlasScreen from '../screens/Main/AtlasScreen';
import HomeScreen from '../screens/Main/HomeScreen';
import AiTutorScreen from '../screens/Tutor/AiTutorScreen';
import QuizHomeScreen from '../screens/Quiz/QuizHomeScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const appState = useRef(AppState.currentState);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // App came to foreground
        startTime.current = Date.now();
      } else if (
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // App went to background
        const endTime = Date.now();
        const elapsedMs = endTime - startTime.current;
        const elapsedMinutes = Math.floor(elapsedMs / 60000);

        if (elapsedMinutes >= 1) {
          try {
            await userService.updateStudyTime(elapsedMinutes);
          } catch (error) {
            console.log('Failed to sync study time', error);
          }
        }
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 65,
          borderRadius: 35,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: colors.primaryDark,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.2,
          shadowRadius: 20,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarIcon: ({ focused, color, size }) => {
          let IconComponent;
          switch (route.name) {
            case 'Home': IconComponent = LayoutGrid; break;
            case 'Atlas': IconComponent = Layers; break;
            case 'Tutor': IconComponent = Sparkles; break;
            case 'Quiz': IconComponent = Gamepad2; break;
            case 'Profile': IconComponent = User; break;
            default: IconComponent = LayoutGrid;
          }

          return (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: focused ? '#F0F4FF' : 'transparent',
              padding: 12,
              borderRadius: 20,
            }}>
              <IconComponent size={24} color={focused ? colors.primary : colors.textLight} />
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Atlas" component={AtlasScreen} />
      <Tab.Screen name="Tutor" component={AiTutorScreen} />
      <Tab.Screen name="Quiz" component={QuizHomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
