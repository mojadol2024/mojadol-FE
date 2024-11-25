import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { requestNotificationPermission } from '../utils/FCMUtils';
import { useNavigation } from '@react-navigation/native';

const Home = ({ navigation }) => {
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const getToken = async () => {
            try {
                const token =  await AsyncStorage.getItem('accessToken');
                if (token) {
                    setAccessToken(token);
                } else {
                    Alert.alert('Error', 'No access token found');
                }
            } catch (error) {
                console.error('Failed to retrieve access token', error);
            }
        };

        const requestPermissions = async () => {
            await requestNotificationPermission(); // 알림 권한 요청
        };

        getToken();
        requestPermissions();
    }, []);

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('accessToken');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Failed to remove access token', error);
        }
    };

    const handleRedirectToBoard = () => {
        navigation.navigate('Board'); // Navigates to the Board screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to Home!</Text>
            {accessToken ? (
                <Text style={styles.tokenText}>Access Token: {accessToken}</Text>
            ) : (
                <Text style={styles.tokenText}>No access token available.</Text>
            )}
            <Button title="Logout" onPress={handleLogout} />
            <Button title="Go to Board" onPress={handleRedirectToBoard} />
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
    tokenText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
});

export default Home;