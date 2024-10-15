import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';

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
          replies: []
        },
      ]);
      setNewComment('');
    }
  };

  const addReply = (commentId, parentId = null) => {
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
            if (parentId === null) {
              return { ...comment, replies: [...comment.replies, newReplyObj] };
            } else {
              return {
                ...comment,
                replies: addReplyToComments(comment.replies),
              };
            }
          } else {
            return {
              ...comment,
              replies: addReplyToComments(comment.replies),
            };
          }
        });
      };

      setComments((prevComments) => addReplyToComments(prevComments));
      setNewReply('');
      setReplyTo(null);
    }
  };

  const deleteComment = (commentId, user) => {
    if (user === '글쓴이') {
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    }
  };

  const deleteReply = (commentId, replyId, user) => {
    if (user === '글쓴이') {
      const deleteReplyFromComments = (commentsList) => {
        return commentsList.map((comment) => {
          if (comment.id === commentId) {
            return {
              ...comment,
              replies: comment.replies.filter((reply) => reply.id !== replyId),
            };
          } else {
            return {
              ...comment,
              replies: deleteReplyFromComments(comment.replies),
            };
          }
        });
      };

      setComments((prevComments) => deleteReplyFromComments(prevComments));
    }
  };

  const renderReplies = (replies, parentCommentId) => {
    return replies.map((reply) => (
      <View key={reply.id} style={styles.reply}>
        <View style={styles.commentHeaderContainer}>
          <Text style={styles.commentUser}>{reply.user}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => setReplyTo(replyTo === reply.id ? null : reply.id)}
              style={styles.smallButton}
            >
              <Text style={styles.smallButtonText}>답글</Text>
            </TouchableOpacity>
            {reply.user === '글쓴이' && (
              <TouchableOpacity
                onPress={() => deleteReply(parentCommentId, reply.id, reply.user)}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text>{reply.comment}</Text>
        {replyTo === reply.id && (
          <View style={styles.replyInputContainer}>
            <TextInput
              style={styles.replyInput}
              value={newReply}
              onChangeText={setNewReply}
              placeholder="답글을 입력하세요."
            />
            <TouchableOpacity onPress={() => addReply(parentCommentId, reply.id)} style={styles.sendButton}>
              <Text style={styles.sendButtonText}>보내기</Text>
            </TouchableOpacity>
          </View>
        )}
        {renderReplies(reply.replies, reply.id)}
      </View>
    ));
  };

  return (
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
              <TouchableOpacity
                onPress={() => setReplyTo(replyTo === item.id ? null : item.id)}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>답글</Text>
              </TouchableOpacity>
              {item.user === '글쓴이' && (
                <TouchableOpacity
                  onPress={() => deleteComment(item.id, item.user)}
                  style={styles.smallButton}
                >
                  <Text style={styles.smallButtonText}>삭제</Text>
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
              />
              <TouchableOpacity onPress={() => addReply(item.id)} style={styles.sendButton}>
                <Text style={styles.sendButtonText}>보내기</Text>
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
        />
        <TouchableOpacity onPress={addComment} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>보내기</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
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
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  commentHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  commentUser: {
    fontWeight: 'bold',
  },
  reply: {
    marginLeft: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    paddingBottom: 10,
  },
  replyInputContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  replyInput: {
    borderWidth: 1,
    flex: 1,
    padding: 5,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  sendButtonText: {
    color: 'black',
  },
  smallButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    marginLeft: 5,
  },
  smallButtonText: {
    color: 'black',
    fontSize: 12,
  },
  commentInputContainer: {
    marginTop: 20,
    flexDirection: 'row',
  },
  commentInput: {
    borderWidth: 1,
    flex: 1,
    padding: 5,
    marginRight: 10,
  },
});

export default App;
