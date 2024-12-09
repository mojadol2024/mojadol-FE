import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 20,
    },
    logoContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    logoWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
    },
    highlightedText: {
        fontSize: 20,
        color: '#B8860B',
        fontWeight: 'bold',
        fontFamily: 'sans-serif-condensed',
    },
    startButtonContainer: {
        marginTop: 50,
        width: '90%',
        marginBottom: 5,
    },
    startButton: {
        backgroundColor: '#F1c0ba',
        paddingVertical: 15,
        borderRadius: 22.375,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    startButtonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    kakaoButtonContainer: {
        width: '90%',
    },
    kakaoButton: {
        backgroundColor: '#FEE500',
        paddingVertical: 15,
        borderRadius: 22.375,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 20,
    },
    kakaoIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    kakaoButtonText: {
        color: '#3C1E1E',
        fontSize: 18,
        fontWeight: 'bold',
    },
    signUpLinkText: {
        color: '#666666',
        fontSize: 14,
        marginTop: 20,
    },
    signUpLinkTextUnderLine: {
        color: '#007BFF',
        fontSize: 14,
        textDecorationLine: 'underline',
        marginTop: 20,
    },
});

export default styles;