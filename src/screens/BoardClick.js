import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { API_URL } from '@env';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import styles from '../components/BoardClickStyle.js';
import { BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import Button from './Button';


const App = () => {
  const route = useRoute();
  const { boardSeq } = route.params;
  const [isOptionsVisible, setIsOptionsVisible] = useState(null);
  const [comments, setComments] = useState([]);
  const [boardDetail, setBoardDetail] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replies, setReplies] = useState({}); // 각 댓글에 대한 답글 상태
  const [showReplyInput, setShowReplyInput] = useState(null); // 답글 입력창을 열 댓글을 관리
  const [isAuthor, setIsAuthor] = useState(false);
  const [commentSeq, setCommentSeq] = useState();
  const navigation = useNavigation();
  const [isReplying, setIsReplying] = useState(false);  // 답글 작성 여부
const [selectedComment, setSelectedComment] = useState(null);  // 답글을 달려고 선택한 댓글



  const bannerAdUnitId = __DEV__ ? process.env.BANNER_AD_UNIT_ID_DEV : process.env.BANNER_AD_UNIT_ID_PROD;
  

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userSeq = await AsyncStorage.getItem('userSeq');
        console.log(`${API_URL}/board/boardDetail?boardSeq=${boardSeq}`)
        const response = await axios.get(
          `${API_URL}/board/boardDetail?boardSeq=${boardSeq}`,
          {
            headers: { Authorization: `${accessToken}` },
          }
        );

        const { boardDetail, comments } = response.data;

// comments 배열을 처리하여 delete_Flag가 1인 댓글은 '삭제된 댓글입니다'로, 0인 댓글은 원래 댓글을 그대로 유지
        const updatedComments = comments.map((comment) => {
          if (comment.deletedFlag === 1) {
            return { ...comment, commentText: '삭제된 댓글입니다.', isDeleted: true }; // 삭제된 댓글로 표시
          }
            return comment; // delete_Flag가 0인 경우 원래의 댓글 그대로 유지
        });

        // 상태 업데이트
        setBoardDetail(boardDetail);
        setComments(updatedComments);


        setIsAuthor(boardDetail.userSeq == userSeq);
      } catch (error) {
        console.error('Error fetching board details:', error);
      }
    };

    fetchBoardDetail();
  }, [boardSeq]);
  const handleDelete = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post(`${API_URL}/board/delete`, {
        boardSeq: boardDetail.boardSeq
      }, {
        headers: { Authorization: `${accessToken}` }
      });
      // 삭제 후 Board 화면으로 이동하며 새로고침을 요청
      navigation.navigate('Board', { refresh: true });
    } catch (error) {
      console.error('Error deleting board:', error);
      Alert.alert('삭제 실패', '게시글 삭제에 실패했습니다.');
    }
  };
  
  
   
  const deleteComment = async (commentSeq) => {
    try {
      // Access token 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('삭제 실패', '로그인이 필요합니다.');
        return;
      }
  
      // 댓글 삭제 API 호출
      await axios.post(`${API_URL}/comments/delete`, 
        { commentSeq },
        {
          headers: { Authorization: `${accessToken}` },
        }
      );
  
      // 댓글 삭제 후 상태 업데이트: 텍스트를 '삭제된 댓글입니다'로 변경
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.commentSeq === commentSeq
            ? { ...comment, commentText: '삭제된 댓글입니다.' }
            : comment
        );
      });
  
      Alert.alert('삭제 완료', '댓글이 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting comment:', error.response?.data || error.message);
      Alert.alert('삭제 실패', '댓글 삭제 중 오류가 발생했습니다.');
    }
  };
  
  
  
  const deleteReply = async (parentCommentSeq, replyCommentSeq) => {
    try {
      // Access token 가져오기
      const accessToken = await AsyncStorage.getItem('accessToken');
      if (!accessToken) {
        Alert.alert('삭제 실패', '로그인이 필요합니다.');
        return;
      }
  
      // 답글 삭제 API 호출
      await axios.post(`${API_URL}/comments/delete`, 
        { commentSeq: replyCommentSeq },
        {
          headers: { Authorization: ` ${accessToken}` },
        }
      );
  
      // 답글 삭제 후 상태 업데이트: 삭제된 답글을 '삭제된 댓글입니다'로 변경
      setComments((prevComments) => {
        return prevComments.map((comment) =>
          comment.commentSeq === replyCommentSeq
            ? { 
                ...comment, 
                commentText: '삭제된 답글입니다.', 
              }
            : comment
        );
      });
      
  
      Alert.alert('삭제 완료', '답글이 삭제되었습니다.');
    } catch (error) {
      console.error('답글 삭제 중 오류가 발생했습니다:', error.response?.data || error.message);
      Alert.alert('삭제 실패', '답글 삭제 중 오류가 발생했습니다.');
    }
  };
  
  


  // 댓글 전송  
  const sendComment = async () => {
    if (!newComment.trim()) return;

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post(
        `${API_URL}/comments/write`,
        { boardSeq, commentText: newComment },
        { headers: { Authorization: `${accessToken}` } }
      );
      setComments([
        ...comments,
        { commentSeq: comments.length + 1, nickName: '내 댓글', commentText: newComment },
      ]);
      setNewComment('');
    } catch (error) {
      console.error('Error sending comment:', error);
    }
  };
  
  // 댓글에 답글 추가
  const sendReply = async (commentSeq) => {
    const replyText = replies[commentSeq];
    if (!replyText?.trim()) return;
    try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.post(
            `${API_URL}/comments/reply`,
            { 
                boardSeq, 
                parentCommentSeq: commentSeq,
                commentText: replyText 
            },
            { 
                headers: { Authorization: `${accessToken}` } 
            }
        );
        

        setComments([...comments, response.data]);
        setReplies({ ...replies, [commentSeq]: '' });
        setShowReplyInput(null);
        setIsReplying(false);
    } catch (error) {
        console.error('Error sending reply:', error);
    }
  };
  


  // 답글 입력창 토글
 const toggleReplyInput = (commentSeq) => {
  //setShowReplyInput(showReplyInput === commentSeq ? null : commentSeq); // 답글 입력창 토글
  setIsReplying(true); // 답글 작성 모드 ㅋㅋ
  setSelectedComment(commentSeq); // 선택한 댓글의 commentSeq 저장
};
 

  const startReplying = (commentSeq) => {
    setIsReplying(true);
    setSelectedComment(commentSeq);
  };

  

  return (
    
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 슬라이더 */}
        <View style={styles.imageContainer}>
          {boardDetail?.photos?.length > 0 && (
            <Swiper style={styles.swiper} showsButtons={false}>
              {boardDetail.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.image} />
              ))}
            </Swiper>
          )}
        </View>

        {/* 광고 배너 */ }
        <View style={styles.bannerAdContainer}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.BANNER}
            onAdFailedToLoad={(error) => console.error('Ad failed to load', error)} // 광고 로딩 실패 처리
          />
        </View>
        {/* 댓글 목록 */}

        {/* 강아지 정보 */}
 {/* 강아지 정보 */}
