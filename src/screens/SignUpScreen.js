import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, TextInput, Image } from 'react-native';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { API_URL } from '@env';
import { generateRandomNickname } from '../utils/randomNick';

const SignUpScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [email, setEmail] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true); // 로딩 상태 추가
    const [showPassword, setShowPassword] = useState(false); // 비밀번호 보이기/숨기기 추가
    const [capsLockOn, setCapsLockOn] = useState(false); // Caps Lock 상태
    const [numLockOn, setNumLockOn] = useState(false); // Num Lock 상태

    // 닉네임 자동 생성 요청
    useEffect(() => {
        const randomNickname = generateRandomNickname();
        setNickname(randomNickname);
        setLoading(false);
    }, []);

    const handleSignUp = async () => {
        if (!email.includes('@')) {
            Alert.alert('Error', 'Email must contain an @ symbol');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Please enter a valid email address');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                userId: userId,
                userPw: userPw,
                email: email,
                nickname: nickname, // 자동 생성된 닉네임 추가
            });
            setResponseMessage(`Sign-up successful: ${response.data.message}`);
            console.log('Navigating to login');
            navigation.navigate('Login');
        } catch (error) {
            if (error.response) {
                setResponseMessage(`Sign-up failed: ${error.response.data.error}`);
            } else {
                setResponseMessage('Error connecting to the server');
            }
        }
    };

    const handlePasswordInput = (text) => {
        setUserPw(text);
        setCapsLockOn(/[A-Z]/.test(text) && !/[a-z]/.test(text));
        setNumLockOn(/\d/.test(text));
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원가입</Text>
            <Text style={styles.subtitle}>프로필을 설정해주세요</Text>
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
                    onChangeText={handlePasswordInput}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                    <Text>{showPassword ? '🙈' : '👁️'}</Text>
                </TouchableOpacity>
                {capsLockOn && (
                    <Text style={styles.warningText}>Caps Lock is on</Text>
                )}
                {numLockOn && (
                    <Text style={styles.warningText}>Num Lock is on</Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />
                <View style={styles.nicknameContainer}>
                    <TextInput
                        style={[styles.input, styles.nicknameInput]}
                        value={nickname}
                        editable={false}
                    />
                    <TouchableOpacity style={styles.nicknameRefreshButton} onPress={() => setNickname(generateRandomNickname())}>
                        <Text style={styles.nicknameRefreshText}>🔄</Text>
                    </TouchableOpacity>
                </View>
            </View>
            <CustomButton title="회원가입" onPress={handleSignUp} />
            {responseMessage && <Text style={styles.responseMessage}>{responseMessage}</Text>}
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                <Text style={styles.loginText}>이미 계정이 있나요?{' '}
                    <Text style={styles.loginTextUnderLine}>로그인</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        marginBottom: 20,
        textAlign: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
        position: 'relative',
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    nicknameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nicknameInput: {
        flex: 1,
    },
    nicknameRefreshButton: {
        marginLeft: 10,
    },
    nicknameRefreshText: {
        fontSize: 20,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: 90,
    },
    warningText: {
        color: 'orange',
        fontSize: 14,
        marginBottom: 5,
    },
    responseMessage: {
        color: 'red',
        marginBottom: 10,
    },
    loginLink: {
        marginTop: 15,
    },
    loginText: {
        color: '#666666',
        fontSize: 16,
    },
    loginTextUnderLine: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
