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
    borderRadius: 23.375, // 더 둥글게 만들기 위해 반지름을 23.375로 설정
    shadowColor: '#000', // 시어 효과를 위한 그림자 색상
    shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
    shadowOpacity: 0.1, // 그림자 투명도
    shadowRadius: 4, // 그림자 확산 정도
    elevation: 5, 
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
  
    repliesContainer: {
      marginLeft: 20,
      marginTop: 8,
    },
    replyComment: {
      backgroundColor: '#f1f3f5',
      padding: 12,
      borderRadius: 23.375, // 답글 박스도 동일한 둥글기 적용
      marginTop: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 5,
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
      borderRadius: 22.375,
      padding: 8,
      marginBottom: 5,
      shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 8 }, // 그림자의 위치를 아래로 조금 더 많이 이동
    shadowOpacity: 0.3, // 그림자의 투명도 증가
    shadowRadius: 10, // 그림자 퍼짐 정도 증가
    elevation: 10, // 안드로이드에서의 그림자 강도를 증가
    },
    replySendButton: {
      backgroundColor: '#f1c0ba',
      padding: 8,
      borderRadius:22.375,
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
      backgroundColor: '#f1c0ba',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 22.375,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bannerAdContainer: {
      justifyContent: 'bottom', // 세로 중앙 정렬
      alignItems: 'bottom', // 가로 중앙 정렬
      marginVertical: 40, // 배너 위 아래 여백
      marginHorizontal: 35,
    },
    infoBox: {
      backgroundColor: '#fff', // 배경색
      borderRadius: 10, // 둥근 모서리
      padding: 15, // 내부 여백
      margin: 10, // 외부 여백
      shadowColor: '#000', // 그림자 색상
      shadowOffset: { width: 0, height: 2 }, // 그림자 오프셋
      shadowOpacity: 0.2, // 그림자 투명도
      shadowRadius: 4, // 그림자 확산 정도
      elevation: 5, // Android 그림자
      borderWidth: 1, // 테두리 두께
      borderColor: '#ddd', // 테두리 색상
    },
    infoText: {
      fontSize: 16, // 텍스트 크기
      color: '#333', // 텍스트 색상
    },
    authorButtons: {
      flexDirection: 'column', // 수직 정렬
      alignItems: 'flex-end',  // 오른쪽 정렬
      marginTop: 10, // 상단 마진을 조금 추가해서 버튼이 강아지 정보 박스와 붙지 않게 함
    },
    button: {
      backgroundColor: '#f1c0ba',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 23.375,
      shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 8 }, // 그림자의 위치를 아래로 조금 더 많이 이동
    shadowOpacity: 0.3, // 그림자의 투명도 증가
    shadowRadius: 10, // 그림자 퍼짐 정도 증가
    elevation: 10, // 안드로이드에서의 그림자 강도를 증가
    borderWidth: 0.1, // 테두리 두께
    borderColor: '#000', // 검은 색 테두리
    
      
    },
    editButtonText: {
      fontWeight: 'bold',
    },
    deleteButtonText: {
      color: '#007BFF ',
      fontWeight: 'bold',
      fontSize: 14,
    },
    replyButtonText: {
      color: '#666',
      fontWeight: 'bold',
      fontSize: 14,
      lineHeight: 19  },
    deleteButton: {
      position: 'absolute',
      top: -2,  // 위로 올리기 위한 값 (값을 조절)
      right: 33,  // 오른쪽으로 보내기 위한 값 (값을 조절)
      padding: 5,
    },
    optionsText: {
      fontSize: 18,
      lineHeight: 6, // 점들 간격을 조절
      textAlign: 'center',
      color: '#666',
    },
    
  });

  export default styles;