<View style={styles.infoContainer}>
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>개 이름: {boardDetail?.dogName || '강아지 이름 없음'}</Text>
    <Text style={styles.infoText}>견종: {boardDetail?.breedName || '미상'}</Text>
    <Text style={styles.infoText}>나이: {boardDetail?.dogAge || '알 수 없음'}</Text>
    <Text style={styles.infoText}>성별: {boardDetail?.dogGender === 1? '수컷': boardDetail?.dogGender === 0? '암컷': '정보 없음'}</Text>
    <Text style={styles.infoText}>몸무게: {boardDetail?.dogWeight || '미상'}</Text>
    <Text style={styles.infoText}>날짜: {boardDetail?.lostDate || '날짜 정보 없음'}</Text>
    <Text style={styles.infoText}>특징: {boardDetail?.memo || '특징 없음'}</Text>
  </View>
</View>

         {/* 수정/삭제 버튼 추가 */}
        {isAuthor && (
  <View style={styles.authorButtons}>
    <TouchableOpacity
      style={[styles.button]} // 수정 버튼 오른쪽 여백 조정
      onPress={() => navigation.navigate('BoardUpdate', { boardSeq })} // 수정 화면으로 이동
    >
      <Text style={styles.editButtonText}>수정</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.button]} // 삭제 버튼을 수정 버튼과 맞추기 위해 위로 올리기
      onPress={() => {
        Alert.alert(
          '게시글 삭제',
          '정말로 삭제하시겠습니까?',
          [
            { text: '취소', style: 'cancel' },
            { 
              text: '삭제', 
              onPress: handleDelete, 
              style: 'destructive' 
            },
          ]
        );
      }}
    >
      <Text style={styles.editButtonText}>삭제</Text>
    </TouchableOpacity>
  </View>
)}






        {/* 댓글 목록 */}

