import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import axios from 'axios';
import { WebView } from 'react-native-webview';
import styles from '../components/LoginScreenStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
    const [responseMessage, setResponseMessage] = useState('');
    const [loginUrl, setLoginUrl] = useState(null);
    const [hasNavigated, setHasNavigated] = useState(false);
    const navigation = useNavigation();

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
                source={{ uri: loginUrl }}
                style={{ flex: 1 }}
                onNavigationStateChange={async (navState) => {
                    if (hasNavigated) return; // 중복 상태 변경 방지

                    console.log("URL:", navState.url);

                    const accessTokenMatch = navState.url.match(/accessToken=([^&]+)/);
                    const userSeqMatch = navState.url.match(/userSeq=([^&]+)/);

                    if (accessTokenMatch && userSeqMatch) {
                        const accessToken = accessTokenMatch[1];
                        const userSeq = userSeqMatch[1];

                        console.log("Access Token extracted:", accessToken);
                        console.log("UserSeq extracted:", userSeq);

                        await AsyncStorage.setItem('accessToken', `Bearer ${accessToken}`);
                        await AsyncStorage.setItem('userSeq', userSeq);

                        console.log("Access Token stored:", accessToken);

                        setHasNavigated(true); // 상태 변경 플래그 설정
                        setLoginUrl(null);
                        console.log("Navigating to home");
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
            </View>

            {/* 시작하기 버튼 */}
            <View style={styles.startButtonContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('StartLogin')} style={[styles.startButton, styles.customButton]}>
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
