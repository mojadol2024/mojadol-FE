// StartLogin.styles.js
import { StyleSheet } from 'react-native';

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
        textAlign: 'center',
    },
    inputContainer: {
        width: '90%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#ffffff',
        padding: 15,
        borderRadius: 10,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#C78C30',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%', // 입력란과 동일한 크기
        marginBottom: 10,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 10,
    },
    linkText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    footerText: {
        position: 'absolute', // 화면 하단에 고정
        bottom: 10, // 하단 여백
        color: '#888',
        fontSize: 14,
    },
});

export default styles;
