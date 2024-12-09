import React, { useState, useEffect, } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert, Switch } from 'react-native';  // TextInput 추가
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import PushNotification from 'react-native-push-notification';

export default function MyPageScreen() {
  // 닉네임 상태 생성
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();
  const [isPushEnabled, setIsPushEnabled] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken'); 
        const response = await axios.get(`${API_URL}/myActivity/userData`, {
          headers: {
            Authorization: accessToken,
          },
        });
        const data = response.data;
        setNickname(data.nickName);
      } catch (error) {
        console.error('내 정보 가져오기 실패', error);
      }
    };
    fetchMyPosts()

  }, []);

  useEffect(() => {
    const fetchPushNotificationSetting = async () => {
      try {
        // AsyncStorage에서 저장된 푸시 알림 상태 불러오기
        const savedPushNotification = await AsyncStorage.getItem('pushNotificationEnabled');
        if (savedPushNotification !== null) {
          // 저장된 값이 있으면 해당 상태로 초기화
          setIsPushEnabled(savedPushNotification === 'true');
        }
      } catch (error) {
        console.error('푸시 알림 상태 불러오기 실패', error);
      }
    };
  
    fetchPushNotificationSetting();
  }, []);

  const handlePasswordCheck = async () => {
    if (loading) return; // 로딩 중일 경우 중복 실행 방지

    if (!password.trim()) {
      Alert.alert('Error', '비밀번호를 입력하세요.');
      return;
    }

    setLoading(true); // 로딩 시작
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.post(
            `${API_URL}/myActivity/passwordCheck`,
            { 
              userPw : password 
            },
            {
              headers: {
                  Authorization: accessToken,
              },
            }
        );     
        if (response.data == "YES") {
          setIsModalVisible(false);
          setPassword('');
          navigation.navigate('EditProfileScreen');
        } else {
          Alert.alert('Error', '비밀번호가 일치하지 않습니다.');
        }    
    } catch (error) {
      console.error('비밀번호 확인 실패', error);
      Alert.alert('Error', '비밀번호 확인 중 오류가 발생했습니다.');
    } finally {
      setLoading(false); // 로딩 종료
    }
};

const togglePushNotification = async (value) => {
  setIsPushEnabled(value); // 푸시 알림 상태 업데이트
  try {
    // AsyncStorage에 푸시 알림 상태 저장
    await AsyncStorage.setItem('pushNotificationEnabled', value ? 'true' : 'false');

    if (value) {
      // 푸시 알림을 활성화할 때 권한을 요청
      PushNotification.checkPermissions((permissions) => {
        if (!permissions.alert) {
          // 알림 권한이 없으면 요청
          PushNotification.requestPermissions();
        }
      });

      // 푸시 알림을 활성화할 때 onNotification 콜백을 설정
      PushNotification.configure({
        onNotification: function(notification) {
          console.log("푸시 알림", notification);
        },
        // 기타 설정 (옵션으로 아이콘 배지 수 설정)
        onAction: function(notification) { console.log("Action", notification.action); },
        onRegistrationError: function(err) { console.error(err); },
      });
    } else {
      // 푸시 알림 비활성화 시 onNotification 콜백을 비워서 알림을 무시
      PushNotification.configure({
        onNotification: function(notification) {
          return; // 알림 무시
        },
        // 아이콘 배지 초기화
        onRegistrationError: function(err) { console.error(err); },
      });
      PushNotification.setApplicationIconBadgeNumber(0); // 앱 아이콘 배지 초기화
    }
  } catch (error) {
    console.error('푸시 알림 설정 오류', error);
  }
};

const handleLogout = async () => {
  try {
    // 액세스 토큰을 AsyncStorage에서 가져옴
    const accessToken = await AsyncStorage.getItem('accessToken');
    
    if (accessToken) {
      // 백엔드에 로그아웃 요청
      await axios.post(`${API_URL}/auth/logout`, {}, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
    }

    // AsyncStorage에서 액세스 토큰 삭제
    await AsyncStorage.removeItem('accessToken');
    
    // 로그아웃 후 로그인 화면으로 이동
    navigation.replace('LoginScreen');
  } catch (error) {
    // 로그아웃 요청 중 오류가 발생하면 에러 처리
    if (error.response && error.response.status === 401) {
      // 401 에러가 발생한 경우 로그인 화면으로 리다이렉트
      Alert.alert('로그인 정보가 만료되었습니다. 다시 로그인해주세요.');
      navigation.replace('LoginScreen');
    } else {
      console.error('로그아웃 실패', error);
      Alert.alert('로그아웃 중 오류가 발생했습니다.');
    }
  }
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{nickname}님</Text>
        <View style={styles.pushNotificationContainer}>
          <Text style={styles.pushNotificationText}>
            {isPushEnabled ? '알림 on' : '알림 off'}
          </Text>
          <Switch
            value={isPushEnabled}
            onValueChange={togglePushNotification} // 토글 상태 변경 함수
            trackColor={{ true: '#F1c0ba', false: '#eaeaea' }} 
            thumbColor={isPushEnabled ? '#ffffff' : '#cccccc'}
          />
        </View>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>마이메뉴</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyActive')}
        >
          <Text style={styles.menuItemText}>나의 활동</Text>
        </TouchableOpacity>

        {/* 회원 정보 수정 버튼 클릭 시 모달 띄우기 */}
        <TouchableOpacity style={styles.menuItem} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.menuItemText}>회원 정보 수정</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>비밀번호 확인</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="비밀번호를 입력하세요"
                  secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                    style={styles.checkIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                    <Text>
                        {isPasswordVisible ? '🙈' : '👁️'}
                    </Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handlePasswordCheck}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>{loading ? '확인 중...' : '확인'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => {setIsModalVisible(false); setPassword('');}}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>


        <Text style={styles.menuTitle}>정보</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('NoticeScreen')}
        >
          <Text style={styles.menuItemText}>공지사항</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Inquiry')}
        >
          <Text style={styles.menuItemText}>문의하기</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>기타</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.menuItemText}>추천 60분 후원하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <Text style={styles.menuItemText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#F1c0ba',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#F1c0ba',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
  },
  menuItemText: {
    fontSize: 14,
    color: '#000000',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 배경
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#F1c0ba',
    padding: 10,
    marginBottom: 10,
    borderRadius: 22.375,
    backgroundColor: '#fff',
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  checkIcon: {
      position: 'absolute',  
      right: 15, 
      bottom: 25, 
      fontSize: 20, 
  },
  buttonContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%',
    marginTop: 5,
  },
  confirmButton: {
    backgroundColor: '#F1c0ba',
    padding: 15,
    borderRadius: 22.375,
    alignItems: 'center',
    width: '48%',
  },
  cancelButton: {
    backgroundColor: '#cccccc',
    padding: 15,
    borderRadius: 22.375,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
});

