import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';
import { API_URL } from '@env';

const SignUpScreen = ({ navigation }) => {
    const [userId, setUserId] = useState('');
    const [userPw, setUserPw] = useState('');
    const [confirmPw, setConfirmPw] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSignUp = async () => {
        if (userPw !== confirmPw) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/auth/signup`, {
                userId: userId,
                userPw: userPw,
            });
            setResponseMessage(`Sign-up successful: ${response.data.message}`);
            console.log('Navigating to login');
            navigation.navigate('Login');
        } catch (error) {
            if (error.response) {
                setResponseMessage(`Sign-up failed: ${error.response.data.error}`);
            } else {
                setResponseMessage('Error connecting to the server');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <CustomInput
                placeholder="ID"
                value={userId}
                onChangeText={setUserId}
            />
            <CustomInput
                placeholder="Password"
                value={userPw}
                onChangeText={setUserPw}
                secureTextEntry
            />
            <CustomInput
                placeholder="Confirm Password"
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry
            />
            <CustomButton title="Sign Up" onPress={handleSignUp} />
            {responseMessage && <Text>{responseMessage}</Text>}
            <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.loginLink}>
                <Text style={styles.loginText}>Already have an account? Log in</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    loginLink: {
        marginTop: 15,
    },
    loginText: {
        color: '#007BFF',
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default SignUpScreen;
