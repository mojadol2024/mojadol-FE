import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Modal, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';
import { GooeyMenu } from './GooeyMenu';

const BoardUpdate = ({ route}) => {
  const { boardSeq, onRefresh } = route.params; // onRefresh 콜백 전달
  const [boardDetails, setBoardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [writeFlag, setWriteFlag] = useState(false);
  const [confidence, setConfidence] = useState('');

  useEffect(() => {
    fetchBoardDetails();
  }, []);

  // 게시글 정보를 서버에서 가져오는 함수
  const fetchBoardDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/board/boardDetail?boardSeq=${boardSeq}`, {
        headers: { Authorization: accessToken },
      });
      
      setBoardDetails(response.data.boardDetail);

    } catch (error) {
      console.error('게시글 정보를 가져오는 데 실패했습니다:', error);
      Alert.alert('오류', '게시글 정보를 가져오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 게시글 수정 API 호출
  const handleSave = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');

      if (boardDetails.dogGender === '수컷') {
        boardDetails.dogGender = 0;
      }else if (boardDetails.dogGender === '암컷') {
        boardDetails.dogGender = 1;
      }

      const formData = new FormData();
      formData.append('data', JSON.stringify({
        lostDate: boardDetails.lostDate,
        dogName: boardDetails.dogName,
        memo: boardDetails.memo,
        dogGender: boardDetails.dogGender,
        dogAge: boardDetails.dogAge,
        dogWeight: boardDetails.dogWeight,
        breedName: boardDetails.breedName,
        boardSeq: boardSeq
      }));

      if (photos && photos.length > 0) {
        photos.forEach((photoUri) => {
          formData.append('file', {
            uri: photoUri,
            type: 'image/jpeg',
            name: `photo_${Date.now()}.jpg`, // 파일 이름을 고유하게 설정
          });
        });
      }
  
      const response = await axios.post(`${API_URL}/board/update`,formData, {
        headers: {
          Authorization: accessToken,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.data === "YES") {
        Alert.alert('성공', '게시글이 수정되었습니다.');
        navigation.navigate("Board", { refresh: true });
      }
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
  };

  const handleGenderSelect = (gender) => {
    setBoardDetails({ ...boardDetails, dogGender: gender });
    setModalVisible(false); // 모달 닫기
  };

  const pickImages = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        selectionLimit: 5, // 최대 5장의 사진 선택 가능
      },
      (response) => {
        if (response.didCancel) {
          console.log('사용자가 이미지를 선택하지 않았습니다.');
        } else if (response.errorCode) {
          console.log('이미지 선택 에러:', response.errorMessage);
        } else {
          // 선택된 사진들의 URI 저장
          const selectedPhotos = response.assets.map((asset) => asset.uri);
  
          // photos 상태와 boardDetails.photos를 동기화
          setPhotos(selectedPhotos);
          setBoardDetails((prevDetails) => ({
            ...prevDetails,
            photos: selectedPhotos,
          }));
        }
      }
    );
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
        setBoardDetails((prevDetails) => ({
          ...prevDetails,
          breedName: response.data.Predicted,
        }));
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.uploadButton} onPress={pickImages}>
            <Text style={styles.buttonText}>사진 등록</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadButton} onPress={callModel}>
            <Text style={styles.buttonText}>견종 탐색</Text>
          </TouchableOpacity>
        </View>
      {boardDetails?.photos && boardDetails?.photos.length > 0 ? (
        <Swiper
          key={boardDetails.photos.join(',')} // 배열이 변경될 때마다 새로 렌더링
          showsButtons={true} 
          style={styles.wrapper}
        >
          {boardDetails.photos.map((photo, index) => (
            <Image key={index} source={{ uri: photo }} style={styles.image} />
          ))}
        </Swiper>
      ) : (
        <View style={styles.noPhotosContainer}>
          <Text style={styles.noPhotosText}>No photos available</Text>
        </View>
      )}
      <TextInput
        style={styles.input}
        value={boardDetails?.breedName || ''}
        placeholder="견종"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, breedName: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.dogName || ''}
        placeholder="개 이름"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, dogName: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.dogAge?.toString() || ''}
        placeholder="나이"
        keyboardType="numeric"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, dogAge: text })}
      />
      {/* 성별 표시 */}
      <TouchableOpacity
        style={styles.input}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.inputText}>
          {boardDetails.dogGender === 0
            ? '암컷'
            : boardDetails.dogGender === 1
            ? '수컷'
            : boardDetails.dogGender === 2
            ? '모름'
            : '성별 선택'}
        </Text>
      </TouchableOpacity>
      {/* Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>성별을 선택하세요</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect(0)}
            >
              <Text style={styles.modalButtonText}>암컷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect(1)}
            >
              <Text style={styles.modalButtonText}>수컷</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => handleGenderSelect(2)}
            >
              <Text style={styles.modalButtonText}>모름</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalCancelButtonText}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TextInput
        style={styles.input}
        value={boardDetails?.dogWeight?.toString() || ''}
        placeholder="몸무게"
        keyboardType="numeric"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, dogWeight: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.lostDate || ''}
        placeholder="실종일 (YYYY-MM-DD)"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, lostDate: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.memo || ''}
        placeholder="특징"
        multiline
        onChangeText={(text) => setBoardDetails({ ...boardDetails, memo: text })}
      />
      <TouchableOpacity
          style={[
            styles.registerButton,
            writeFlag ? {} : { backgroundColor: '#ccc' },
          ]}
          onPress={handleSave}
          disabled={!writeFlag}
        >
          <Text style={styles.registerButtonText}>수정하기</Text>
        </TouchableOpacity>

      {/* GooeyMenu 추가 */}
      <GooeyMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 22.375, // 그림자 흐림 정도
    elevation: 5, // Android에서 그림자 효과를 주기 위한 속성
  },
   saveButton: {
    backgroundColor: '#f1c0ba', // 버튼 배경색
    paddingVertical: 12,         // 버튼의 세로 크기
    paddingHorizontal: 30,       // 버튼의 가로 크기
    borderRadius: 22.375,            // 버튼의 둥근 모서리
    alignItems: 'center',        // 텍스트가 버튼 안에서 중앙에 위치하도록
    marginTop: 20,               // 위에서 약간 떨어지도록
  },
  saveButtonText: {
    color: '#000000',              // 버튼 텍스트 색상 (흰색)
    fontSize: 16,                // 텍스트 크기
    fontWeight: 'bold',          // 텍스트 두껍게
  },
  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 10,
    padding: 10,
    borderRadius: 22.375,
    backgroundColor: '#fff',
    elevation: 5,  // 안드로이드에서 그림자 효과
    shadowColor: '#000',  // iOS에서 그림자 색상
    shadowOffset: { width: 0, height: 2 },  // iOS에서 그림자의 위치
    shadowOpacity: 0.2,  // iOS에서 그림자의 투명도
    shadowRadius: 3,  // iOS에서 그림자의 반경
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%', // 화면 전체 너비
    height: 300,   // 고정된 높이
    resizeMode: 'cover', // 이미지 크기 조정
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // 그림자 위치
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 6, // 그림자 흐림 정도
    elevation: 5, // Android에서 그림자 효과를 주기 위한 속성
    
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // 반투명 배경
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#f1c0ba',  // 버튼 배경 색상
    paddingVertical: 10,
    marginVertical: 10,
    borderRadius: 22.375,
    width: '100%',  // 버튼을 좌우로 길게 만들기 위해 너비를 80%로 설정
  },
  modalButtonText: {
    color: '#000', // 텍스트 색상 변경 (검정색)
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',  // 텍스트를 중앙 정렬
  },
  modalCancelButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f1c0ba', // 취소 버튼 배경 색상 (예시)
    borderRadius: 22.375,
  },
  modalCancelButtonText: {
    color: '#000', // 취소 버튼 텍스트 색상
    fontSize: 16,
    fontWeight: 'bold',
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
  },registerButtonText: {
    color: '#fff',
    fontSize: 18,
  },registerButton: {
    backgroundColor: '#f1c0ba',
    padding: 15,
    borderRadius: 22.375,
    alignItems: 'center',
    marginTop: 20
  },
});

export default BoardUpdate;
