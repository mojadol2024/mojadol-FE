import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';

const EditProfileScreen = () => {
    const [nickName, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isPasswordVisible, setPasswordVisible] = useState(false); // 비밀번호 표시 상태
    const [initialData, setInitialData] = useState({}); // 초기 상태 저장
    const [isEmailAvailable, setIsEmailAvailable] = useState(null); // 이메일 중복 체크 상태
    const [emailError, setEmailError] = useState(''); // 이메일 유효성 오류 메시지
    const [passwordError, setPasswordError] = useState(''); // 비밀번호 유효성 오류 메시지
    const [phoneNumberError, setPhoneNumberError] = useState(''); // 전화번호 유효성 오류 메시지
    const [loading, setLoading] = useState(true);

    // 사용자 프로필 정보 가져오기
    useEffect(() => {
        const getProfile = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/myActivity/userData`, {
                    headers: { Authorization: accessToken },
                });
                const data = response.data;
                setUserId(data.userId);
                setEmail(data.mail);
                setNickname(data.nickName);
                setPhoneNumber(data.phoneNumber);
                setInitialData({
                    nickName: data.nickName,
                    email: data.mail,
                    phoneNumber: data.phoneNumber,
                });
            } catch (error) {
                console.error('내 정보 가져오기 실패', error);
            }
        };
        getProfile();
    }, []);

    // 이메일 유효성 검사
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!emailPattern.test(email)) {
            setEmailError('유효한 이메일을 입력해주세요.');
        } else {
            setEmailError('');
        }
    };

    // 비밀번호 유효성 검사
    const validatePassword = (password) => {
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError('비밀번호는 최소 8자 이상이며, 대소문자 중 하나, 숫자, 특수문자를 포함해야 합니다.');
        } else {
            setPasswordError('');
        }
    };

    // 전화번호 유효성 검사
    const validatePhoneNumber = (phoneNumber) => {
        const phonePattern = /^[0-9]{10,11}$/;
        if (!phonePattern.test(phoneNumber)) {
            setPhoneNumberError('전화번호는 10~11자리 숫자만 가능합니다.');
        } else {
            setPhoneNumberError('');
        }
    };

    // 이메일 중복 확인
    const checkEmailDuplicate = async () => {
        if (!email) return; // 이메일 입력이 없으면 중복 체크를 하지 않음
        try {
            const response = await axios.post(`${API_URL}/auth/checkMail`, { email });
            if (response.data.isDuplicate) {
                setIsEmailAvailable(false);
                Alert.alert('중복 확인', '이미 사용 중인 이메일입니다.');
            } else {
                setIsEmailAvailable(true);
                Alert.alert('중복 확인', '사용 가능한 이메일입니다.');
            }
        } catch (error) {
            console.error('이메일 중복 확인 실패', error);
        }
    };

    // 수정된 정보 저장
    const handleSave = async () => {
        const updatedFields = {};
        if (nickName !== initialData.nickName) updatedFields.nickName = nickName;
        if (email !== initialData.email) updatedFields.email = email;
        if (phoneNumber !== initialData.phoneNumber) updatedFields.phoneNumber = phoneNumber;
        if (password) updatedFields.password = password;
    
        // 변경된 내용이 없는 경우 처리
        if (Object.keys(updatedFields).length === 0) {
            Alert.alert('알림', '변경된 내용이 없습니다.');
            return;
        }

        if (emailError || passwordError || phoneNumberError) {
            Alert.alert('Error', '입력한 정보를 확인하세요.');
            return;
        }
    
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');
            await axios.put(`${API_URL}/myActivity/updateUser`, updatedFields, {
                headers: { Authorization: accessToken },
            });
            Alert.alert('Success', '수정된 정보가 저장되었습니다.');
        } catch (error) {
            console.error('정보 수정 실패', error);
            Alert.alert('Error', '정보 수정 중 오류가 발생했습니다.');
        }
    };

    // 취소 버튼 클릭
    const handleCancel = () => {
        setNickname(initialData.nickName);
        setEmail(initialData.email);
        setPhoneNumber(initialData.phoneNumber);
        setPassword('');
        Alert.alert('알림', '수정이 취소되었습니다.');
        }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원 정보 수정</Text>

            {/* 닉네임 입력 */}
            <Text style={styles.label}>닉네임</Text>
            <TextInput
                style={styles.input}
                value={nickName}
                onChangeText={setNickname}
            />

            {/* 이메일 입력 */}
            <Text style={styles.label}>이메일</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={email}
                    onChangeText={(value) => {
                        setEmail(value);  // 이메일 상태 업데이트
                        setIsEmailAvailable(null);  // 이메일 변경 시 중복 확인 상태 초기화
                        validateEmail(value);  // 이메일 유효성 검사
                    }}
                />
                <TouchableOpacity
                    style={styles.checkIcon}
                    onPress={checkEmailDuplicate}
                >
                    <Text style={{color: isEmailAvailable === true ? 'green' : isEmailAvailable === false ? 'red' : 'gray'}}>
                        ✔️
                    </Text>
                </TouchableOpacity>
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}          

            {/* 아이디 (수정 불가) */}
            <Text style={styles.label}>아이디</Text>
            <TextInput
                style={[styles.input, styles.disabledInput]}
                value={userId}
                editable={false}
            />

            {/* 비밀번호 입력 */}
            <Text style={styles.label}>비밀번호</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    value={password}
                    onChangeText={(value) => {
                        setPassword(value);
                        validatePassword(value);
                    }}
                    secureTextEntry={!isPasswordVisible}
                />
                <TouchableOpacity
                    style={styles.checkIcon}
                    onPress={() => setPasswordVisible(!isPasswordVisible)}
                >
                    <Text>
                        {isPasswordVisible ? '🙈' : '👁️'}
                    </Text>
                </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}

            {/* 전화번호 입력 */}
            <Text style={styles.label}>전화번호</Text>
            <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={(value) => {
                    setPhoneNumber(value);
                    validatePhoneNumber(value);
                }}
                keyboardType="phone-pad"
            />
            {phoneNumberError ? <Text style={styles.errorText}>{phoneNumberError}</Text> : null}

            {/* 버튼들 */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.buttonText}>수정된 정보 저장</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.buttonText}>취소</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#c78c30',
        padding: 10,
        marginBottom: 20,
        borderRadius: 22.375,
        backgroundColor: '#fff',
    },
    disabledInput: {
        backgroundColor: '#c78c30',
        opacity: 0.7
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#c78c30',
        padding: 15,
        borderRadius: 22.375,
        flex: 1,
        marginRight: 10,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#cccccc',
        padding: 15,
        borderRadius: 22.375,
        flex: 1,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkIcon: {
        marginLeft: 10,
        fontSize: 12,
        marginBottom: 20,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
});

export default EditProfileScreen;
