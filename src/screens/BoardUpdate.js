import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_URL } from '@env';

const BoardUpdate = () => {
  const [boardData, setBoardData] = useState(null);
  const [breedName, setBreedName] = useState('');
  const [location, setLocation] = useState('');
  const [lostDate, setLostDate] = useState('');
  const [photo, setPhoto] = useState('');
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();
  const route = useRoute();
  const { boardSeq } = route.params; // 전달받은 boardSeq

  // 게시글 데이터 로드
  const loadBoardData = async () => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/board/boardDetail?boardSeq=${boardSeq}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      const data = response.data;
      setBoardData(data);
      setBreedName(data.breedName);
      setLocation(data.location);
      setLostDate(data.lostDate);
      setPhoto(data.photo);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching board data:', error);
      setLoading(false);
    }
  };

  // 게시글 데이터 로드 실행
  useEffect(() => {
    loadBoardData();
  }, []);

  // 게시글 수정 요청
  const handleUpdate = async () => {
    try {
      if (!breedName || !location || !lostDate) {
        Alert.alert('모든 필드를 입력해주세요.');
        return;
      }

      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.put(
        `${API_URL}/board/${boardSeq}`,
        { breedName, location, lostDate, photo }, // 수정할 데이터
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        Alert.alert('게시글이 수정되었습니다.');
        navigation.goBack(); // 이전 화면으로 이동
      } else {
        Alert.alert('수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error updating board:', error);
      Alert.alert('수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>로딩 중...</Text>
      ) : boardData ? (
        <>
          <Text style={styles.label}>품종</Text>
          <TextInput
            style={styles.input}
            value={breedName}
            onChangeText={setBreedName}
            placeholder="품종 입력"
          />

          <Text style={styles.label}>발견 장소</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="발견 장소 입력"
          />

          <Text style={styles.label}>실종 날짜</Text>
          <TextInput
            style={styles.input}
            value={lostDate}
            onChangeText={setLostDate}
            placeholder="YYYY-MM-DD"
          />

          <Text style={styles.label}>사진</Text>
          {photo ? (
            <Image source={{ uri: photo }} style={styles.image} />
          ) : (
            <Text style={styles.noPhotoText}>사진이 없습니다.</Text>
          )}

          <TouchableOpacity style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>수정 완료</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.errorText}>게시글 데이터를 불러올 수 없습니다.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  noPhotoText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#008CBA',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#888',
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    color: 'red',
  },
});

export default BoardUpdate;
