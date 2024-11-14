import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { API_URL } from '@env';
import { PermissionsAndroid, Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';


// 푸시 알림 권한 요청
export async function requestNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }
  return true; // Android 13 미만에서는 자동으로 허가됨
}

// FCM 토큰 가져오기
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error.message);
    return null;
  }
}

// 서버에 FCM 토큰 저장하기
export const saveTokenToServer = async (token, userId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/FCM/save`, {
      token: token,
      userId: userId,
    });
    console.log('Token saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

// 포그라운드에서 FCM 메시지 처리
messaging().onMessage(async remoteMessage => {
  console.log('A new FCM message arrived!', remoteMessage);
  showNotification(remoteMessage.notification.title, remoteMessage.notification.body);
})

// 백그라운드 메시지 처리
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  showNotification(remoteMessage.notification.title, remoteMessage.notification.body);
})

// 알림 표시 함수 (푸시 알림이 도착하면 호출)
const showNotification = (title, body) => {
  PushNotification.localNotification({
    channelId: 'default-channel',
    title: title,
    message: body,
    playSound: true,
    soundName: 'default',
  });
}

// FCM 알림 채널 설정 (Android용)
export const configurePushNotification = () => {
  PushNotification.createChannel(
    {
      channelId: 'default-channel',
      channelName: 'Default Channel',
      channelDescription: 'A default channel to send notifications',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    },
    created => console.log(`CreateChannel returned '${created}'`)
  );
}

// 백그라운드에서 메시지가 도착했을 때 실행될 함수
export const setUpBackgroundMessageListener = () => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('Notification caused app to open from background state:', remoteMessage.notification);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('Notification caused app to open from quit state:', remoteMessage.notification);
      }
    });
}
