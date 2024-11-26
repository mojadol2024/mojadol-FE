import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const EditProfileScreen = () => {
    // 초기 사용자 데이터 (더미 데이터)
    const initialUserData = {
        id: 'id1234',
        nickname: '닉네임1',
        email: '234@example.com',
        password: 'pw1234',
    };

    // 상태 관리
    const [userData, setUserData] = useState(initialUserData); // 수정 가능한 데이터
    const [tempData, setTempData] = useState(initialUserData); // 임시 데이터 (취소 시 복원)

    // 저장 버튼 클릭
    const handleSave = () => {
        setUserData(tempData); // 수정된 데이터를 저장
        Alert.alert('Success', '수정된 정보가 저장되었습니다.');
    };

    // 취소 버튼 클릭
    const handleCancel = () => {
        setTempData(userData); // 변경 사항 취소
        Alert.alert('Cancelled', '수정이 취소되었습니다.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>회원 정보 수정</Text>

            {/* 닉네임 입력 */}
            <Text style={styles.label}>닉네임</Text>
            <TextInput
                style={styles.input}
                value={tempData.nickname}
                onChangeText={(text) => setTempData({ ...tempData, nickname: text })}
            />

            {/* 이메일 입력 */}
            <Text style={styles.label}>이메일</Text>
            <TextInput
                style={styles.input}
                value={tempData.email}
                onChangeText={(text) => setTempData({ ...tempData, email: text })}
            />

            {/* 아이디 (수정 불가) */}
            <Text style={styles.label}>아이디</Text>
            <TextInput
                style={[styles.input, styles.disabledInput]}
                value={tempData.id}
                editable={false}
            />

            {/* 비밀번호 입력 */}
            <Text style={styles.label}>비밀번호</Text>
            <TextInput
                style={styles.input}
                value={tempData.password}
                onChangeText={(text) => setTempData({ ...tempData, password: text })}
                secureTextEntry={true}
            />

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
        backgroundColor: '#c78c30',
        opacity: 0.6,
        padding: 15,
        borderRadius: 22.375,
        flex: 1,
        marginLeft: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EditProfileScreen;
