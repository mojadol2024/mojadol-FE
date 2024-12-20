import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
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
        borderRadius: 22.375,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 10,
        shadowColor: '#000', // 그림자 색상
        shadowOffset: { width: 0, height: 6 }, // 그림자 오프셋
        shadowOpacity: 0.5, // 그림자 투명도
        shadowRadius: 5, // 그림자 확산 정도
        elevation: 10, // Android 그림자 강도
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
    emailRulesContainer: {
        marginBottom: 10,
    },
});

export default styles;
