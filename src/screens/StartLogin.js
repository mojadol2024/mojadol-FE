import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import styles from '../components/StartLoginStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken, saveTokenToServer } from '../utils/FCMUtils';

const StartLogin = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleLogin = async () => {
        try {
            console.log(`${API_URL}`)
            const response = await axios.post(`${API_URL}/auth/login`, {
                userId: userId,
                userPw: userPw,
            });
            const accessToken = response.headers.get("accessToken");
            const userSeq = response.headers.get("userSeq");
            await AsyncStorage.setItem('accessToken', accessToken);
            await AsyncStorage.setItem('userSeq', userSeq);
            // 로그인 성공 후 FCM 토큰 저장
            const token = await getFCMToken();
            if (token) {
                saveTokenToServer(token, userId);
            }

            setResponseMessage(`Login successful: ${response.data.message}`);
            navigation.navigate('Board');
        } catch (error) {
            if (error.response) {
                setResponseMessage(`Login failed: ${error.response.data.error}`);
            } else {
                setResponseMessage('Error connecting to the server');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>로그인</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="ID"
                    value={userId}
                    onChangeText={setUserId}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={userPw}
                    onChangeText={setUserPw}
                    secureTextEntry
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>로그인</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('ForgetAccount')} style={styles.linkContainer}>
                <Text style={styles.linkText}>아이디 · 비밀번호 찾기</Text>
            </TouchableOpacity>
            {/* 하단 고정 텍스트 */}
            <Text style={styles.footerText}>MOJADOL</Text>
        </View>
    );
};

export default StartLogin;
