import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import CustomButton from '../components/CustomButton';
import styles from '../components/SignUpScreenStyle';
import TermsAgreement from '../screens/TermsAgreement';
import axios from 'axios';
import { API_URL } from '@env';
import { generateRandomNickname } from '../utils/randomNick';
import { useNavigation } from '@react-navigation/native';

const SignUpScreen = () => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [isAgreementChecked, setIsAgreementChecked] = useState(false);

    // CapsLock & NumLock 상태
    const [capsLockOn, setCapsLockOn] = useState(false);
    const [numLockOn, setNumLockOn] = useState(false);

    // 아이디 및 이메일 체크 상태
    const [isIdAvailable, setIsIdAvailable] = useState(null);
    const [idChecked, setIdChecked] = useState(false);
    const [idValidationMessage, setIdValidationMessage] = useState('');
    const [idRules, setIdRules] = useState({
        length: false,
        hasLetter: false,
        hasNumber: false,
    });

    const [isEmailAvailable, setIsEmailAvailable] = useState(null);
    const [emailChecked, setEmailChecked] = useState(false);
    const [emailValidationMessage, setEmailValidationMessage] = useState('');
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        letter: false,
        number: false,
        specialChar: false,
    });
    const userNameRef = useRef(null);
    const userIdRef = useRef();
    const passwordRef = useRef();
    const emailRef = useRef();
    const phoneNumberRef = useRef();

    const navigation = useNavigation();

    useEffect(() => {
        const randomNickname = generateRandomNickname();
        setNickname(randomNickname);
        setLoading(false);
    }, []);

    // 이름 유효성 검사
    const validateUserName = (name) => {
        // 이름은 영어와 한글만 허용, 한글은 최소 2자 이상
        return /^[a-zA-Z가-힣]+$/.test(name) && (!/[가-힣]/.test(name) || name.length >= 2);
    };

    // 아이디 조건 확인
    const validateId = (id) => {
        const rules = {
            length: id.length >= 6,
            hasLetter: /[a-z]/.test(id), // 소문자 허용
            hasNumber: /\d/.test(id), // 숫자 허용
        };
        setIdRules(rules);
        const isValid = Object.values(rules).every((rule) => rule);

        // 유효성 메시지 및 상태 업데이트
        if (isValid) {
            setIdValidationMessage('사용 가능한 아이디입니다.');
            setIsIdAvailable(true);
        } else {
            setIdValidationMessage('• 최소 6자 이상, 영어와 숫자를 포함해야 합니다.');
            setIsIdAvailable(false);
        }

        return isValid;
    };

    const handleCheckId = async () => {
        if (!validateId(userId)) {
            Alert.alert('Error', '아이디는 6자 이상, 영어와 숫자를 포함해야 합니다.');
            setIsIdAvailable(false);

            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/checkId`, { userId : userId });
            if (response.data === 'YES') {
                setIdValidationMessage('사용 가능한 아이디입니다.');
                setIsIdAvailable(true);
                setIdChecked(true);

            } else {
                setIsIdAvailable(false);
                Alert.alert('Error', '중복된 아이디입니다.');
            }
        } catch (error) {
            Alert.alert('Error', '아이디 확인 중 오류가 발생했습니다.');
            setIsIdAvailable(false);
        }
    };

    // 이메일 형식 및 중복 체크
    const validateEmail = (email) => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isValid) {
            setEmailValidationMessage('유효한 이메일 형식을 입력해주세요.');
            setIsEmailAvailable(false);
        } else {
            setEmailValidationMessage('');
        }
        return isValid;
    };

    const handleCheckEmail = async () => {
        if (!validateEmail(email)) {
            Alert.alert('Error', '유효한 이메일 형식을 입력해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/checkMail`, { mail : email  });
            console.log(response.data);
            if (response.data === 'YES') {
                setEmailValidationMessage('사용 가능한 이메일입니다.');
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
        if (!validateUserName(userName)) {
            Alert.alert('Error', '이름을 다시 확인해주세요.');
            return;
        }

        if (!idChecked || !isIdAvailable) {
            Alert.alert('Error', '아이디 중복 확인을 진행해주세요.');
            return;
        }
        if (!emailChecked || !isEmailAvailable) {
            Alert.alert('Error', '이메일 중복 확인을 진행해주세요.');
            return;
        }

        if (!Object.values(passwordRules).every((rule) => rule)) {
            Alert.alert('Error', '올바른 비밀번호 양식을 맞춰주세요.');
            return;
        }

        if (!/^\d{11}$/.test(phoneNumber)) {
            Alert.alert('Error', '전화번호는 11자리 숫자만 가능합니다.');
            return;
        }

        if (!isAgreementChecked) {
            Alert.alert('Error', '약관 동의서를 진행해주세요.');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/addUser`, {
                userName : userName,
                userId : userId,
                userPw : userPw,
                mail : email,
                phoneNumber : phoneNumber,
                nickName : nickname,
            });

            if (response.data === 'YES') {
                Alert.alert('Success', '회원가입이 완료되었습니다.');
                navigation.navigate('LoginScreen');
            } else {
                Alert.alert('Error', '회원가입에 실패했습니다. 다시 시도해주세요.');
                console.log("회원가입 데이터:", { userId, userPw, email, phoneNumber, nickname });

            }
        } catch (error) {
            Alert.alert('Error', '서버와 연결할 수 없습니다.');
        }
    };

    // 로딩 상태

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <ActivityIndicator size="large" color="#007BFF" />
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#ffffff' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                        <Text style={styles.title}>회원가입</Text>
                        <View style={styles.inputContainer}>
                            {/* 사용자 이름 입력 */}
                            <View style={styles.userNameContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="이름"
                                    value={userName}
                                    onChangeText={(text) => setUserName(text)}
                                    keyboardType="default"
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    ref={userNameRef}
                                    onSubmitEditing={() => {
                                        if (userIdRef.current) {
                                            userIdRef.current.focus(); // 아이디 입력 필드로 포커스 이동
                                        }
                                    }}
                                />
                            </View>
                            {/* 아이디 입력 */}
                            <View style={styles.idContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="아이디"
                                    value={userId}
                                    onChangeText={(text) => {
                                        setUserId(text);
                                        setIsIdAvailable(null);
                                        setIdChecked(false);
                                        validateId(text);
                                        setIdValidationMessage('• 최소 6자 이상, 영어와 숫자를 포함해야 합니다.');
                                    }}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    ref={userIdRef}
                                    onSubmitEditing={() => {
                                        if (passwordRef.current) {
                                            passwordRef.current.focus(); // 비밀번호 입력 필드로 포커스 이동
                                        }
                                    }}
                                />
                                <TouchableOpacity style={styles.checkIcon} onPress={handleCheckId}>
                                    <Text style={{ color: isIdAvailable ? 'green' : isIdAvailable === false ? 'red' : 'gray' }}>✔️</Text>
                                </TouchableOpacity>
                            </View>
                            {/* 유효성 메시지 표시 */}
                            <View style={styles.idRulesContainer}>
                                {idValidationMessage && (
                                    <Text style={[styles.ruleText, styles[isIdAvailable ? 'valid' : isIdAvailable === false ? 'invalid' : 'neutral']]}>
                                        {idValidationMessage}
                                    </Text>
                                )}
                            </View>

                            {/* 비밀번호 입력 */}
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="비밀번호"
                                    value={userPw}
                                    onChangeText={handlePasswordInput}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    ref={passwordRef}
                                    onSubmitEditing={() => {
                                        if (emailRef.current) {
                                            emailRef.current.focus(); // 이메일 입력 필드로 포커스 이동
                                        }
                                    }}
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
                                    placeholder="이메일"
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                        setIsEmailAvailable(null);
                                        setEmailChecked(false);
                                        validateEmail(text);
                                    }}
                                    autoCapitalize="none"
                                    returnKeyType="next"
                                    ref={emailRef}
                                    onSubmitEditing={() => {
                                        if (phoneNumberRef.current) {
                                            phoneNumberRef.current.focus(); // 전화번호 입력 필드로 포커스 이동
                                        }
                                    }}
                                />
                                <TouchableOpacity style={styles.checkIcon} onPress={handleCheckEmail}>
                                    <Text style={{ color: isEmailAvailable ? 'green' : isEmailAvailable === false ? 'red' : 'gray' }}>✔️</Text>
                                </TouchableOpacity>
                            </View>
                            {/* 유효성 메시지 표시 */}
                            <View style={styles.emailRulesContainer}>
                                {emailValidationMessage && (
                                    <Text style={[styles.ruleText, styles[isEmailAvailable ? 'valid' : isEmailAvailable === false ? 'invalid' : 'neutral']]}>
                                        {emailValidationMessage}
                                    </Text>
                                )}
                            </View>

                            {/* 전화번호 입력 */}
                            <TextInput
                                style={styles.input}
                                placeholder="전화번호 (숫자만 입력)"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="numeric"
                                ref={phoneNumberRef}
                                returnKeyType="done"
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
                            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 10 }}>
                              <TouchableOpacity
                                onPress={() =>
                                  navigation.navigate('TermsAgreement', {
                                    setAgreementChecked: setIsAgreementChecked, // 약관 동의 상태 업데이트 함수 전달
                                  })
                                }
                              >
                                <Text style={{ textDecorationLine: 'underline', color: '#007BFF' }}>
                                  약관 동의서 보기
                                </Text>
                              </TouchableOpacity>
                              <Text style={{ marginLeft: 10, textAlign: 'center' }}>
                                {isAgreementChecked ? '✔️' : '⬜️'} {/* 동의 여부에 따라 UI 업데이트 */}
                              </Text>
                            </View>
                            <CustomButton
                                title="회원가입"
                                onPress={handleSignUp}
                                disabled={!idChecked || !isIdAvailable || !emailChecked || !isEmailAvailable || !Object.values(passwordRules).every((rule) => rule) || !isAgreementChecked}
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};
export default SignUpScreen;