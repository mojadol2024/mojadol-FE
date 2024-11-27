import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const App = () => {
  const [comments, setComments] = useState([
    { id: '1', user: '익명 1', comment: '시내에서 본 거 같아요', replies: [] },
    { id: '2', user: '익명 2', comment: '꼭 찾길 바랄게요', replies: [] },
    { id: '3', user: '글쓴이', comment: '감사합니다!', replies: [] },
  ]);

  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [isAuthor, setIsAuthor] = useState(true);

  const addComment = () => {
    if (newComment.trim()) {
      setComments([
        ...comments,
        {
          id: Math.random().toString(),
          user: isAuthor ? '글쓴이' : '익명',
          comment: newComment,
          replies: [],
        },
      ]);
      setNewComment('');
    }
  };

  const addReply = (commentId) => {
    if (newReply.trim()) {
      const newReplyObj = {
        id: Math.random().toString(),
        user: isAuthor ? '글쓴이' : '익명',
        comment: newReply,
        replies: [],
      };

      const addReplyToComments = (commentsList) => {
        return commentsList.map((comment) => {
          if (comment.id === commentId) {
            return { ...comment, replies: [...comment.replies, newReplyObj] };
          } else {
            return { ...comment, replies: addReplyToComments(comment.replies) };
          }
        });
      };

      setComments((prevComments) => addReplyToComments(prevComments));
      setNewReply('');
      setReplyTo(null);
    }
  };

  const deleteComment = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
  };

  const deleteReply = (commentId, replyId) => {
    const removeReplyFromComments = (commentsList) => {
      return commentsList.map((comment) => {
        if (comment.id === commentId) {
          const updatedReplies = comment.replies.filter((reply) => reply.id !== replyId);
          return { ...comment, replies: updatedReplies };
        } else {
          return { ...comment, replies: removeReplyFromComments(comment.replies) };
        }
      });
    };

    setComments((prevComments) => removeReplyFromComments(prevComments));
  };

  const renderReplies = (replies, parentCommentId) => {
    return replies.map((reply) => (
      <View key={reply.id} style={styles.reply}>
        <View style={styles.replyMarker}>
          <Text>ㄴ</Text>
        </View>
        <View style={styles.replyTextContainer}>
          <View style={styles.commentHeaderContainer}>
            <Text style={styles.commentUser}>{reply.user}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => setReplyTo(replyTo === reply.id ? null : reply.id)}>
                <Text style={styles.replyButton}>💬</Text>
              </TouchableOpacity>
              {reply.user === '글쓴이' && (
                <TouchableOpacity onPress={() => deleteReply(parentCommentId, reply.id)}>
                  <Text style={styles.replyButton}>🗑️</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <Text>{reply.comment}</Text>
          {renderReplies(reply.replies, reply.id)}
        </View>
      </View>
    ));
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: 'https://example.com/dog.jpg' }} style={styles.image} />
          </View>

          <View style={styles.infoContainer}>
            <Text style={styles.title}>믹스견</Text>
            <Text>이름: 뽀삐</Text>
            <Text>나이: 3살</Text>
            <Text>성별: 암컷(중성화 X)</Text>
            <Text>몸무게: 2kg</Text>
            <Text>실종일: 2024년 9월 30일</Text>
            <Text>실종장소: 경상남도 진주시 가좌동</Text>
            <Text>특징: 털 색은 누렇고 꼬리가 짧아요</Text>
            <Text>전화번호: 010-1234-5678</Text>
          </View>

          <View style={styles.commentHeader}>
            <Text style={styles.commentHeaderText}>댓글 ({comments.length})</Text>
          </View>

          {comments.map((item) => (
            <View key={item.id} style={styles.comment}>
              <View style={styles.commentHeaderContainer}>
                <Text style={styles.commentUser}>{item.user}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity onPress={() => setReplyTo(replyTo === item.id ? null : item.id)}>
                    <Text style={styles.replyButton}>💬</Text>
                  </TouchableOpacity>
                  {item.user === '글쓴이' && (
                    <TouchableOpacity onPress={() => deleteComment(item.id)}>
                      <Text style={styles.replyButton}>🗑️</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text>{item.comment}</Text>
              {replyTo === item.id && (
                <View style={styles.replyInputContainer}>
                  <TextInput
                    style={styles.replyInput}
                    value={newReply}
                    onChangeText={setNewReply}
                    placeholder="답글을 입력하세요."
                    autoFocus
                    onFocus={() => setReplyTo(item.id)}
                  />
                  <TouchableOpacity onPress={() => addReply(item.id)}>
                    <Text style={styles.sendButton}>보내기</Text>
                  </TouchableOpacity>
                </View>
              )}
              {renderReplies(item.replies, item.id)}
            </View>
          ))}

          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="댓글을 입력하세요."
              // onFocus={() => Keyboard.dismiss()}
            />
            <TouchableOpacity onPress={addComment}>
              <Text style={styles.commentEmoji}>🐾</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};


const styles = StyleSheet.create({
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  commentInput: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  commentEmoji: {
    fontSize: 26,
  },
  // 나머지 
  contentContainer: {
    padding: 10,
  },
  replyButton: {
    fontSize: 17,
  },
  imageContainer: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  infoContainer: {
    marginVertical: 20,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  commentHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  commentHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  comment: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  commentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  replyInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    width: 200, // 줄어든 크기 설정
    padding: 5,
    borderRadius: 5,
  },
  sendButton: {
    marginLeft: 10,
    color: 'blue',
  },
  reply: {
    marginBottom: 10,
    marginLeft: 30, // 답글을 왼쪽으로 이동
    padding: 10,
    flexDirection: 'row',
    backgroundColor: '#f0f0f0', // 답글에 연한 회색 배경 적용
    borderRadius: 5, // 답글을 둥글게 만듦
  },
  replyMarker: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  replyTextContainer: {
    flex: 1,
  },
});

export default App;
