import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
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
      //setLoading(false);
    } catch (error) {
      console.error('내가 쓴 글 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyComments = async (page) => {
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/myActivity/myCommentList?page=${page}`, {
        headers: {
          Authorization: accessToken 
        },
      });
      const data = response.data;

      setMyComments((prevData) => [...prevData, ...data.content]);
      setPageData(data.pagination);
      //setLoading(false);
    } catch (error) {
      console.error('내가 쓴 댓글 가져오기 실패:', error);
      Alert.alert('댓글 불러오기 실패', '댓글 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 증가
  const handleLoadMore = () => {
    //if (loading || (pageData && page >= pageData.totalPages)) return;
    if (loading || !pageData || page >= pageData.totalPages) return;  // 페이지가 마지막이면 더 이상 로딩하지 않음 
    setPage((prevPage) => prevPage + 1);
  };

  // 탭 변경에 따른 데이터 초기화
  useEffect(() => {
    if (activeTab === 'posts') {
      setMyPosts([]);
      //setMyComments([]);
      setPage(0);
    } else if (activeTab === 'comments') {
      //setMyPosts([]);
      setMyComments([]);
      setPage(0);
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts(page);
    } else if (activeTab === 'comments') {
      fetchMyComments(page);
    }
  }, [page, activeTab]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
      style={styles.viewButton}
      onPress={() => navigation.navigate('BoardDetail', { boardSeq: item.boardSeq })}
    >
      <View style={styles.rowContainer}>
        <Image
          source={{ uri: item.photo }}
          style={styles.image}
          onError={(e) => console.log('Image load error', e.nativeEvent.error)}
        />

        <View style={styles.textContainer}>
          <Text style={styles.statusOverlay}>{item.report}</Text>
          <Text style={styles.breed}>{item.breedName}</Text>
          <Text>장소: {item.location}</Text>
          <Text>실종날짜: {item.lostDate}</Text>
        </View>
      </View>

      <View
          style={[
            styles.reportBox,
            item.report === 0 ? styles.missingReport : styles.foundReport, // 0이면 실종, 1이면 제보
          ]}
        >
          <Text style={styles.reportText}>
            {item.report === 0 ? '실종' : '발견'}
          </Text>
        </View>
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
        {/* 로딩 상태 표시 */}
        {loading ? (
          <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#F1c0ba" />
              <Text>로딩 중...</Text>
          </View>
        ) : (
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
        )}
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
    borderColor: '#F1c0ba',
    borderRadius: 22.375,
    padding: 10,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#F1c0ba',
  },
  tabText: {
    color: '#000',
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
    width: 55,
    height: 55,
    borderRadius: 25,
    marginRight: 25,
    marginLeft: 10,
  },
  loadingSpinner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  card: {
    borderWidth: 1,
    borderColor: '#cccccc', 
    borderRadius: 10, 
    padding: 15, 
    marginBottom: 15, 
    backgroundColor: '#ffffff', 
    shadowColor: '#000', // 그림자 색상을 검정으로 설정
    shadowOffset: { width: 0, height: 6 }, // 그림자 오프셋
    shadowOpacity: 0.5, // 그림자 투명도 설정
    shadowRadius: 5, // 그림자 퍼짐 정도 설정
    elevation: 5, // Android 그림자 설정
  },
  rowContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center', 
    
  },
  breed: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  reportBox: {
    position: 'absolute',
    top: -2, 
    right: -2, 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderRadius: 22.375,
    alignItems: 'center',
    justifyContent: 'center',
  },
  missingReport: {
    backgroundColor: '#f5fde9', 
  },
  foundReport: {
    backgroundColor: '#fbf3e9', 
  },
  reportText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#aeaeae',
    
  },
  
});

export default MyActivityScreen;