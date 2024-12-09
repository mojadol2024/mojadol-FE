import React, { useState } from 'react';
import { //등록하는 건 이름, 몸무게, 나이 등을 모르니까 빼도 되나 
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
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';



const DogRegistration = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
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

  const handleChoosePhoto = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
      if (response.didCancel) {
        console.log('사용자가 이미지를 선택하지 않았습니다.');
      } else if (response.errorCode) {
        console.log('이미지 선택 에러:', response.errorMessage);
      } else {
        setPhoto(response.assets[0]);
      }
    });
  };

  const handleRegister = async () => {
    // 필수 필드 검증
    if (!name || !gender || !age || !weight || !breed || !region || !contact) {
      Alert.alert('오류', '모든 필드를 채워주세요!');
      return;
    }

    try {
      // 액세스 토큰 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      // 사진 업로드
      const formData = new FormData();
      if (photo) {
        formData.append('photo', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName,
        });
      }

      // 다른 필드 추가
      formData.append('name', name);
      formData.append('gender', gender);
      formData.append('age', age);
      formData.append('weight', weight);
      formData.append('missingDate', missingDate);
      formData.append('breed', breed);
      formData.append('region', region);
      formData.append('characteristics', characteristics);
      formData.append('contact', contact);

      // POST 요청으로 강아지 등록
      const response = await axios.post(`${API_URL}/dog/register`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        Alert.alert('성공', '강아지가 성공적으로 등록되었습니다!');
        // 필드 초기화
        setName('');
        setGender('');
        setAge('');
        setWeight('');
        setMissingDate('');
        setBreed('');
        setRegion('');
        setCharacteristics('');
        setContact('');
        setPhoto(null);
      } else {
        Alert.alert('오류', '강아지 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('강아지 등록 오류:', error);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
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
          <Image source={{ uri: photo.uri }} style={styles.image} />
        ) : (
          <TouchableOpacity style={styles.imageContainer} onPress={handleChoosePhoto}>
            <Text style={styles.imagePlaceholder}>사진 등록</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="강아지 이름"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>성별</Text>
        <TouchableOpacity style={styles.input} onPress={() => setGenderModalVisible(true)}>
          <Text>{gender ? (gender === 'male' ? '수컷' : '암컷') : '성별 선택'}</Text>
        </TouchableOpacity>
        <Modal visible={isGenderModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  setGender('male');
                  setGenderModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text style={styles.modalItemText}>수컷</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setGender('female');
                  setGenderModalVisible(false);
                }}
                style={styles.modalItem}
              >
                <Text style={styles.modalItemText}>암컷</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Text style={styles.label}>나이</Text>
        <TextInput
          style={styles.input}
          placeholder="나이"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <Text style={styles.label}>몸무게</Text>
        <TextInput
          style={styles.input}
          placeholder="몸무게 (kg)"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />

        <Text style={styles.label}>발견일</Text>
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

        <Text style={styles.label}>발견 지역</Text>
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
          placeholder="강아지의 특징, 발견된 장소 등 정보를 작성해주세요."
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
  scrollContainer: {
    paddingBottom: 20,
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

export default DogRegistration;