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
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { GooeyMenu } from './GooeyMenu';

const DogRegistration = () => {
  const navigation = useNavigation();
  const [missingDate, setMissingDate] = useState('');
  const [breed, setBreed] = useState('');
  const [province, setProvince] = useState(''); 
  const [city, setCity] = useState(''); 
  const [district, setDistrict] = useState(''); 
  const [characteristics, setCharacteristics] = useState('');
  const [photos, setPhotos] = useState([]);
  const [confidence, setConfidence] = useState('');
  const [writeFlag, setWriteFlag] = useState(false);

  // Modal visibility states
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  // 전체 지역 목록
  const provinces = [
    '서울', '부산', '대구', '인천', '광주', '대전', '울산',
    '경기', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주',
  ];

  const handleRegister = async () => {
    if (!breed && !province && !city && !district && !characteristics){
      Alert.alert('오류', '모든 필드를 채워주세요!');
      return;
    }

    try {
      // 액세스 토큰 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');

      const formData = new FormData();
      formData.append('data', JSON.stringify({
        lostDate: missingDate,
        breedName: breed,
        province: province,
        city: city,
        district: district,
        memo: characteristics,
        report: 1
      }));

      // 여러 사진 추가 로직
      if (photos && photos.length > 0) {
        photos.forEach((photoUri) => {
          formData.append('file', {
            uri: photoUri,
            type: 'image/jpeg',
            name: `photo_${Date.now()}.jpg`, // 파일 이름을 고유하게 설정
          });
        });
      }

      // POST 요청으로 실종견 등록
      const response = await axios.post(
        `${API_URL}/board/write`, formData, {
          headers: {
            Authorization: accessToken,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('성공', '실종견이 성공적으로 등록되었습니다!');
        navigation.navigate('Board', {refresh: true});
      } else {
        Alert.alert('오류', '강아지 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('강아지 등록 오류:', error);
      Alert.alert('오류', '서버 요청 중 문제가 발생했습니다.');
    }
  };

  const pickImages = () => {
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
        const selectedPhotos = response.assets.map(asset => asset.uri);
        setPhotos(selectedPhotos);
      }
    });
  };

  const removeImage = (indexToRemove) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  const callModel = async () => {

    if (photos.length === 0) {
      Alert.alert('경고', '사진을 1장 이상 등록해야만 견종 등록이 가능합니다.');
      return;
    }
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      const formData = new FormData();
      if (photos && photos.length > 0) {
        photos.forEach((photoUri) => {
          formData.append('file', {
            uri: photoUri,
            type: 'image/jpeg',
            name: `photo_${Date.now()}.jpg`, // 파일 이름을 고유하게 설정
          });
        });
      }

      const response = await axios.post(
        `${API_URL}/board/model`, formData, {
          headers: {
            Authorization: accessToken,
            'Content-Type':'multipart/form-data',
          },
        }
      );

      console.log(response.data)
      console.log(response.data.Predicted)
      if (response.data.is_dog) {
        setBreed(response.data.Predicted);
        setConfidence(response.data.confidence);
        setWriteFlag(true);
        Alert.alert('성공', '모델 호출 성공');
      }else {
        Alert.alert('경고', '개로 판별 되지않습니다. 다른 사진을 등록해주세요');
      }
    } catch (error) {
      console.error('call model error:', error);
    }

  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        {/* 사진 표시 섹션 */}
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
            <Text style={styles.buttonText}>사진 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={callModel}>
            <Text style={styles.buttonText}>견종 탐색</Text>
          </TouchableOpacity>
        </View>

        {/* 선택된 사진들 미리보기 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {photos.map((photoUri, index) => (
            <View key={index} style={styles.thumbnailContainer}>
              <Image source={{ uri: photoUri }} style={styles.thumbnail} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={() => removeImage(index)}
              >
                <Text style={styles.removeImageText}>X</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* 나머지 입력 필드는 이전 코드와 동일 */}
        <Text style={styles.label}>발견일</Text>
        <TextInput
          style={styles.input}
          placeholder="예: 20240901"
          value={missingDate}
          onChangeText={setMissingDate}
        />

        {/* 이하 기존 코드와 동일 */}
        <Text style={styles.label}>견종</Text>
        <TextInput
          style={styles.input}
          placeholder="견종"
          value={breed}
          onChangeText={setBreed}
        />

        {/* 실손 지역 (도) 모달 */}
        <Text style={styles.label}>발견 지역</Text>
        <TouchableOpacity style={styles.input} onPress={() => setRegionModalVisible(true)}>
          <Text>{province ? province : '지역 선택'}</Text>
        </TouchableOpacity>
        
        <Modal visible={isRegionModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {provinces.map((area) => (
                <TouchableOpacity
                  key={area}
                  onPress={() => {
                    setProvince(area);
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

        {/* 시 입력 */}
        <TextInput
          style={styles.input}
          placeholder="시"
          value={city}
          onChangeText={setCity}
        />

        {/* 동 */}
        <TextInput
          style={styles.input}
          placeholder="동"
          value={district}
          onChangeText={setDistrict}
        />

        <Text style={styles.label}>특이사항</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="강아지의 특징, 발견된 장소 등 정보를 작성해주세요."
          multiline
          numberOfLines={4}
          value={characteristics}
          onChangeText={setCharacteristics}
        />

        <TouchableOpacity
          style={[
            styles.registerButton,
            writeFlag ? {} : { backgroundColor: '#ccc' },
          ]}
          onPress={handleRegister}
          disabled={!writeFlag}
        >
          <Text style={styles.registerButtonText}>등록하기</Text>
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
  thumbnailContainer: {
    position: 'relative',
    marginRight: 10,
    marginBottom: 10,
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
    borderRadius: 22.375,
    alignItems: 'center',
    marginTop: 20
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },buttonRow: {
    flexDirection: 'row', // 가로로 버튼 배치
    justifyContent: 'space-between', // 버튼 간의 간격 유지
    marginVertical: 10, // 위아래 간격
  },
  uploadButton: {
    flex: 1, // 버튼이 균등한 크기로 확장
    backgroundColor: '#f1c0ba', // 버튼 색상
    padding: 12,
    borderRadius: 22.375,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5, // 버튼 간 좌우 간격
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default DogRegistration;