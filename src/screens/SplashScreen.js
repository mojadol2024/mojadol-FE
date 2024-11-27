import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
    const scaleValue = new Animated.Value(0);

    useEffect(() => {
        // 로고 확대 애니메이션 시작
        Animated.timing(scaleValue, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start(() => {
            // 애니메이션이 끝나면 로그인 화면으로 이동
            setTimeout(() => {
                navigation.replace('LoginScreen');
            }, 500); // 0.5초 대기 후 이동
        });
    }, []);

    return (
        <View style={styles.container}>
            <Animated.Image
                source={require('../assets/logo.png')}  // 추가한 이미지 경로
                style={[styles.logoImage, { transform: [{ scale: scaleValue }] }]}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#C78C30',
        paddingTop: 120, // 위쪽 여백을 추가해 로고를 더 위로 이동
    },
    logoImage: {
        width: 300,
        height: 300,
    },
});

export default SplashScreen;
