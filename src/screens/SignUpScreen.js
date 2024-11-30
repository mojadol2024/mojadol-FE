import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { API_URL } from '@env';
import { generateRandomNickname } from '../utils/randomNick';

const SignUpScreen = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const [idValidationMessage, setIdValidationMessage] = useState('');
    const [idChecked, setIdChecked] = useState(false);
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [numLockOn, setNumLockOn] = useState(false);
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

    const validateId = (id) => /^[a-z0-9]+$/.test(id);

    const validatePassword = (password) => {
        const rules = {
            length: password.length >= 8,
            letter: /[a-zA-Z]/.test(password), // 대소문자 중 하나 포함
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

    const handleCheckId = async () => {
        setIdChecked(true);
        if (!validateId(userId)) {
            setIdValidationMessage('아이디는 소문자와 숫자만 사용할 수 있습니다.');
            setIsIdAvailable(false);
            return;
        }

        try {
            const response = await axios.get(`${API_URL}/auth/check-id`, { params: { userId } });
            if (response.data.available) {
                setIdValidationMessage('사용 가능한 아이디입니다.');
                setIsIdAvailable(true);
            } else {
                setIdValidationMessage('이미 사용 중인 아이디입니다.');
                setIsIdAvailable(false);
            }
        } catch (error) {
            setIdValidationMessage('아이디 확인 중 오류가 발생했습니다.');
            setIsIdAvailable(false);
        }
    };

    const handleSignUp = async () => {
        if (!idChecked) {
            Alert.alert('Error', '아이디를 체크하세요.');
            return;
        }
        if (!isIdAvailable) {
            Alert.alert('Error', '사용 불가능한 아이디입니다.');
            return;
        }
        if (!validatePassword(userPw)) {
            Alert.alert(
                'Error',
                '비밀번호는 최소 8자 이상이며, 대소문자 중 하나, 숫자, 특수문자를 포함해야 합니다.'
            );
            return;
        }
        if (!email.includes('@')) {
            Alert.alert('Error', '유효한 이메일을 입력하세요.');
            return;
        }
        if (!/^\d{10,11}$/.test(phoneNumber)) {
            Alert.alert('Error', '전화번호는 10~11자리 숫자만 가능합니다.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                userId,
                userPw,
                email,
                phoneNumber,
                nickname,
            });
            setResponseMessage(`회원가입 성공: ${response.data.message}`);
            Alert.alert('Success', '회원가입이 완료되었습니다.');
        } catch (error) {
            setResponseMessage('회원가입 중 오류가 발생했습니다.');
        }
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
                    onChangeText={(text) => {
                        setUserId(text);
                        setIsIdAvailable(null);
                        setIdChecked(false);
                    }}
                />
                <TouchableOpacity style={styles.checkIcon} onPress={handleCheckId}>
                    <Text style={{ color: isIdAvailable === true ? 'green' : isIdAvailable === false ? 'red' : 'gray' }}>
                        ✔️
                    </Text>
                </TouchableOpacity>

                {idValidationMessage && (
                    <Text style={isIdAvailable ? styles.successText : styles.errorText}>
                        {idValidationMessage}
                    </Text>
                )}
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
                <TextInput
                    style={styles.input}
                    placeholder="전화번호 (숫자만 입력)"
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="numeric"
                />
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
            {responseMessage && <Text style={styles.responseMessage}>{responseMessage}</Text>}
        </View>
    );
};

export default SignUpScreen;
