import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 

const DogRegistrationScreen = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [missingDate, setMissingDate] = useState('');
  const [breed, setBreed] = useState('');
  const [region, setRegion] = useState('');
  const [characteristics, setCharacteristics] = useState('');
  const [contact, setContact] = useState('');

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
        <Picker
          selectedValue={gender}
          style={styles.input}
          onValueChange={setGender}
        >
          <Picker.Item label="성별 선택" value="" />
          <Picker.Item label="수컷" value="male" />
          <Picker.Item label="암컷" value="female" />
        </Picker>

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
        <Picker
          selectedValue={region}
          style={styles.input}
          onValueChange={setRegion}
        >
          <Picker.Item label="지역 선택" value="" />
          <Picker.Item label="서울" value="seoul" />
          <Picker.Item label="부산" value="busan" />
          <Picker.Item label="대구" value="daegu" />
        </Picker>

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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
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
});

export default DogRegistration;
