import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ForgetAccount = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('findId'); // 'findId' or 'findPw'
    const [emailValue, setEmailValue] = useState('');
    const [idValue, setIdValue] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [isCodeSent, setIsCodeSent] = useState(false); // 확인 코드 전송 여부
    const [isCodeVerified, setIsCodeVerified] = useState(false); // 확인 코드 인증 여부
    const [countdown, setCountdown] = useState(0);
    const [resendAvailable, setResendAvailable] = useState(false);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && !resendAvailable) {
            setResendAvailable(true);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleSendVerificationCode = async () => {
        if (!emailValue) {
            Alert.alert('Error', '이메일 주소를 입력하세요.');
            return;
        }
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(emailValue)) {
            Alert.alert('Error', '유효한 이메일 주소를 입력하세요.');
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/send-code`, {
                email: emailValue,
            });
            setIsCodeSent(true);
            setCountdown(300); // 5분 타이머 시작
            setResendAvailable(false);
            Alert.alert('Success', '확인 코드가 이메일로 전송되었습니다.');
        } catch (error) {
            Alert.alert('Error', '확인 코드 전송에 실패했습니다.');
        }
    };

    const handleVerifyCode = async () => {
        if (!verificationCode) {
            Alert.alert('Error', '확인 코드를 입력하세요.');
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/verify-code`, {
                email: emailValue,
                code: verificationCode,
            });
            setIsCodeVerified(true);
            Alert.alert('Success', '확인 코드가 인증되었습니다.');
        } catch (error) {
            Alert.alert('Error', '확인 코드가 유효하지 않습니다.');
        }
    };

    const handleResetPassword = async () => {
        if (!isCodeVerified) {
            Alert.alert('Error', '확인 코드를 인증해야 합니다.');
            return;
        }

        try {
            Alert.alert('Success', '비밀번호 재설정을 위한 링크가 이메일로 전송되었습니다.');
        } catch (error) {
            Alert.alert('Error', '비밀번호 재설정 요청에 실패했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>아이디 · 비밀번호 찾기</Text>
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'findId' && styles.activeTab]}
                    onPress={() => setSelectedTab('findId')}
                >
                    <Text style={selectedTab === 'findId' ? styles.activeTabText : styles.tabText}>
                        아이디 찾기
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'findPw' && styles.activeTab]}
                    onPress={() => setSelectedTab('findPw')}
                >
                    <Text style={selectedTab === 'findPw' ? styles.activeTabText : styles.tabText}>
                        비밀번호 찾기
                    </Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'findId' ? (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="가입한 이메일 주소"
                        value={emailValue}
                        onChangeText={setEmailValue}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
                        <Text style={styles.buttonText}>아이디 찾기</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="가입한 아이디"
                        value={idValue}
                        onChangeText={setIdValue}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="가입한 이메일 주소"
                        value={emailValue}
                        onChangeText={setEmailValue}
                        keyboardType="email-address"
                    />
                    {!isCodeSent ? (
                        <TouchableOpacity style={styles.button} onPress={handleSendVerificationCode}>
                            <Text style={styles.buttonText}>비밀번호 찾기</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                            <TextInput
                                style={styles.input}
                                placeholder="이메일로 받은 확인 코드"
                                value={verificationCode}
                                onChangeText={setVerificationCode}
                            />
                            <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
                                <Text style={styles.buttonText}>확인 코드 인증</Text>
                            </TouchableOpacity>
                            {isCodeVerified && (
                                <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                                    <Text style={styles.buttonText}>비밀번호 재설정</Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </>
            )}

            <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
                <Text style={styles.exitButtonText}>뒤로가기</Text>
            </TouchableOpacity>

            {/* 하단 고정된 MOJADOL 텍스트 */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>MOJADOL</Text>
            </View>
        </View>
    );
};

export default ForgetAccount;
