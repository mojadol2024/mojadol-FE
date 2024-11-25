import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Modal, Alert } from 'react-native';

const MissingDogRegistration = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [missingDate, setMissingDate] = useState('');
  const [breed, setBreed] = useState('');
  const [region, setRegion] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [contact, setContact] = useState('');

  // 모달 상태
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
  const [isRegionModalVisible, setRegionModalVisible] = useState(false);

  const handleRegister = () => {
    Alert.alert("등록 완료", "실종견 정보가 등록되었습니다.");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
            <TouchableOpacity onPress={() => { setRegion('서울특별시'); setRegionModalVisible(false); }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>서울특별시</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setRegion('경기도 성남시'); setRegionModalVisible(false); }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>경기도 성남시</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setRegion('부산광역시'); setRegionModalVisible(false); }} style={styles.modalItem}>
              <Text style={styles.modalItemText}>부산광역시</Text>
            </TouchableOpacity>
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  imageContainer: {
    width: '100%',
    height: 150,
    backgroundColor: '#D8B894',
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
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRadius: 5,
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
    backgroundColor: '#D8B894',
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
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  modalItemText: {
    fontSize: 16,
  },
});

export default MissingDogRegistration;