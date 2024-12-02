import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyActivityScreen = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [password, setPassword] = useState('');
  const [isPasswordVerified, setIsPasswordVerified] = useState(false);
  const [myPosts, setMyPosts] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({
    nickName: '',
    mail: ''
  });
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(false);
  const navigation = useNavigation();
  const flatListRef = useRef(null);

  // 내가 쓴 글 가져오기
  const fetchMyPosts = async (page) => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken'); 
      const response = await axios.get(`${API_URL}/myActivity/myBoardList?page=${page}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      const data = response.data;

      setMyPosts((prevData) => [...prevData, ...data.content]);
      setPageData(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('내가 쓴 글 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyComments = async (page) => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/myActivity/myCommentList?page=${page}`, {
        headers: {
          Authorization: accessToken 
        },
      });
      const data = response.data;

      setMyComments((prevData) => [...prevData, ...data.content]);
      setPageData(data.pagination);
      setLoading(false);
    } catch (error) {
      console.error('내가 쓴 댓글 가져오기 실패:', error);
      Alert.alert('댓글 불러오기 실패', '댓글 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 증가
  const handleLoadMore = () => {
    if (loading || (pageData && page >= pageData.totalPages)) return;
    setPage((prevPage) => prevPage + 1);
  };

  // 탭 변경에 따른 데이터 초기화
  useEffect(() => {
    if (activeTab === 'posts') {
      setMyComments([]);
      setPage(0);
    } else if (activeTab === 'comments') {
      setMyPosts([]);
      setPage(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts(page);
    } else if (activeTab === 'comments') {
      fetchMyComments(page);
    }
  }, [page]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('BoardDetail', { boardSeq: item.boardSeq })}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.photo }} 
            style={styles.image}
            onError={(e) => console.log('Image load error', e.nativeEvent.error)}  
          />
          <Text style={styles.statusOverlay}>{item.report}</Text>
        </View>
        <Text style={styles.breed}>{item.breedName}</Text>
        <Text>발견장소: {item.location}</Text> 
        <Text>실종날짜: {item.lostDate}</Text>
      </TouchableOpacity>
    </View>
  );

  // 스크롤 위치 유지
  const handleContentContainerLayout = () => {
    if (flatListRef.current && page > 0) {
      flatListRef.current.scrollToOffset({ animated: false, offset: 0 });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>나의 활동</Text>
      </View>

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

      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={activeTab === 'posts' ? myPosts : myComments}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.boardSeq}`}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.7}
          initialNumToRender={pageData.pageSize}
          contentContainerStyle={styles.contentContainer}
          onLayout={handleContentContainerLayout}
        />
      </View>
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
    marginHorizontal: 5,
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
  content: {
    flex: 1,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});

export default MyActivityScreen;
