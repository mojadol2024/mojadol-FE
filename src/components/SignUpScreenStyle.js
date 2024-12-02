import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#666666',
        marginBottom: 30,
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
    checkIcon: {
        position: 'absolute',
        right: 10,
        top: 15,
    },
    successText: {
        color: 'green',
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
    eyeIcon: {
        position: 'absolute',
        right: 15,
        top: '48%',
        transform: [{ translateY: -12 }],
        zIndex: 1,
    },
    warningText: {
        color: 'orange',
        fontSize: 14,
        marginBottom: 5,
    },
    passwordRules: {
        marginBottom: 10,
    },
    ruleText: {
        fontSize: 14,
    },
    valid: {
        color: 'green',
    },
    invalid: {
        color: 'gray',
    },
    nicknameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    nicknameInput: {
        flex: 1,
    },
    nicknameRefreshButton: {
        marginLeft: 10,
    },
    nicknameRefreshText: {
        fontSize: 20,
    },
    responseMessage: {
        color: 'red',
        marginBottom: 10,
    },
    idRulesContainer: {
        marginBottom: 10,
    },
    idRuleText: {
        fontSize: 14,
    },
    valid: {
        color: 'green',
    },
    invalid: {
        color: 'gray',
    },
    // "이용 약관 동의" 버튼 스타일 추가
    termsButton: {
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
        alignSelf: 'center',
        backgroundColor: '#CCCCCC', // 기본 색상
    },
    termsButtonActive: {
        backgroundColor: '#4989E8', // 이용 약관 동의 후 색상
    },
    termsButtonInactive: {
        backgroundColor: '#CCCCCC', // 이용 약관 미동의 시 색상
    },
    termsButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default styles;
