import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import styles from '../components/LoginScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken, saveTokenToServer } from '../utils/FCMUtils';
import { API_URL } from '@env';
const LoginScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [loginUrl, setLoginUrl] = useState(null);

    const handleLogin = async () => {
        try {
            const response = await axios.post(`${API_URL}/auth/login`, {
                userId: userId,
                userPw: userPw,
            });
            const accessToken = response.headers.get("accessToken");
            await AsyncStorage.setItem('accessToken', accessToken);
            // 로그인 성공 후 FCM 토큰 저장
            const token = await getFCMToken();
            if (token) {
                // 서버에 토큰 저장 (userId는 로그인 후에 얻은 값으로 사용)
                console.log(token);
                saveTokenToServer(token, userId);  // 여기서 userId를 서버로 보냄
            }

            setResponseMessage(`Login successful: ${response.data.message}`);
            console.log("navigating to home");
            navigation.navigate('Home');
        } catch (error) {
            if (error.response) {
                setResponseMessage(`Login failed: ${error.response.data.error}`);
            } else {
                setResponseMessage('Error connecting to the server');
            }
        }
    };

    const handleKakaoLogin = async () => {
        try {
            const response = await axios.get(`${API_URL}/auth/kakao/login`);
            if (response.data.location) {
                setLoginUrl(response.data.location);
            } else {
                Alert.alert('Error', 'Invalid login URL');
            }
        } catch (error) {
            console.error('Kakao login error:', error);
            Alert.alert('Error', 'Kakao login failed.');
        }
    };

    if (loginUrl) {
        return (
            <WebView
                source={{ uri: loginUrl, headers: {} }}
                style={{ flex: 1 }}
                onNavigationStateChange={async (navState) => {
                    console.log("URL:", navState.url);
                    console.log("Headers:", navState.headers);

                    const accessTokenMatch = navState.url.match(/accessToken=([^&]+)/);
                    if (accessTokenMatch && navState.canGoBack === true) {
                        const accessToken = accessTokenMatch[1];
                        console.log("Access Token extracted:", accessToken);
                        await AsyncStorage.setItem("accessToken", accessToken);
                        console.log("Access Token stored:", accessToken);

                        setLoginUrl(null);
                        console.log("Navigating to home");
                        navigation.navigate('Home');
                    }
                }}
            />
        );
    }

    return (
            <View style={styles.container}>
                {/* 로고 및 설명 */}
                <View style={styles.logoContainer}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <Text style={styles.subtitle}>당신 근처의 실종된 반려견을 찾아드리는 '추견 60분'</Text>
                </View>

                {/* 시작하기 버튼 */}
                <View style={styles.startButtonContainer}>
                    <TouchableOpacity onPress={handleStart} style={styles.startButton}>
                        <Text style={styles.startButtonText}>시작하기</Text>
                    </TouchableOpacity>
                </View>

                {/* 카카오 로그인 버튼 */}
                <TouchableOpacity onPress={handleKakaoLogin} style={styles.kakaoButton}>
                    <Image
                        source={require('../assets/kakao_login_medium_narrow.png')}
                        style={styles.kakaoImage}
                    />
                    <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
                </TouchableOpacity>
            </View>
        );

        return (
                <View style={styles.container}>
                    <Text style={styles.title}>Login</Text>
                    <CustomInput
                        placeholder="ID"
                        value={userId}
                        onChangeText={setUserId}
                    />
                    <CustomInput
                        placeholder="Password"
                        value={userPw}
                        onChangeText={setUserPw}
                        secureTextEntry
                    />
                    <CustomButton title="Login" onPress={handleLogin} />
                    {responseMessage && <Text>{responseMessage}</Text>}

                    <TouchableOpacity onPress={handleKakaoLogin} style={styles.kakaoButton}>
                        <Image
                            source={require('../assets/kakao_login_medium_narrow.png')}
                            style={styles.kakaoImage}
                        />
                    </TouchableOpacity>
                </View>
            );
        };
};



export default LoginScreen;