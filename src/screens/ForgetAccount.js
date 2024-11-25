// ForgetAccount.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { API_URL } from '@env';

const ForgetAccount = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState('findId'); // 'findId' or 'findPw'
    const [selectedOption, setSelectedOption] = useState('email'); // 'email' or 'phone'
    const [inputValue, setInputValue] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [resendAvailable, setResendAvailable] = useState(false);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                console.log("Countdown:", countdown); // 디버깅용 로그
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0 && !resendAvailable) {
            setResendAvailable(true);
        }
        return () => clearInterval(timer);
    }, [countdown]);


    const handleFindAccount = async () => {
        if (!inputValue) {
            Alert.alert('Error', 'Please enter the required information.');
            return;
        }
        if (selectedOption === 'email' && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(inputValue)) {
            Alert.alert('Error', 'Please enter a valid email address.');
            return;
        }

        try {
            // 실제 API 요청을 통해 이메일 또는 휴대폰으로 아이디 또는 비밀번호 전송
            await axios.post(`${API_URL}/auth/find`, {
                type: selectedTab === 'findId' ? 'id' : 'password',
                method: selectedOption,
                value: inputValue,
            });

            // 성공 메시지와 5분 타이머 시작
            Alert.alert('Success', `Account details have been sent via ${selectedOption}.`);
            setCountdown(300); // 5분 (300초)
            setResendAvailable(false);
        } catch (error) {
            if (error.response) {
                Alert.alert('Failed', error.response.data.error);
            } else {
                Alert.alert('Error', 'Unable to connect to the server');
            }
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
                    <Text style={selectedTab === 'findId' ? styles.activeTabText : styles.tabText}>아이디 찾기</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tabButton, selectedTab === 'findPw' && styles.activeTab]}
                    onPress={() => setSelectedTab('findPw')}
                >
                    <Text style={selectedTab === 'findPw' ? styles.activeTabText : styles.tabText}>비밀번호 찾기</Text>
                </TouchableOpacity>
            </View>

            {selectedTab === 'findId' ? (
                <>
                    <View style={styles.optionContainer}>
                        <TouchableOpacity
                            style={[styles.optionButton, selectedOption === 'email' && styles.activeOption]}
                            onPress={() => setSelectedOption('email')}
                        >
                            <Text style={selectedOption === 'email' ? styles.activeOptionText : styles.optionText}>가입한 이메일로 찾기</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.optionButton, selectedOption === 'phone' && styles.activeOption]}
                            onPress={() => setSelectedOption('phone')}
                        >
                            <Text style={selectedOption === 'phone' ? styles.activeOptionText : styles.optionText}>가입한 휴대폰으로 찾기</Text>
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder={selectedOption === 'email' ? '이메일 주소' : '휴대폰 번호'}
                        value={inputValue}
                        onChangeText={setInputValue}
                        keyboardType={selectedOption === 'email' ? 'email-address' : 'phone-pad'}
                    />
                    <TouchableOpacity style={styles.button} onPress={handleFindAccount} disabled={countdown > 0}>
                        <Text style={styles.buttonText}>아이디 찾기</Text>
                    </TouchableOpacity>
                    {countdown > 0 && <Text style={styles.countdownText}>다시 요청하시겠습니까? {Math.floor(countdown / 60)}분 {countdown % 60}초 후 가능합니다.</Text>}
                    {resendAvailable && <TouchableOpacity onPress={handleFindAccount}><Text style={styles.resendText}>다시 요청하기</Text></TouchableOpacity>}
                </>
            ) : (
                <>
                    <TextInput
                        style={styles.input}
                        placeholder="가입한 아이디"
                        value={inputValue}
                        onChangeText={setInputValue}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="비밀번호 재설정을 위한 이메일"
                        value={inputValue}
                        onChangeText={setInputValue}
                        keyboardType="email-address"
                    />
                    <TouchableOpacity style={styles.button} onPress={handleFindAccount} disabled={countdown > 0}>
                        <Text style={styles.buttonText}>비밀번호 찾기</Text>
                    </TouchableOpacity>
                    {countdown > 0 && <Text style={styles.countdownText}>다시 요청하시겠습니까? {Math.floor(countdown / 60)}분 {countdown % 60}초 후 가능합니다.</Text>}
                    {resendAvailable && <TouchableOpacity onPress={handleFindAccount}><Text style={styles.resendText}>다시 요청하기</Text></TouchableOpacity>}
                </>
            )}
            <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
                <Text style={styles.exitButtonText}>나가기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#ddd',
    },
    activeTab: {
        borderColor: '#007BFF',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    optionContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    optionButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginHorizontal: 5,
    },
    activeOption: {
        borderColor: '#007BFF',
    },
    optionText: {
        color: '#666',
    },
    activeOptionText: {
        color: '#007BFF',
        fontWeight: 'bold',
    },
    input: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    exitButton: {
        marginTop: 20,
        padding: 10,
    },
    exitButtonText: {
        color: '#666',
        textDecorationLine: 'underline',
    },
    countdownText: {
        marginTop: 10,
        color: '#FF0000',
    },
    resendText: {
        marginTop: 10,
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
});

export default ForgetAccount;
