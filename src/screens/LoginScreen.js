import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import axios from 'axios';

const LoginScreen = () => {
    const [userId, setUserId] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://10.0.2.2:3000/user/login', {
                userId: userId,
                phoneNumber: phoneNumber,
            });
            setResponseMessage(`Login successful: ${response.data.message}`);
        } catch (error) {
            if (error.response) {
                setResponseMessage(`Login failed: ${error.response.data.error}`);
            } else {
                setResponseMessage('Error connecting to the server');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <CustomInput
                placeholder="ID"
                value={userId}
                onChangeText={setUserId}
            />
            <CustomInput
                placeholder="PhoneNumber"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                secureTextEntry
            />
            <CustomButton title="Login" onPress={handleLogin} />
            {responseMessage && <Text>{responseMessage}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default LoginScreen;
