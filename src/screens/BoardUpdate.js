import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const BoardUpdate = ({ route, navigation }) => {
  const { boardSeq, onRefresh } = route.params; // onRefresh 콜백 전달
  const [boardDetails, setBoardDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = 'http://10.0.2.2:3000'; // 필요한 경우 API URL 수정

  useEffect(() => {
    fetchBoardDetails();
  }, []);

  // 게시글 정보를 서버에서 가져오는 함수
  const fetchBoardDetails = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      console.log(`Fetching: ${API_URL}/board/boardDetail?boardSeq=${boardSeq}`);
      const response = await axios.get(`${API_URL}/board/boardDetail?boardSeq=${boardSeq}`, {
        headers: { Authorization: accessToken },
      });

      // 서버에서 받은 게시글 데이터를 상태에 저장
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
      console.log('Saving board details with:', boardDetails);
  
      await axios.put(
        `${API_URL}/board/update`, // 정확한 URL 사용
        { ...boardDetails, boardSeq },
        {
          headers: { Authorization: ` ${accessToken}` }, // 'Bearer' 앞에 추가
        }
      );
  
      Alert.alert('성공', '게시글이 수정되었습니다.');
      if (onRefresh) onRefresh(); // 데이터 갱신 호출
      navigation.goBack(); // 수정 후 이전 화면으로 돌아가기
    } catch (error) {
      console.error('게시글 수정 중 오류 발생:', error);
      Alert.alert('오류', '게시글 수정에 실패했습니다.');
    }
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
      <TextInput
        style={styles.input}
        value={boardDetails?.name || ''}
        placeholder="개 이름"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, name: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.age?.toString() || ''}
        placeholder="나이"
        keyboardType="numeric"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, age: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.gender || ''}
        placeholder="성별"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, gender: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.weight?.toString() || ''}
        placeholder="몸무게"
        keyboardType="numeric"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, weight: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.missingDate || ''}
        placeholder="실종일 (YYYY-MM-DD)"
        onChangeText={(text) => setBoardDetails({ ...boardDetails, missingDate: text })}
      />
      <TextInput
        style={styles.input}
        value={boardDetails?.features || ''}
        placeholder="특징"
        multiline
        onChangeText={(text) => setBoardDetails({ ...boardDetails, features: text })}
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
});

export default BoardUpdate;
