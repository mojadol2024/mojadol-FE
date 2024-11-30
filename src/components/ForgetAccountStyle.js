import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f9f9f9',
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
        borderColor: '#C78C30',
    },
    tabText: {
        color: '#666',
    },
    activeTabText: {
        color: '#C78C30',
        fontWeight: 'bold',
    },
    input: {
        width: '90%',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#C78C30',
        padding: 15,
        borderRadius: 10,
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
});

export default styles;
