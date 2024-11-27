import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';

const MyActivityScreen = () => {
  // 상태로서 선택된 데이터를 관리
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'comments'

  // 더미 데이터: 내가 쓴 글과 댓글
  const myPosts = [
    { id: '1', title: '첫 번째 글', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQJjHY4DexDJWPHtjECnXAgo2DR2PeksT21g&s' },
    { id: '2', title: '두 번째 글', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFZTh3jxJuB9JrQMfXd0-BYwzBRF7VpxmxQ&s' },
    { id: '3', title: '세 번째 글', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTELmqZ31Kt-IzSpLCIZl249imjGlL5IsJw-w&s' },
  ];

  const myComments = [
    { id: '1', comment: '첫 번째 댓글' },
    { id: '2', comment: '두 번째 댓글' },
    { id: '3', comment: '세 번째 댓글' },
  ];

  // 선택된 탭에 따라 데이터를 반환
  const renderContent = () => {
    if (activeTab === 'posts') {
      if (myPosts.length === 0) {
        return (
          <View style={styles.noActivityContainer}>
            <Text style={styles.noActivityText}>아직 활동이 없습니다</Text>
          </View>
        );
      } else {
        return (
          <FlatList
            data={myPosts}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.itemContainer}>
                <TouchableOpacity style={styles.itemContent}>
                  {/* 이미지 왼쪽에 배치 */}
                  {item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.image} />
                  )}
                  <Text style={styles.titleText}>{item.title}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        );
      }
    } else if (activeTab === 'comments') {
      if (myComments.length === 0) {
        return (
          <View style={styles.noActivityContainer}>
            <Text style={styles.noActivityText}>아직 활동이 없습니다</Text>
          </View>
        );
      } else {
        return (
          <FlatList
            data={myComments}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <TouchableOpacity><Text>{item.comment}</Text></TouchableOpacity>
            </View>
          )}
          />
        );
      }
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
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeText]}>내가 쓴 글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeText]}>내가 쓴 댓글</Text>
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
    backgroundColor: '#ffffff',
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
    borderColor: '#c78c30',
    borderRadius: 22.375,
    padding: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#c78c30',
  },
  tabText: {
    color: '#000000',
    fontWeight: 'bold',
  },
  activeText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#c78c30',
  },
  content: {
    flex: 1,
  },
  itemContent: {
    flexDirection: 'row',  // 수평으로 배치
    alignItems: 'center',  // 중앙 정렬
  },
  image: {
    width: 50,  // 작은 크기의 이미지
    height: 50,
    borderRadius: 25,  // 원형으로 만들기
    marginRight: 10,  // 텍스트와 간격을 추가
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noActivityContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noActivityText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#c78c30',
    opacity: 0.6
  },
});

export default MyActivityScreen;