{/* 댓글 목록 */}
<View style={styles.commentHeader}>
  <Text style={styles.commentHeaderText}>댓글 ({comments.length})</Text>
</View>

{/* 댓글 목록 - 부모 댓글만 먼저 필터링 */}
{comments
  .filter(comment => !comment.parentCommentSeq) // parentCommentSeq가 없는 댓글만 선택
  .map((comment) => {
    // 해당 댓글의 답글들 찾기
    const repliesForComment = comments.filter(reply => reply.parentCommentSeq === comment.commentSeq);

    return (
      <View key={`comment-${comment.commentSeq}`} style={styles.commentContainer}>
        <View style={styles.mainComment}>
          <TouchableOpacity
            onPress={() => toggleReplyInput(comment.commentSeq)}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{comment.nickName}</Text>
            {isAuthor && (
                  <TouchableOpacity
                    style={styles.cdeleteButton}
                    onPress={() => {
                      Alert.alert(
                        '댓글 삭제',
                        '정말로 이 댓글을 삭제하시겠습니까?',
                        [
                          { text: '취소', style: 'cancel' },
                          {
                            text: '삭제',
                            onPress: () => deleteReply(comment.commentSeq, comment.commentSeq), // 삭제할 답글의 commentSeq 전달
                            style: 'destructive',
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                )}
          </View>
          <Text style={styles.commentText}>{comment.commentText}</Text>
          </TouchableOpacity>
        </View>

        {/* 답글 목록 */}
        {repliesForComment.length > 0 && (
          <View style={styles.repliesContainer}>
            {repliesForComment.map((reply) => (
              <View key={`reply-${comment.commentSeq}-${reply.commentSeq}`} style={styles.replyComment}>
                <Text style={styles.replyUser}>{reply.nickName}</Text>
                <Text style={styles.replyText}>{reply.commentText}</Text>

                {isAuthor && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      Alert.alert(
                        '답글 삭제',
                        '정말로 이 답글을 삭제하시겠습니까?',
                        [
                          { text: '취소', style: 'cancel' },
                          {
                            text: '삭제',
                            onPress: () => deleteReply(comment.commentSeq, reply.commentSeq), // 삭제할 답글의 commentSeq 전달
                            style: 'destructive',
                          },
                        ]
                      );
                    }}
                  >
                    <Text style={styles.deleteButtonText}>삭제</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        )}

        
      </View>
    );
  })}
</ScrollView>


{/* 댓글 입력 (화면 하단에 고정) */}
<View style={styles.commentInputContainer}>
  <TextInput
    style={styles.commentInput}
    value={isReplying ? replies[selectedComment] || '' : newComment}
    onChangeText={(text) => {
      if (isReplying) {
        setReplies({ ...replies, [selectedComment]: text });
      } else {
        setNewComment(text);
      }
    }}
    placeholder={isReplying ? "답글을 입력하세요." : "댓글을 입력하세요."}
  />
  <TouchableOpacity
    style={styles.sendButton}
    onPress={() => {
      if (isReplying) {
        sendReply(selectedComment);  // 답글을 다는 경우
      } else {
        sendComment();  // 댓글을 다는 경우
      }

      // 버튼을 클릭할 때마다 상태를 반전시킴
      if (isReplying) {
        // 답글을 다는 상태에서 다시 클릭하면 댓글 작성 상태로 돌아감
        setIsReplying(false);
      } else {
        // 댓글을 다는 상태에서 클릭하면 답글 작성 상태로 전환
        setIsReplying(true);
      }
    }}
  >
    <Text style={styles.sendButtonText}>
      {isReplying ? "답글 달기" : "댓글 달기"}
    </Text>
  </TouchableOpacity>
</View>




</View>


  );
};


export default App;
