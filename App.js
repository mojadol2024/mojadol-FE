import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // 이 부분만 남기기
import LoginNavigator from './src/navigation/LoginNavigator';
import BoardNavigator from './src/navigation/BoardNavigator'; // BoardNavigator import
import '@react-native-firebase/app'; // This initializes Firebase automatically
import messaging from '@react-native-firebase/messaging'; // Import messaging module

const Stack = createStackNavigator();

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // 앱 시작 시 액세스 토큰 확인
    const checkLoginStatus = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        if (accessToken) {
          setIsLoggedIn(true);  // 토큰이 있으면 로그인 상태로 설정
        } else {
          setIsLoggedIn(false); // 토큰이 없으면 로그인 화면으로 설정
        }
      } catch (error) {
        console.error('액세스 토큰 확인 실패:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();

    // 푸시 알림 수신 설정
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground message:', remoteMessage);
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification caused app to open from background:', remoteMessage);
    });

    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        console.log('App was opened by a notification:', remoteMessage);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isLoggedIn ? (
          <Stack.Screen name="BoardNavigator" component={BoardNavigator} options={{ headerShown: false }}/>
        ) : (
          <Stack.Screen name="LoginNavigator" component={LoginNavigator} options={{ headerShown: false }}/>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
