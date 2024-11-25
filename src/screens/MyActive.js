import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const MyActivityScreen = () => {
  // 상태로서 선택된 데이터를 관리
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'comments'

  // 더미 데이터: 내가 쓴 글과 댓글
  const myPosts = [
    { id: '1', title: '첫 번째 글' },
    { id: '2', title: '두 번째 글' },
    { id: '3', title: '세 번째 글' },
  ];

  const myComments = [
    { id: '1', comment: '첫 번째 댓글' },
    { id: '2', comment: '두 번째 댓글' },
    { id: '3', comment: '세 번째 댓글' },
  ];

  // 선택된 탭에 따라 데이터를 반환
  const renderContent = () => {
    if (activeTab === 'posts') {
      return (
        <FlatList
          data={myPosts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.title}</Text>
            </View>
          )}
        />
      );
    } else if (activeTab === 'comments') {
      return (
        <FlatList
          data={myComments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text>{item.comment}</Text>
            </View>
          )}
        />
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>나의 활동</Text>
      </View>

      {/* 탭 전환 버튼 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Text style={styles.tabText}>내가 쓴 글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={styles.tabText}>내가 쓴 댓글</Text>
        </TouchableOpacity>
      </View>

      {/* 선택된 데이터 표시 */}
      <View style={styles.content}>{renderContent()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#6200ee',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#6200ee',
  },
  tabText: {
    color: '#000',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  content: {
    flex: 1,
  },
});

export default MyActivityScreen;