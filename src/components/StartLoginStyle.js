import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    contentWrapper: {
        width: '100%',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputContainer: {
        width: '90%',
        marginBottom: 10,
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
    button: {
        backgroundColor: '#F1c0ba',
        padding: 15,
        borderRadius: 22.375,
        alignItems: 'center',
        width: '90%',
        marginBottom: 15,
    },
    buttonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    linkContainer: {
        marginTop: 5,
        marginBottom: 10,
    },
    linkText: {
        color: '#007BFF',
        textDecorationLine: 'underline',
    },
    footer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
    footerText: {
        color: '#888',
        fontSize: 14,
    },
});

export default styles;
