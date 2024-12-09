import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Keyboard } from 'react-native';
import axios from 'axios';
import styles from '../components/ResetPasswordStyle';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { API_URL } from '@env';

const ResetPassword = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [mail, setMail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordMatchMessage, setPasswordMatchMessage] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(false);
    const [passwordRules, setPasswordRules] = useState({
        length: false,
        letter: false,
        number: false,
        specialChar: false,
    });
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false);
            }
        );
        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        const fetchUserIdAndMail = async () => {
            try {
                const id = await AsyncStorage.getItem('userId');
                const mailValue = await AsyncStorage.getItem('mail');
                if (id && mailValue) {
                    setUserId(id);
                    setMail(mailValue);
                } else {
                    const { userId: routeUserId, mail: routeMail } = route.params || {};
                    if (routeUserId && routeMail) {
                        setUserId(routeUserId);
                        setMail(routeMail);
                    } else {
                        Alert.alert('Error', '사용자 정보를 불러오는 데 실패했습니다.');
                        navigation.goBack();
                    }
                }
            } catch (error) {
                console.error('Failed to fetch userId and mail from storage:', error);
            }
        };
        fetchUserIdAndMail();
    }, []);

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

    const handleNewPasswordChange = (value) => {
        setNewPassword(value);
        validatePassword(value);
        if (value === confirmPassword) {
            setPasswordMatchMessage('비밀번호가 일치합니다.');
            setPasswordsMatch(true);
        } else {
            setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
            setPasswordsMatch(false);
        }
    };

    const handleConfirmPasswordChange = (value) => {
      setConfirmPassword(value);
      if (value.length === 0) {
        setPasswordMatchMessage('');
      } else if (newPassword === value) {
        setPasswordMatchMessage('비밀번호가 일치합니다.');
        setPasswordsMatch(true);
      } else {
        setPasswordMatchMessage('비밀번호가 일치하지 않습니다.');
        setPasswordsMatch(false);
      }
    };

    const handleResetPassword = async () => {
        if (newPassword === '' || confirmPassword === '') {
            Alert.alert('Error', '모든 필드를 입력하세요.');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', '비밀번호가 일치하지 않습니다.');
            return;
        }

        if (!validatePassword(newPassword)) {
            Alert.alert('Error', '비밀번호는 규칙을 충족해야 합니다.');
            return;
        }

        try {
            await axios.post(`${API_URL}/auth/updatePassword`, {
                userId: userId,
                mail: mail,
                userPw: newPassword,
            });
            Alert.alert('Success', '비밀번호가 성공적으로 변경되었습니다.');
            navigation.navigate('StartLogin');
        } catch (error) {
            Alert.alert('Error', '비밀번호 변경에 실패했습니다.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>비밀번호 재설정</Text>
            <TextInput
                style={styles.input}
                placeholder="새로운 비밀번호"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                autoCapitalize="none"
            />
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
                placeholder="비밀번호 확인"
                value={confirmPassword}
                onChangeText={handleConfirmPasswordChange}
                secureTextEntry
                autoCapitalize="none"
            />
            {/* 비밀번호 일치 여부 메시지 표시 */}
            <Text style={[styles.passwordMatchMessage, passwordsMatch ? styles.passwordMatch : styles.passwordMismatch]}>
                {passwordMatchMessage}
            </Text>

            <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
                <Text style={styles.buttonText}>비밀번호 재설정</Text>
            </TouchableOpacity>

            {/* 하단 고정된 MOJADOL 텍스트 */}
            {!isKeyboardVisible && (
                <View style={styles.footer}>
                    <Text style={styles.footerText}>MOJADOL</Text>
                </View>
            )}

        </View>
    );
};

export default ResetPassword;
