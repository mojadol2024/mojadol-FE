import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StartLogin = ({ navigation }) => {
    const [userId, setUserId] = useState('');

    const handleNext = async () => {
        if (userId) {
            await AsyncStorage.setItem('userId', userId);
            navigation.navigate('StartPassword');
        } else {
            Alert.alert('Error', 'Please enter your ID.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Forgot Login ID?</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter your ID"
                value={userId}
                onChangeText={setUserId}
            />
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Next</Text>
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
});

export default StartLogin;