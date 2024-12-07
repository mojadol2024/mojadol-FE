import React, { useState, useEffect } from 'react'; 
import {ScrollView, View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

const EditProfileScreen = () => {
    const navigation = useNavigation(); // 네비게이션 객체 가져오기
    const [userName, setUserName] = useState('');
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
    const [nickNameError, setNickNameError] = useState('');
    const [isEmailChecked, setIsEmailChecked] = useState(false); // 이메일 중복 확인 했는지 확인
    const [loading, setLoading] = useState(true);

    // 사용자 프로필 정보 가져오기
    useEffect(() => {
        const getProfile = async () => {
            setLoading(true);
            try {
                const accessToken = await AsyncStorage.getItem('accessToken');
                const response = await axios.get(`${API_URL}/myActivity/userData`, {
                    headers: { Authorization: accessToken },
                });
                const data = response.data;
                setUserName(data.userName);
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
                Alert.alert('Error', '정보를 가져오는데 실패했습니다.');
            } finally {
                setLoading(false);
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
        const passwordPattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordPattern.test(password)) {
            setPasswordError('비밀번호는 최소 8자 이상이며, 대문자 또는 소문자 중 하나, 숫자, 특수문자를 포함해야 합니다.');
        } else {
            setPasswordError(''); 
        }
    };
    
    // 닉네임 유효성 검사
    const validateNickname = (nickname) => {
        const nicknamePattern = /^(?!\d+$)(?!.*\s)([a-zA-Z가-힣0-9]{2,})$/;
        if (!nicknamePattern.test(nickname)) {
            setNickNameError('닉네임은 2자 이상, 숫자, 영어, 한글만 가능합니다.');
        } else {
            setNickNameError('');
        }
    };


    // 이메일 중복 확인
    const checkEmailDuplicate = async () => {
        if (!email) return; // 이메일 입력이 없으면 중복 체크를 하지 않음
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/auth/checkMail`, { email });
            if (response.data.isDuplicate) {
                setIsEmailAvailable(false);
                Alert.alert('중복 확인', '이미 사용 중인 이메일입니다.');
            } else {
                setIsEmailAvailable(true);
                setIsEmailChecked(true); // 이메일 중복 확인 완료
                Alert.alert('중복 확인', '사용 가능한 이메일입니다.');
            }
        } catch (error) {
            console.error('이메일 중복 확인 실패', error);
        } finally {
            setLoading(false);
        }
    };

    // 수정된 정보 저장
    const handleSave = async () => {
        const updatedFields = {};
        if (nickName !== initialData.nickName) updatedFields.userNickName = nickName;
        if (email !== initialData.email) updatedFields.userMail = email;
        if (password && password !== '') updatedFields.userPw = password; //비밀번호가 변경되었을 때만 검증
    
        // 변경된 내용이 없는 경우 처리
        if (Object.keys(updatedFields).length === 0) {
            Alert.alert('알림', '변경된 내용이 없습니다.');
            return;
        }

        if (emailError || passwordError) {
            Alert.alert('Error', '입력한 정보를 확인하세요.');
            return;
        }

        if (email !== initialData.email && !isEmailChecked) {
            Alert.alert('Error', '이메일 중복 확인을 해주세요.');
            return;
        }
    
        setLoading(true);
        try {
            const accessToken = await AsyncStorage.getItem('accessToken');

            if (!accessToken) {
                Alert.alert('Error', '로그인 세션이 만료되었습니다. 다시 로그인 해주세요.');
                navigation.navigate('LoginScreen');
                return;
            }

            updatedFields.userId = userId;

            const response = await axios.post(`${API_URL}/myActivity/updateUser`, 
                {
                    userId: updatedFields.userId,
                    nickName: updatedFields.userNickName,
                    mail: updatedFields.userMail,
                    userPw: updatedFields.userPw,
                }, 
                {
                    headers: { Authorization: `Bearer ${accessToken}` },
                }
            );

            if (response.data === 'YES') {
                Alert.alert('Success', '수정된 정보가 저장되었습니다.',
                    [
                        {onPress: () => navigation.navigate('MyPage') }, // MyPage로 이동
                    ]);
            } else {
                Alert.alert('Error', '정보 수정 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('정보 수정 실패', error);
            Alert.alert('Error', '정보 수정 중 오류가 발생했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 취소 버튼 클릭
    const handleCancel = () => {
        setNickname(initialData.nickName);
        setEmail(initialData.email);
        setPassword('');
        Alert.alert('알림', '수정이 취소되었습니다.',
            [
                {onPress: () => navigation.navigate('MyPage') }, // MyPage로 이동
            ]);
        }

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>         
            {loading ? (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#F1c0ba" />
                <Text>로딩 중...</Text>
            </View>
            ) : (
                <View style={styles.container}>
                    <Text style={styles.title}>회원 정보 수정</Text>

                    {/* 이름 */}
                    <Text style={styles.label}>이름</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={userName}
                        editable={false}
                    />

                    <Text style={styles.label}>전화번호</Text>
                    <TextInput
                        style={[styles.input, styles.disabledInput]}
                        value={phoneNumber}
                        editable={false}
                    />

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
                                validatePassword(value); // 유효성 검사 호출
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

                    {/* 닉네임 입력 */}
                    <Text style={styles.label}>닉네임</Text>
                    <TextInput
                        style={styles.input}
                        value={nickName}
                        onChangeText={(value) => {
                            setNickname(value);
                            validateNickname(value); // 유효성 검사 호출
                        }}
                    />
                    {nickNameError ? <Text style={styles.errorText}>{nickNameError}</Text> : null}

                    {/* 이메일 입력 */}
                    <Text style={styles.label}>이메일</Text>
                    <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        value={email}
                        onChangeText={(value) => {
                        setEmail(value);  // 이메일 상태 업데이트
                        setIsEmailAvailable(null);  // 이메일 변경 시 중복 확인 상태 초기화
                        setIsEmailChecked(false); // 이메일 변경 시 중복 확인 상태 초기화
                        validateEmail(value);  // 이메일 유효성 검사
                        }}
                    />
                    <TouchableOpacity
                        style={[styles.checkIcon, { justifyContent: 'center', alignItems: 'center' }]} // 체크 아이콘 중앙 정렬
                        onPress={checkEmailDuplicate}
                    >
                        <Text style={{ color: isEmailAvailable === true ? 'green' : isEmailAvailable === false ? 'red' : 'gray'}}>
                            ✔️
                        </Text>
                    </TouchableOpacity>
                    </View>
                    {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

                    {/* 버튼들 */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity 
                            style={[styles.saveButton, loading && { backgroundColor: '#cccccc' }]} 
                            onPress={!loading ? handleSave : null} 
                            disabled={loading} // 로딩 중이면 버튼 비활성화
                        >
                            {loading ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>수정된 정보 저장</Text>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                            <Text style={styles.buttonText}>취소</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, // ScrollView의 자식이 화면을 채우도록 설정
        padding: 20,
        backgroundColor: '#ffffff',
    },
    
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
        borderColor: '#cccccc',
        padding: 10,
        marginBottom: 20,
        borderRadius: 22.375,
        backgroundColor: '#fff',
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 6 }, // 그림자 오프셋을 더 크게 설정하여 입체감 증가
        shadowOpacity: 0.5, // 그림자 투명도를 조금 더 높여서 더 강한 그림자 효과
        shadowRadius: 5, // 그림자 확산 정도를 늘려서 더 부드럽고 넓은 그림자
        elevation: 10, // Android 그림자 강도를 증가시켜 더 두드러진 그림자
    },
    disabledInput: {
        backgroundColor: '#eaeaea',
    },
    buttonContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    saveButton: {
        backgroundColor: '#F1c0ba',
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
        position: 'relative', // 버튼을 입력 필드의 오른쪽에 고정시키기 위해 position 속성 추가
    },    
    checkIcon: {
        position: 'absolute', // 버튼을 입력 필드 안에 배치하기 위해 absolute 위치 지정
        right: 15,
        bottom: 35,
        fontSize: 18,
    },
    
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },    
});

export default EditProfileScreen;
