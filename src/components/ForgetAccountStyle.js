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
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tabButton: {
        flex: 1,
        padding: 15,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderColor: '#ddd',
    },
    activeTab: {
        borderColor: '#F1c0ba',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#F1c0ba',
        fontWeight: 'bold',
    },
    input: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 22.375,
        marginBottom: 20,
        backgroundColor: '#fff',
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
        width: '90%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    exitButton: {
        marginTop: 20,
        marginBottom: 40,
    },
    exitButtonText: {
        color: '#666',
        textDecorationLine: 'underline',
        fontSize: 14,
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
    footerText: {
        color: '#999',
        fontSize: 14,
    },
    buttonWrapper: {
        width: '90%',
        marginBottom: 15,
    },
    verificationButton: {
        backgroundColor: '#F1c0ba',
        padding: 15,
        borderRadius: 22.375,
        width: '100%',
        alignItems: 'center',
    },
    resendButton: {
        backgroundColor: '#F1c0ba',
        padding: 15,
        borderRadius: 22.375,
        width: '100%',
        alignItems: 'center',
    },
    countdownText: {
        marginTop: 10,
        color: '#333',
        fontSize: 14,
    },
});

export default styles;
