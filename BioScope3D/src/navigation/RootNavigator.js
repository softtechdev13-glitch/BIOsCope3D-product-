import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';

import AuthStack from './AuthStack';
import MainTabNavigator from './MainTabNavigator';
import LearnScreen from '../screens/Main/LearnScreen';
import Viewer3DScreen from '../screens/Main/Viewer3DScreen';
import QuizQuestionScreen from '../screens/Quiz/QuizQuestionScreen';
import QuizResultScreen from '../screens/Quiz/QuizResultScreen';
import SubscriptionScreen from '../screens/Main/SubscriptionScreen';
import SettingsScreen from '../screens/Profile/SettingsScreen';
import ProgressScreen from '../screens/Main/ProgressScreen';
import BookmarksScreen from '../screens/Main/BookmarksScreen';
import { AuthContext } from '../context/AuthContext';
import { colors } from '../theme/colors';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { userToken, isSplashLoading } = useContext(AuthContext);

  if (isSplashLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {userToken !== null ? (
        <>
          <Stack.Screen name="MainApp" component={MainTabNavigator} />
          <Stack.Screen name="Viewer3D" component={Viewer3DScreen} />
          <Stack.Screen name="Learn" component={LearnScreen} />
          <Stack.Screen name="QuizQuestion" component={QuizQuestionScreen} />
          <Stack.Screen name="QuizResult" component={QuizResultScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ presentation: 'modal' }} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Progress" component={ProgressScreen} />
          <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
