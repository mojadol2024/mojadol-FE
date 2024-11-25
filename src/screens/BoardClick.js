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

const App = () => {
  const route = useRoute();
  const { boardSeq } = route.params;
  const [comments, setComments] = useState([]);
  const [boardDetail, setBoardDetail] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replies, setReplies] = useState({}); // 각 댓글에 대한 답글 상태
  const [showReplyInput, setShowReplyInput] = useState(null); // 답글 입력창을 열 댓글을 관리
  const [isAuthor, setIsAuthor] = useState(false);
  const navigation = useNavigation();

  const bannerAdUnitId = __DEV__ ? process.env.BANNER_AD_UNIT_ID_DEV : process.env.BANNER_AD_UNIT_ID_PROD;


  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const userSeq = await AsyncStorage.getItem('userSeq');
        const response = await axios.get(
          `${API_URL}/board/boardDetail?boardSeq=${boardSeq}`,
          {
            headers: { Authorization: `${accessToken}` },
          }
        );

        const { boardDetail, comments } = response.data;
        setBoardDetail(boardDetail);
        setComments(comments);

        setIsAuthor(boardDetail.userSeq == userSeq);
      } catch (error) {
        console.error('Error fetching board details:', error);
      }
    };

    fetchBoardDetail();
  }, [boardSeq]);

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

  // 글 삭제
  const handleDelete = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      await axios.post(`${API_URL}/board/delete`, 
        {
          boardSeq: boardDetail.boardSeq
        },
        {
          headers: { Authorization: `${accessToken}`}
        }
      );
      // 삭제 후 이전 화면으로 이동
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting board:', error);
      Alert.alert('삭제 실패', '게시글 삭제에 실패했습니다.');
    }
  };

  // 답글 입력창 토글
  const toggleReplyInput = (commentSeq) => {
    if (showReplyInput === commentSeq) {
      setShowReplyInput(null); // 이미 열려 있으면 닫기
    } else {
      setShowReplyInput(commentSeq); // 해당 댓글에 답글 입력창 열기
    }
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
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{boardDetail?.dogName || '강아지 이름 없음'}</Text>
          <Text>견종: {boardDetail?.breedName || '미상'}</Text>
          <Text>나이: {boardDetail?.dogAge || '알 수 없음'}</Text>
          <Text>성별: {boardDetail?.dogGender === 1 ? '수컷' : '암컷'}</Text>
          <Text>몸무게: {boardDetail?.dogWeight || '미상'}kg</Text>
          <Text>실종일: {boardDetail?.lostDate || '날짜 정보 없음'}</Text>
          <Text>특징: {boardDetail?.memo || '특징 없음'}</Text>
        </View>

          {/* 광고 배너 */ }
        <View style={styles.bannerAdContainer}>
          <BannerAd
            unitId={bannerAdUnitId}
            size={BannerAdSize.BANNER}
            onAdFailedToLoad={(error) => console.error('Ad failed to load', error)} // 광고 로딩 실패 처리
          />
        </View>

        {isAuthor && (
            <View style={styles.authorButtons}>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('BoardUpdate', { boardSeq })}
              >
                <Text style={styles.editButtonText}>수정</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button}
                onPress={() => {
                  Alert.alert(
                    '게시글 삭제',
                    '정말로 삭제하시겠습니까?',
                    [
                      {
                        text: '취소',
                        style: 'cancel',
                      },
                      {
                        text: '삭제',
                        onPress: handleDelete,
                        style: 'destructive',
                      },
                    ]
                  );
                }}
                >
                <Text style={styles.deleteButtonText}>삭제</Text>
              </TouchableOpacity>
            </View>
          )}

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
                {/* 메인 댓글 */}
                <View style={styles.mainComment}>
                  <View style={styles.commentHeader}>
                    <Text style={styles.commentUser}>{comment.nickName}</Text>
                    <TouchableOpacity
                      style={styles.replyButton}
                      onPress={() => toggleReplyInput(comment.commentSeq)}
                    >
                      <Text style={styles.replyButtonText}>답글</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.commentText}>{comment.commentText}</Text>
                </View>

                {/* 답글 목록 */}
                {repliesForComment.length > 0 && (
                  <View style={styles.repliesContainer}>
                    {repliesForComment.map((reply) => (
                      <View 
                        key={`reply-${comment.commentSeq}-${reply.commentSeq}`} 
                        style={styles.replyComment}
                      >
                        <Text style={styles.replyUser}>{reply.nickName}</Text>
                        <Text style={styles.replyText}>{reply.commentText}</Text>
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
