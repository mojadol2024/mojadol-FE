import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const EditProfileScreen = () => {
    const [nickName, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        const getProfile = async () => {
            try {
            const accessToken = await AsyncStorage.getItem('accessToken'); 
            const response = await axios.get(`${API_URL}/myActivity/userData`, {
                headers: {
                Authorization: accessToken,
                },
            });
            const data = response.data;
            setUserId(data.userId);
            setEmail(data.mail);
            setNickname(data.nickName);
            setPhoneNumber(data.phoneNumber);
            } catch (error) {
            console.error('내 정보 가져오기 실패', error);
            }
        };
        getProfile();
    });

    // 여기서 /auth/checkMail api호출

    // 저장 여기서 /myActivity/updateUser api호출
    const handleSave = () => {
        Alert.alert('Success', '수정된 정보가 저장되었습니다.');
    };

    // 취소 버튼 클릭
    const handleCancel = () => {
        Alert.alert('Cancelled', '수정이 취소되었습니다.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원 정보 수정</Text>

            {/* 닉네임 입력 */}
            <Text style={styles.label}>닉네임</Text>
            <TextInput
                style={styles.input}
                value={nickName}
                onChangeText={setNickname}
            />

            {/* 이메일 입력 */}
            <Text style={styles.label}>이메일</Text>
            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
            />

            {/* 아이디 (수정 불가) */}
            <Text style={styles.label}>아이디</Text>
            <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userId}
                editable={false}
            />

            {/* 비밀번호 입력 */}
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={true}
            />

            {/* 전화번호 입력 */}
            <Text style={styles.label}>전화번호</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>수정된 정보 저장</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#c78c30',
        padding: 10,
        marginBottom: 20,
        borderRadius: 22.375,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#c78c30',
        opacity: 0.7
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#c78c30',
        padding: 15,
        borderRadius: 22.375,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#c78c30',
        opacity: 0.6,
        padding: 15,
        borderRadius: 22.375,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
