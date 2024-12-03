import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import CustomButton from '../components/CustomButton';
import styles from '../components/SignUpScreenStyle';
import axios from 'axios';
import { API_URL } from '@env';
import { generateRandomNickname } from '../utils/randomNick';

const SignUpScreen = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // CapsLock & NumLock 상태
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [numLockOn, setNumLockOn] = useState(false);

    // 아이디 및 이메일 체크 상태
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const [idChecked, setIdChecked] = useState(false);
    const [idRules, setIdRules] = useState({
        length: false,
        hasLetter: false,
        hasNumber: false,
    });

    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [emailChecked, setEmailChecked] = useState(false);

    const [passwordRules, setPasswordRules] = useState({
        length: false,
        letter: false,
        number: false,
        specialChar: false,
    });

    useEffect(() => {
        const randomNickname = generateRandomNickname();
        setNickname(randomNickname);
        setLoading(false);
    }, []);

    // 아이디 조건 확인
    const validateId = (id) => {
        const rules = {
            length: id.length >= 6,
            hasLetter: /[a-z]/.test(id),
            hasNumber: /\d/.test(id),
        };
        setIdRules(rules);
        return Object.values(rules).every((rule) => rule);
    };

    const handleCheckId = async () => {
        if (!validateId(userId)) {
            Alert.alert('Error', '아이디는 6자 이상, 영어와 숫자를 포함해야 합니다.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/check-id`, { params: { userId } });
            if (response.data === 'YES') {
                setIsIdAvailable(true);
                setIdChecked(true);
            } else {
                setIsIdAvailable(false);
                Alert.alert('Error', '중복된 아이디입니다.');
            }
        } catch (error) {
            Alert.alert('Error', '아이디 확인 중 오류가 발생했습니다.');
        }
    };

    // 이메일 형식 및 중복 체크
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const handleCheckEmail = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', '유효한 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/check-email`, { params: { email } });
            if (response.data === 'YES') {
                setIsEmailAvailable(true);
                setEmailChecked(true);
            } else {
                setIsEmailAvailable(false);
                Alert.alert('Error', '중복된 이메일입니다.');
            }
        } catch (error) {
            Alert.alert('Error', '이메일 확인 중 오류가 발생했습니다.');
        }
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password) => {
        const rules = {
            length: password.length >= 8,
            letter: /[a-zA-Z]/.test(password),
            number: /\d/.test(password),
            specialChar: /[@$!%*?&]/.test(password),
        };
        setPasswordRules(rules);
        return Object.values(rules).every((rule) => rule);
    };

    const handlePasswordInput = (text) => {
        setUserPw(text);
        validatePassword(text);
        setCapsLockOn(/[A-Z]/.test(text) && !/[a-z]/.test(text)); // Caps Lock 상태 감지
        setNumLockOn(/\d/.test(text)); // Num Lock 상태 감지
    };

    // 회원가입 처리
    const handleSignUp = async () => {
        if (!idChecked || !isIdAvailable) {
            Alert.alert('Error', '아이디 중복 확인을 진행해주세요.');
            return;
        }
        if (!emailChecked || !isEmailAvailable) {
            Alert.alert('Error', '이메일 중복 확인을 진행해주세요.');
            return;
        }
        if (!/^\d{10,11}$/.test(phoneNumber)) {
            Alert.alert('Error', '전화번호는 10~11자리 숫자만 가능합니다.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/addUser`, {
                userId,
                userPw,
                email,
                phoneNumber,
                nickname,
            });

            if (response.data === 'YES') {
                Alert.alert('Success', '회원가입이 완료되었습니다.');
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', '회원가입에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            Alert.alert('Error', '서버와 연결할 수 없습니다.');
        }
    };

    // 로딩 상태
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <Text style={styles.title}>회원가입</Text>
                    <View style={styles.inputContainer}>
                        {/* 아이디 입력 */}
                        <View style={styles.idContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="ID"
                                value={userId}
                                onChangeText={(text) => {
                                    setUserId(text);
                                    setIsIdAvailable(null);
                                    setIdChecked(false);
                                    validateId(text);
                                }}
                            />
                            <TouchableOpacity style={styles.checkIcon} onPress={handleCheckId}>
                                <Text style={{ color: isIdAvailable ? 'green' : isIdAvailable === false ? 'red' : 'gray' }}>✔️</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.idRulesContainer}>
                            <Text style={[
                                styles.ruleText, idRules.length && idRules.hasLetter && idRules.hasNumber ? styles.valid : styles.invalid]}>
                                • 최소 6자 이상, 영어와 숫자를 포함해야 합니다.
                            </Text>
                        </View>

                        {/* 비밀번호 입력 */}
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Password"
                                value={userPw}
                                onChangeText={handlePasswordInput}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text>{showPassword ? '🙈' : '👁️'}</Text>
                            </TouchableOpacity>
                        </View>

                        {capsLockOn && <Text style={styles.warningText}>Caps Lock이 켜져 있습니다.</Text>}
                        {numLockOn && <Text style={styles.warningText}>Num Lock이 켜져 있습니다.</Text>}
                        <View style={styles.passwordRules}>
                            <Text style={[styles.ruleText, passwordRules.length ? styles.valid : styles.invalid]}>
                                • 최소 8자 이상
                            </Text>
                            <Text style={[styles.ruleText, passwordRules.letter ? styles.valid : styles.invalid]}>
                                • 대소문자 중 하나 포함
                            </Text>
                            <Text style={[styles.ruleText, passwordRules.number ? styles.valid : styles.invalid]}>
                                • 숫자 1자 이상
                            </Text>
                            <Text style={[styles.ruleText, passwordRules.specialChar ? styles.valid : styles.invalid]}>
                                • 특수문자 1자 이상
                            </Text>
                        </View>

                        {/* 이메일 입력 */}
                        <View style={styles.emailContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setIsEmailAvailable(null);
                                    setEmailChecked(false);
                                }}
                            />
                            <TouchableOpacity style={styles.checkIcon} onPress={handleCheckEmail}>
                                <Text style={{ color: isEmailAvailable ? 'green' : isEmailAvailable === false ? 'red' : 'gray' }}>✔️</Text>
                            </TouchableOpacity>
                        </View>

                        {/* 전화번호 입력 */}
                        <TextInput
                            style={styles.input}
                            placeholder="전화번호 (숫자만 입력)"
                            value={phoneNumber}
                            onChangeText={setPhoneNumber}
                            keyboardType="numeric"
                        />
                        <View style={styles.nicknameContainer}>
                            <TextInput
                                style={[styles.input, styles.nicknameInput]}
                                value={nickname}
                                editable={false}
                            />
                            <TouchableOpacity
                                style={styles.nicknameRefreshButton}
                                onPress={() => setNickname(generateRandomNickname())}
                            >
                                <Text style={styles.nicknameRefreshText}>🔄</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <CustomButton
                        title="회원가입"
                        onPress={handleSignUp}
                        disabled={!idChecked || !isIdAvailable || !Object.values(passwordRules).every((rule) => rule)}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default SignUpScreen;