import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { API_URL } from '@env';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken, saveTokenToServer } from '../utils/FCMUtils';

const StartLogin = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    
    const handleLogin = async () => {
        try {
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
                // 서버에 토큰 저장 (userId는 로그인 후에 얻은 값으로 사용)
                console.log(token);
                saveTokenToServer(token, userId);  // 여기서 userId를 서버로 보냄
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

    useEffect(() => {
        console.log(`${API_URL}`);
    });
        

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
            <CustomButton title="로그인" onPress={handleLogin} />
            <TouchableOpacity onPress={() => navigation.navigate('ForgetAccount')} style={styles.linkContainer}>
                <Text style={styles.linkText}>아이디 · 비밀번호 찾기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    linkContainer: {
        marginTop: 10,
    },
    linkText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});

export default StartLogin;