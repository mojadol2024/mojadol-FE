import { StyleSheet, Dimensions } from 'react-native';


const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 10,
      paddingBottom: 100, // 댓글 입력창이 가려지지 않도록 여유 공간 확보
    },
    imageContainer: {
      alignItems: 'center',
      marginBottom: 20,
    },
    swiper: {
      height: 200,
    },
    image: {
      width: width - 20,
      height: 200,
      resizeMode: 'cover',
      borderRadius: 10,
    },
    infoContainer: {
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    commentContainer: {
      marginBottom: 15,
    },
    mainComment: {
      backgroundColor: '#f8f9fa',
      padding: 12,
      borderRadius: 8,
    },
    commentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 8,
    },
    commentUser: {
      fontWeight: 'bold',
      fontSize: 14,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 20,
    },
    replyButton: {
      backgroundColor: 'transparent',
      paddingVertical: 4,
      paddingHorizontal: 8,
    },
    replyButtonText: {
      color: '#666',
      fontSize: 12,
    },
    repliesContainer: {
      marginLeft: 20,
      marginTop: 8,
    },
    replyComment: {
      backgroundColor: '#f1f3f5',
      padding: 12,
      borderRadius: 8,
      marginTop: 8,
    },
    replyUser: {
      fontWeight: 'bold',
      fontSize: 13,
      marginBottom: 4,
    },
    replyText: {
      fontSize: 14,
    },
    replyInputContainer: {
      marginTop: 8,
      marginLeft: 20,
    },
    replyInput: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#dee2e6',
      borderRadius: 8,
      padding: 8,
      marginBottom: 8,
    },
    replySendButton: {
      backgroundColor: '#007bff',
      padding: 8,
      borderRadius: 8,
      alignSelf: 'flex-end',
    },
    commentInputContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      padding: 10,
      backgroundColor: '#fff',
      borderTopWidth: 1,
      borderTopColor: '#ddd',
    },
    commentInput: {
      flex: 1,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 20,
      paddingLeft: 10,
      paddingRight: 10,
      height: 40,
      marginRight: 10,
    },
    sendButton: {
      backgroundColor: '#007bff',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sendButtonText: {
      color: 'white',
    },
  });

  export default styles;