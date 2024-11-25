// StartLogin.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { API_URL } from '@env';

const StartLogin = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');

    const handleLogin = async () => {
        if (!userId || !userPw) {
            Alert.alert('Error', 'Please enter both ID and Password.');
            return;
        }
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                userId: userId,
                userPw: userPw,
            });
            Alert.alert('Success', `Welcome, ${userId}!`);
            navigation.navigate('Home'); // 로그인 성공 후 홈 화면으로 이동
        } catch (error) {
            if (error.response) {
                Alert.alert('Login failed', error.response.data.error);
            } else {
                Alert.alert('Error', 'Unable to connect to the server');
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