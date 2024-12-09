import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator, Modal, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { launchImageLibrary } from 'react-native-image-picker';

const BoardUpdate = ({ route}) => {
  const { boardSeq, onRefresh } = route.params; // onRefresh 콜백 전달
  const [boardDetails, setBoardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [photos, setPhotos] = useState([]);

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
      formData.append('lostDate', boardDetails.lostDate);
      formData.append('breedName', boardDetails.dogName);
      formData.append('memo', boardDetails.memo);
      formData.append('dogGender', boardDetails.dogGender);
      formData.append('memo', boardDetails.dogAge);

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
      if (response.statusCode === 200) {
        Alert.alert('성공', '게시글이 수정되었습니다.');
        navigation.navigate("Board");
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
      <Text style={styles.title}>게시글 수정</Text>
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
      {/* 사진 변경 버튼 */}
      <TouchableOpacity style={styles.imageContainer} onPress={pickImages}>
        <Text style={styles.imagePlaceholder}>사진 변경</Text>
      </TouchableOpacity>
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
      <Button title="수정 완료" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
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
    borderRadius: 5,
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
  },modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    width: '100%',
    padding: 12,
    marginVertical: 5,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    width: '100%',
    padding: 12,
    marginTop: 10,
    backgroundColor: '#ddd',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BoardUpdate;
