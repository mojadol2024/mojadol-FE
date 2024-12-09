import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { launchImageLibrary } from 'react-native-image-picker';  // 이미지 피커 추가

const MissingDogRegistration = () => {
  const [missingDate, setMissingDate] = useState('');
  const [breed, setBreed] = useState('');
  const [region, setRegion] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [contact, setContact] = useState('');
  const [photo, setPhoto] = useState(null);

  // Modal visibility states
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  // 전체 지역 목록
  const regions = [
    '전체','서울', '부산', '대구', '인천', '광주', '대전', '울산',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  ];

  const handleRegister = async () => {
    // 필수 필드 검증
    if (!breed || !region || !contact) {
      Alert.alert('오류', '모든 필드를 채워주세요!');
      return;
    }

    try {
      // 액세스 토큰 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      // POST 요청으로 실종견 등록
      const response = await axios.post(
        `${API_URL}/missing-dog/register`, // 백엔드 엔드포인트
        {
          missingDate,
          breed,
          region,
          characteristics,
          contact,
          photo,  // 사진 포함
        },
        {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        // 응답에서 사진 URL 처리
        if (response.data.photoUrl) {
          setPhoto(response.data.photoUrl);
        }

        Alert.alert('성공', '실종견이 성공적으로 등록되었습니다!');

        // 필드 초기화
        setMissingDate('');
        setBreed('');
        setRegion('');
        setCharacteristics('');
        setContact('');
        setPhoto(null); // 사진 초기화
      } else {
        Alert.alert('오류', '실종견 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('실종견 등록 오류:', error);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('사용자가 이미지를 선택하지 않았습니다.');
      } else if (response.errorCode) {
        console.log('이미지 선택 에러:', response.errorMessage);
      } else {
        setPhoto(response.assets[0].uri); // 선택한 사진 URI 저장
      }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* 사진 표시 섹션 */}
        <Text style={styles.label}>사진</Text>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            <Text style={styles.imagePlaceholder}>사진 등록</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>실종일</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 2024년 9월 1일"
          value={missingDate}
          onChangeText={setMissingDate}
        />

        <Text style={styles.label}>견종</Text>
        <TextInput
          style={styles.input}
          placeholder="견종"
          value={breed}
          onChangeText={setBreed}
        />

        <Text style={styles.label}>실종 지역</Text>
        <TouchableOpacity style={styles.input} onPress={() => setRegionModalVisible(true)}>
          <Text>{region ? region : '지역 선택'}</Text>
        </TouchableOpacity>
        <Modal visible={isRegionModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {regions.map((area) => (
                <TouchableOpacity
                  key={area}
                  onPress={() => {
                    setRegion(area);
                    setRegionModalVisible(false);
                  }}
                  style={styles.modalItem}
                >
                  <Text style={styles.modalItemText}>{area}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>특이사항</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="강아지의 특징, 실종된 장소 등 정보를 작성해주세요."
          multiline
          numberOfLines={4}
          value={characteristics}
          onChangeText={setCharacteristics}
        />

        <Text style={styles.label}>연락처</Text>
        <TextInput
          style={styles.input}
          placeholder="연락처"
          value={contact}
          onChangeText={setContact}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#f1c0ba',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  imagePlaceholder: {
    color: '#fff',
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 22.375,
    paddingLeft: 10,
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    width: 300,
    padding: 20,
    borderRadius: 8,
  },
  modalItem: {
    padding: 12,
  },
  modalItemText: {
    fontSize: 18,
  },
  registerButton: {
    backgroundColor: '#f1c0ba',
    padding: 15,
    borderRadius: 4,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MissingDogRegistration;
