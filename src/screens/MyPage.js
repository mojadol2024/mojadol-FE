import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';  // TextInput 추가
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

export default function MyPageScreen() {
  // 닉네임 상태 생성
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false); // 모달 표시 여부
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{nickname}</Text>
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

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Alarm')}
        >
          <Text style={styles.menuItemText}>알림 설정</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>정보</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('NoticeScreen')}
        >
          <Text style={styles.menuItemText}>공지사항</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('InquiryList')}
        >
          <Text style={styles.menuItemText}>문의하기</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>기타</Text>
        <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('Payment')}>
          <Text style={styles.menuItemText}>추천 60분 후원하기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
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
    borderBottomColor: '#CCCCCC',
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

