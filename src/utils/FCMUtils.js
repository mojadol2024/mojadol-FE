import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import { API_URL } from '@env';

// 푸시 알림 권한 요청
export const requestUserPermission = async () => {
  const authorizationStatus = await messaging().requestPermission();
  if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
    console.log('Notification permission granted');
  } else {
    console.log('Notification permission denied');
  }
};

// FCM 토큰 가져오기
export const getFCMToken = async () => {
  try {
    const token = await messaging().getToken();
    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error.message);
    console.error('Error details:', error);
    return null;
  }
};

// 서버에 FCM 토큰 저장하기
export const saveTokenToServer = async (token, userId) => {
  try {
    const response = await axios.post(`${API_URL}/auth/FCM/save`, {
      token: token,
      userId: userId, // 서버에서 사용할 사용자 ID
    });
    console.log('Token saved successfully:', response.data);
  } catch (error) {
    console.error('Error saving token:', error);
  }
};
