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
    const [responseMessage, setResponseMessage] = useState('');
    const [loginUrl, setLoginUrl] = useState(null);

    const handleStart = async () => {
        // 시작하기 버튼 클릭 시 처리할 로직을 작성합니다.
        console.log('시작하기 버튼 클릭됨');
        navigation.navigate('StartLogin');
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

    useEffect(() => {
        if (loginUrl) {
            // When login URL changes, handle redirection logic
        }
    }, [loginUrl]);

    if (loginUrl) {
        return (
            <WebView
                source={{ uri: loginUrl, headers: {} }}
                style={{ flex: 1 }}
                onNavigationStateChange={async (navState) => {
                    const accessTokenMatch = navState.url.match(/accessToken=([^&]+)/);
                    if (accessTokenMatch && navState.canGoBack === true) {
                        const accessToken = accessTokenMatch[1];
                        await AsyncStorage.setItem("accessToken", accessToken);

                        setLoginUrl(null);
                        navigation.navigate('Board');
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
                <Text style={styles.subtitle}>당신의 소중한 반려견을 찾아드리는{`\n`}
                    <Text style={styles.highlightedText}>'추견 60분'</Text>
                </Text>
            </View>

            {/* 시작하기 버튼 */}
            <View style={styles.startButtonContainer}>
                <TouchableOpacity onPress={handleStart} style={[styles.startButton, styles.customButton]}>
                    <Text style={styles.startButtonText}>시작하기</Text>
                </TouchableOpacity>
            </View>

            {/* 카카오 로그인 버튼 */}
            <View style={styles.kakaoButtonContainer}>
                <TouchableOpacity onPress={handleKakaoLogin} style={[styles.kakaoButton, styles.customButton]}>
                    <Image source={require('../assets/kakao_icon.png')} style={styles.kakaoIcon} />
                    <Text style={styles.kakaoButtonText}>카카오로 로그인</Text>
                </TouchableOpacity>
            </View>

            {/* 회원가입 링크 */}
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
                <Text style={styles.signUpLinkText}>계정이 없으신가요?{' '}
                    <Text style={styles.signUpLinkTextUnderLine}>회원가입</Text>
                </Text>
            </TouchableOpacity>

        </View>
    );
};

export default LoginScreen;
