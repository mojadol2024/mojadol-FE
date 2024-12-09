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
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const MissingDogRegistration = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [missingDate, setMissingDate] = useState('');
  const [breed, setBreed] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [contact, setContact] = useState('');
  const [photos, setPhotos] = useState([]); // 여러 사진을 저장할 배열로 변경

  // Modal visibility states
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  // 전체 지역 목록
  const provinces = [
    '전체','서울', '부산', '대구', '인천', '광주', '대전', '울산',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  ];

  const handleChoosePhotos = () => {
    launchImageLibrary({ 
      mediaType: 'photo', 
      quality: 1,
      selectionLimit: 5 // 최대 5장의 사진 선택 가능
    }, (response) => {
      if (response.didCancel) {
        console.log('사용자가 이미지를 선택하지 않았습니다.');
      } else if (response.errorCode) {
        console.log('이미지 선택 에러:', response.errorMessage);
      } else {
        // 선택된 사진들 저장
        setPhotos(response.assets);
      }
    });
  };

  const removeImage = (indexToRemove) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const handleRegister = async () => {
    // 필수 필드 검증
    if (!name || !gender || !age || !weight || !breed || !province || !contact) {
      Alert.alert('오류', '모든 필드를 채워주세요!');
      return;
    }

    try {
      // 액세스 토큰 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      // 사진 업로드
      const formData = new FormData();
      
      // 여러 사진 추가
      photos.forEach((photo, index) => {
        formData.append('photos', {
          uri: photo.uri,
          type: photo.type,
          name: photo.fileName || `photo_${index}.jpg`,
        });
      });

      // 다른 필드 추가
      formData.append('dogName', name);
      formData.append('dogGender', gender);
      formData.append('dogAge', age);
      formData.append('dogWeight', weight);
      formData.append('lostDate', missingDate);
      formData.append('breedName', breed);
      formData.append('province', province);
      formData.append('city', city);
      formData.append('district', district);
      formData.append('memo', characteristics);
      formData.append('report', 0);
      
      // POST 요청으로 강아지 등록
      const response = await axios.post(`${API_URL}/board/write`, formData, {
        headers: {
          Authorization: `${accessToken}`,
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
        setCity('');
        setProvince('');
        setDistrict('');
        setCharacteristics('');
        setContact('');
        setPhotos([]);
        
        navigation.navigate('Board');
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
        <Text style={styles.label}>사진 ({photos.length}/5)</Text>
        <TouchableOpacity style={styles.imageContainer} onPress={handleChoosePhotos}>
          <Text style={styles.imagePlaceholder}>사진 등록</Text>
        </TouchableOpacity>

        {/* 선택된 사진들 미리보기 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScrollView}>
          {photos.map((photo, index) => (
            <View key={index} style={styles.thumbnailContainer}>
              <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* 나머지 기존 입력 필드들 */}
        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          placeholder="강아지 이름"
          value={name}
          onChangeText={setName}
        />

        {/* 기존 코드의 나머지 입력 필드들 (성별, 나이, 몸무게 등) 그대로 유지 */}
        {/* ... (이전 코드의 나머지 부분) */}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록하기</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // 기존 스타일들 그대로 유지
  ...StyleSheet.create({
    // 새로 추가된 스타일
    photoScrollView: {
      marginBottom: 20,
    },
    thumbnailContainer: {
      position: 'relative',
      marginRight: 10,
    },
    thumbnail: {
      width: 100,
      height: 100,
      borderRadius: 10,
    },
    removeImageButton: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: 'rgba(255,0,0,0.7)',
      borderRadius: 15,
      width: 25,
      height: 25,
      justifyContent: 'center',
      alignItems: 'center',
    },
    removeImageText: {
      color: 'white',
      fontWeight: 'bold',
    },
  }),
});

export default MissingDogRegistration;