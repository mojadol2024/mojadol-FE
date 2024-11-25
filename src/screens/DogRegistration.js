import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import Button from './Button'; // Button 컴포넌트 import
//Button의 위치가 이상함 -> 화남

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
  
  // Modal visibility states
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  // Modal visibility states
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  const handleRegister = () => {
    if (!name || !gender || !age || !weight) {
      alert("모든 필드를 채워주세요!");
      return;
    }
    alert('등록되었습니다.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.imageContainer}>
          <Text style={styles.imagePlaceholder}>사진 등록</Text>
        </View>

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
              <TouchableOpacity onPress={() => { setGender('male'); setGenderModalVisible(false); }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>수컷</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setGender('female'); setGenderModalVisible(false); }} style={styles.modalItem}>
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
              <TouchableOpacity onPress={() => { setRegion('서울'); setRegionModalVisible(false); }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>서울</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setRegion('부산'); setRegionModalVisible(false); }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>부산</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setRegion('대구'); setRegionModalVisible(false); }} style={styles.modalItem}>
                <Text style={styles.modalItemText}>대구</Text>
              </TouchableOpacity>
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

        {/* 기존 등록 버튼 */}
        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록</Text>
        </TouchableOpacity>

        {/* 추가된 Button.js 컴포넌트 버튼 */}
        <Button title="추가 버튼" onPress={() => alert('추가 버튼 클릭')} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#C78C30',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePlaceholder: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444444',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#C78C30',
    borderWidth: 1,
    borderRadius: 22.375,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  registerButton: {
    backgroundColor: '#C78C30',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    width: '70%',
  },
  modalItem: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 22.375,
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default DogRegistration;