import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';
import styles from '../components/StartLoginStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken, saveTokenToServer } from '../utils/FCMUtils';

const StartLogin = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const passwordRef = useRef();
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const handleLogin = async () => {
        if (userId.trim() === '' || userPw.trim() === '') {
            Alert.alert('Error', '아이디 및 비밀번호를 다시 확인해주세요.');
            return;
        }

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
                saveTokenToServer(token, userId);
            }

            setResponseMessage(`Login successful: ${response.data.message}`);
            navigation.navigate('Board');
        } catch (error) {
            if (error.response) {
                Alert.alert('Error', '아이디 및 비밀번호를 다시 확인해주세요.');
            } else {
                Alert.alert('Error', '서버에 연결할 수 없습니다.');
            }
        }
    };

    useEffect(() => {
        console.log(`${API_URL}`);
    });

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <View style={styles.container}>
                <Text style={styles.title}>로그인</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="아이디"
                        value={userId}
                        onChangeText={setUserId}
                        autoCapitalize="none"
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            if (passwordRef.current) {
                                passwordRef.current.focus(); // 포커스를 비밀번호 입력으로 이동
                            }
                        }}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호"
                        value={userPw}
                        onChangeText={setUserPw}
                        autoCapitalize="none"
                        secureTextEntry
                        ref={passwordRef}
                        returnKeyType="done"
                        onSubmitEditing={handleLogin}
                    />
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>로그인</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgetAccount')} style={styles.linkContainer}>
                    <Text style={styles.linkText}>아이디 · 비밀번호 찾기</Text>
                </TouchableOpacity>

                {/* 하단 고정된 MOJADOL 텍스트 */}
                {!isKeyboardVisible && (
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>MOJADOL</Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default StartLogin;