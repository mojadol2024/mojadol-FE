import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
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
    } catch (error) {
        console.error('Error sending reply:', error);
    }
  };
  


  // 답글 입력창 토글
  const toggleReplyInput = (commentSeq) => {
    setShowReplyInput(showReplyInput === commentSeq ? null : commentSeq); // 답글 입력창 토글
  };
  const toggleOptions = (commentSeq) => {
    // 현재 선택된 댓글에 대한 옵션을 토글
    setIsOptionsVisible(isOptionsVisible === commentSeq ? null : commentSeq);
  };


  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* 이미지 슬라이더 */}
        <View style={styles.imageContainer}>
          {boardDetail?.photos?.length > 0 && (
            <Swiper style={styles.swiper} showsButtons={true}>
              {boardDetail.photos.map((photo, index) => (
                <Image key={index} source={{ uri: photo }} style={styles.image} />
              ))}
            </Swiper>
          )}
        </View>

        {/* 강아지 정보 */}
 {/* 강아지 정보 */}
<View style={styles.infoContainer}>
  <View style={styles.infoBox}>
    <Text style={styles.infoText}>개 이름: {boardDetail?.dogName || '강아지 이름 없음'}</Text>
    <Text style={styles.infoText}>견종: {boardDetail?.breedName || '미상'}</Text>
    <Text style={styles.infoText}>나이: {boardDetail?.dogAge || '알 수 없음'}</Text>
    <Text style={styles.infoText}>성별: {boardDetail?.dogGender === 1 ? '수컷' : '암컷'}</Text>
    <Text style={styles.infoText}>몸무게: {boardDetail?.dogWeight || '미상'}kg</Text>
    <Text style={styles.infoText}>실종일: {boardDetail?.lostDate || '날짜 정보 없음'}</Text>
    <Text style={styles.infoText}>특징: {boardDetail?.memo || '특징 없음'}</Text>
  </View>
</View>

         {/* 수정/삭제 버튼 추가 */}
         {isAuthor &&  (
  <View style={styles.authorButtons}>
    <TouchableOpacity 
      style={[styles.button, { marginRight: 60, marginTop: -30  }]} // 수정 버튼 오른쪽 여백 조정
      onPress={() => navigation.navigate('BoardUpdate', { boardSeq })}
    >
      <Text style={styles.editButtonText}>수정</Text>
    </TouchableOpacity>
    <TouchableOpacity 
      style={[styles.button, { marginTop: -35.46 }]} // 삭제 버튼을 수정 버튼과 맞추기 위해 위로 올리기
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
      <Text style={styles.deleteButtonText}>삭제</Text>
    </TouchableOpacity>
  </View>
)}
  {/* 광고 배너 */ }
  <View style={styles.bannerAdContainer}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.BANNER}
            onAdFailedToLoad={(error) => console.error('Ad failed to load', error)} // 광고 로딩 실패 처리
          />
        </View>
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
          <View style={styles.commentHeader}>
            <Text style={styles.commentUser}>{comment.nickName}</Text>
            <TouchableOpacity
              style={styles.optionsButton}
              onPress={() => toggleOptions(comment.commentSeq)} // '...' 버튼 클릭 시 옵션 표시
            >
              <Text style={styles.optionsText}>
    .{'\n'}.{'\n'}.
  </Text>
            </TouchableOpacity>

            {/* 옵션이 표시되는 경우만 삭제 및 답글 버튼을 보임 */}
            {isOptionsVisible === comment.commentSeq && (
              <View style={styles.optionButtonsContainer}>
                <TouchableOpacity
                  style={styles.replyButton}
                  onPress={() => toggleReplyInput(comment.commentSeq)} // 답글 입력창 토글
                >
                  <Text style={styles.replyButtonText}>답글</Text>
                </TouchableOpacity>

                {isAuthor && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => {
                      setCommentSeq(comment.commentSeq);
                      Alert.alert(
                        '댓글 삭제',
                        '정말로 이 댓글을 삭제하시겠습니까?',
                        [
                          { text: '취소', style: 'cancel' },
                          {
                            text: '삭제',
                            onPress: () => deleteComment(comment.commentSeq), // 삭제할 댓글의 commentSeq 전달
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
            )}
          </View>
          <Text style={styles.commentText}>{comment.commentText}</Text>
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

        {/* 답글 입력창 */}
        {showReplyInput === comment.commentSeq && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              value={replies[comment.commentSeq] || ''}
              onChangeText={(text) => setReplies({ ...replies, [comment.commentSeq]: text })}
              placeholder="답글을 입력하세요."
            />
            <TouchableOpacity
              style={styles.replySendButton}
              onPress={() => sendReply(comment.commentSeq)}
            >
              <Text style={styles.sendButtonText}>답글 달기</Text>
            </TouchableOpacity>
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
    value={newComment}
    onChangeText={setNewComment}
    placeholder="댓글을 입력하세요."
  />
  <TouchableOpacity style={styles.sendButton} onPress={sendComment}>
    <Text style={styles.sendButtonText}>보내기</Text>
  </TouchableOpacity>
</View>
</View>


  );
};


export default App;
