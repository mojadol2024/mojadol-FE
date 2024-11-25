import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Linking, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { WebView } from 'react-native-webview';
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

                    const accessTokenMatch = navState.url.match(/accessToken=([^&]+)/);
                    const userSeqMatch = navState.url.match(/userSeq=([^&]+)/);
                    console.log("UserId:", userSeqMatch)
                    if (accessTokenMatch && userSeqMatch && navState.canGoBack === true) {
                        const accessToken = accessTokenMatch[1];
                        const userSeq = userSeqMatch[1];

                        console.log("Access Token extracted:", accessToken);
                        console.log("userSeq extracted:", userSeq);

                        await AsyncStorage.setItem('accessToken', "Bearer "+accessToken);
                        await AsyncStorage.setItem('userSeq', userSeq);

                        console.log("Access Token stored:", accessToken);

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
        marginBottom: 20,
        textAlign: 'center',
    },
    kakaoButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    kakaoImage: {
        width: 250,
        height: 50,
        borderRadius: 22.375,
    },
});

export default LoginScreen;
