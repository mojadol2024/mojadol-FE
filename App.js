import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginNavigator from './src/navigation/LoginNavigator';
import '@react-native-firebase/app'; // This initializes Firebase automatically
import messaging from '@react-native-firebase/messaging'; // Import messaging module
import PaymentScreen from './src/screens/Payment';  // Board 스크린 import


const Stack = createStackNavigator();

const App = () => {
  useEffect(() => {

    // 앱이 포그라운드에 있을 때 푸시 알림 수신
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
      <PaymentScreen />
    </NavigationContainer>
  );
};

export default App;
