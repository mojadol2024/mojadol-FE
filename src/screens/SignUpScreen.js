import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';

const SignUpScreen = () => {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [birthMonth, setBirthMonth] = useState('');
    const [birthDay, setBirthDay] = useState('');
    const [gender, setGender] = useState('');
    const [isMonthModalVisible, setMonthModalVisible] = useState(false);

    const handleSignUp = () => {
        if (!userId || !password || !confirmPassword || !name) {
            Alert.alert('Error', '모든 필드를 입력해 주세요.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Error', '비밀번호가 일치하지 않습니다.');
            return;
        }
        Alert.alert('Success', '회원가입이 완료되었습니다.');
    };

    const renderMonthModal = () => (
        <Modal visible={isMonthModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {[...Array(12)].map((_, i) => (
                        <TouchableOpacity
                            key={i + 1}
                            onPress={() => {
                                setBirthMonth(i + 1);
                                setMonthModalVisible(false);
                            }}
                            style={styles.modalItem}
                        >
                            <Text style={styles.modalItemText}>{i + 1}월</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="아이디"
                value={userId}
                onChangeText={setUserId}
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="비밀번호 재확인"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="이름"
                value={name}
                onChangeText={setName}
            />
            <View style={styles.birthContainer}>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="년(4자)"
                    value={birthYear}
                    onChangeText={setBirthYear}
                    keyboardType="numeric"
                    maxLength={4}
                />
                <TouchableOpacity
                    style={[styles.input, { flex: 1, justifyContent: 'center' }]}
                    onPress={() => setMonthModalVisible(true)}
                >
                    <Text>{birthMonth ? `${birthMonth}월` : '월'}</Text>
                </TouchableOpacity>
                <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="일"
                    value={birthDay}
                    onChangeText={setBirthDay}
                    keyboardType="numeric"
                    maxLength={2}
                />
            </View>
            <TouchableOpacity
                style={styles.input}
                onPress={() => Alert.alert('성별 선택')}
            >
                <Text>{gender || '성별'}</Text>
            </TouchableOpacity>
            {renderMonthModal()}
            <TouchableOpacity style={styles.submitButton} onPress={handleSignUp}>
                <Text style={styles.submitButtonText}>가입하기</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    birthContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '60%',
    },
    modalItem: {
        padding: 10,
        marginVertical: 5,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
        borderRadius: 5,
    },
    modalItemText: {
        fontSize: 16,
    },
    submitButton: {
        backgroundColor: '#808080',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
