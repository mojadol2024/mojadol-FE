import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 22.375,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#F1c0ba',
        padding: 15,
        borderRadius: 22.375,
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    passwordMatchMessage: {
        fontSize: 14,
        marginBottom: 15,
        width: '90%',
        fontWeight: 'bold',
    },
    passwordMatch: {
        color: 'green',
    },
    passwordMismatch: {
        color: 'gray',
    },
    passwordRules: {
        marginBottom: 15,
        width: '90%',
    },
    ruleText: {
        fontSize: 12,
        marginBottom: 5,
        textAlign: 'left',
    },
    valid: {
        color: 'green',
    },
    invalid: {
        color: 'gray',
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
});

export default styles;