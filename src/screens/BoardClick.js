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
} from 'react-native';
import Swiper from 'react-native-swiper';
import axios from 'axios';
import { API_URL } from '@env';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const App = () => {
  const route = useRoute();
  const { boardSeq } = route.params;
  const [comments, setComments] = useState([]);
  const [boardDetail, setBoardDetail] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [replies, setReplies] = useState({}); // 각 댓글에 대한 답글 상태
  const [showReplyInput, setShowReplyInput] = useState(null); // 답글 입력창을 열 댓글을 관리

  // 게시글 상세 정보 가져오기
  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('accessToken');
        const response = await axios.get(
          `${API_URL}/board/boardDetail?boardSeq=${boardSeq}`,
          {
            headers: { Authorization: `${accessToken}` },
          }
        );

        const { boardDetail, comments } = response.data;
        setBoardDetail(boardDetail);
        setComments(comments);
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

export default App;
