import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Inquiry = () => {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    if (question.trim()) {
      Alert.alert("문의하기", "질문이 제출되었습니다.");
      setQuestion(''); // 질문 제출 후 입력 필드를 초기화합니다.
    } else {
      Alert.alert("오류", "질문을 입력해주세요.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>문의하기</Text>

      <TextInput
        style={styles.input}
        placeholder="질문을 입력하세요."
        value={question}
        onChangeText={setQuestion}
        multiline
      />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>글쓰기</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 150,
    padding: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    marginBottom: 20,
    textAlignVertical: 'top',
  },
  submitButton: {
    padding: 15,
    backgroundColor: '#1A73E8', // 버튼 배경색을 연한 핑크색으로 설정
    borderRadius: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // 원하는 색상으로 텍스트 색상을 변경
  },
});

export default Inquiry;