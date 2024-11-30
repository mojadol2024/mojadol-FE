import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { API_URL } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import AsyncStorage from '@react-native-async-storage/async-storage';


const MyActivityScreen = () => {
  // 탭 관리 상태
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'comments', 'passwordCheck', 'updateUser'
  const [password, setPassword] = useState(''); // 비밀번호 입력 상태
  const [isPasswordVerified, setIsPasswordVerified] = useState(false); // 비밀번호 확인 여부

  // 사용자 활동 상태
  const [myPosts, setMyPosts] = useState([]); // 내가 쓴 글
  const [myComments, setMyComments] = useState([]); // 내가 쓴 댓글
  const [loading, setLoading] = useState(false); // 로딩 상태

  // 사용자 정보 상태
  const [userInfo, setUserInfo] = useState({
    nickName: '',
    mail: ''
  });

  const [page, setPage] = useState(0); // 페이지 관리
  const [pageData, setPageData] = useState(false);
  const navigation = useNavigation();

  // 내가 쓴 글 가져오기
  const fetchMyPosts = async (page) => {
    try {
      console.log(`${API_URL}/myActivity/myBoardList?${page}`)
      const accessToken = await AsyncStorage.getItem('accessToken');
      setLoading(true);
      const response = await axios.get(`${API_URL}/myActivity/myBoardList?${page}`, {
        headers: {
          Authorization: accessToken,
        },
      });
      const data = response.data;
      // 새로운 데이터를 기존 데이터와 합쳐서 상태 업데이트
      setMyPosts((prevData) => [...prevData, ...data.content]);
      setPageData(data.pagination)
      console.log(pageData);
      setLoading(false);
      console.log(data.content.map(item => item.photo));
    } catch (error) {
      console.error('내가 쓴 글 가져오기 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  // 내가 쓴 댓글 가져오기
  const fetchMyComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/myComments`);
      setMyComments(response.data);
    } catch (error) {
      console.error('내가 쓴 댓글 가져오기 실패:', error);
      Alert.alert('내가 쓴 댓글을 불러오는 데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };
  //page 증가
  const handleLoadMore = () => {
    if (!loading) {
      setPage((prevPage) => prevPage + 1);  // 페이지 증가
    }
  };

  // 비밀번호 확인 API 호출
  const passwordCheck = async () => {
    const requestData = {
      userSeq: 123, // 실제 사용자 고유 번호
      userId: 'exampleUser',
      userPw: password // 입력받은 비밀번호
    };

    try {
      const response = await axios.post(`${API_URL}/passwordCheck`, requestData);
      if (response.data.success) {
        Alert.alert('확인 성공', '비밀번호가 일치합니다.');
        setIsPasswordVerified(true); // 비밀번호 확인 성공
        setActiveTab('updateUser'); // 내 정보 수정 화면으로 이동
      } else {
        Alert.alert('확인 실패', '비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      Alert.alert('오류', '비밀번호 확인 중 문제가 발생했습니다.');
    }
  };

  // 사용자 정보 업데이트 API 호출
  const updateUser = async () => {
    try {
      const response = await axios.post(`${API_URL}/updateUser`, userInfo);
      Alert.alert('정보 수정 성공', '사용자 정보가 성공적으로 수정되었습니다.');
    } catch (error) {
      console.error('정보 수정 실패:', error);
      Alert.alert('오류', '사용자 정보 수정에 실패했습니다.');
    }
  };

  // 탭에 따라 데이터를 가져오기
  useEffect(() => {
    if (activeTab === 'posts') {
      fetchMyPosts(page);
    } else if (activeTab === 'comments') {
      fetchMyComments();
    }
  }, [activeTab, page]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('BoardDetail', { boardSeq: item.boardSeq })}  // BoardDetail로 이동
      >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.photo }} 
          style={styles.image}
          onError={(e) => console.log('Image load error', e.nativeEvent.error)}  // 오류 로깅
        />
        <Text style={styles.statusOverlay}>{item.report}</Text>
      </View>
      <Text style={styles.breed}>{item.breedName}</Text>
      <Text>발견장소: {item.location}</Text> 
      <Text>실종날짜: {item.lostDate}</Text>
      </TouchableOpacity>
    </View>
  );

  // 탭에 따라 컨텐츠 렌더링
  const renderContent = () => {
    if (loading) {
      return <Text style={styles.loadingText}>로딩 중...</Text>;
    }

    if (activeTab === 'posts') {
      // 내가 쓴 글
      if (myPosts.length === 0) {
        return <Text style={styles.noActivityText}>내가 쓴 글이 없습니다.</Text>;
      }
      return (
        <FlatList
          data={myPosts}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.boardSeq}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={pageData.pageSize}
        />
      );
    } else if (activeTab === 'comments') {
      // 내가 쓴 댓글
      if (myComments.length === 0) {
        return <Text style={styles.noActivityText}>내가 쓴 댓글이 없습니다.</Text>;
      }
      return (
        <FlatList
          data={myComments}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.boardSeq}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={pageData.pageSize}
        />
      );
    } else if (activeTab === 'passwordCheck') {
      // 비밀번호 확인 화면
      return (
        <View>
          <Text style={styles.label}>비밀번호를 입력하세요:</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            placeholder="비밀번호"
          />
          <TouchableOpacity onPress={passwordCheck} style={styles.button}>
            <Text style={styles.buttonText}>확인</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (activeTab === 'updateUser') {
      // 내 정보 수정 화면 (비밀번호 확인 후 접근 가능)
      if (!isPasswordVerified) {
        return <Text style={styles.noActivityText}>비밀번호 확인이 필요합니다.</Text>;
      }
      return (
        <View>
          <Text>닉네임</Text>
          <TextInput
            style={styles.input}
            placeholder="닉네임"
            value={userInfo.nickName}
            onChangeText={(text) => setUserInfo({ ...userInfo, nickName: text })}
          />
          <Text>이메일</Text>
          <TextInput
            style={styles.input}
            placeholder="이메일"
            value={userInfo.mail}
            onChangeText={(text) => setUserInfo({ ...userInfo, mail: text })}
          />
          <TouchableOpacity onPress={updateUser} style={styles.button}>
            <Text style={styles.buttonText}>정보 수정</Text>
          </TouchableOpacity>
        </View>
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
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeText]}>내가 쓴 글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'comments' && styles.activeTab]}
          onPress={() => setActiveTab('comments')}
        >
          <Text style={[styles.tabText, activeTab === 'comments' && styles.activeText]}>내가 쓴 댓글</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'updateUser' && styles.activeTab]}
          onPress={() => {
            if (isPasswordVerified) {
              setActiveTab('updateUser'); // 비밀번호 확인 완료 시 바로 이동
            } else {
              setActiveTab('passwordCheck'); // 비밀번호 확인 화면으로 이동
            }
          }}
        >
          <Text style={[styles.tabText, activeTab === 'updateUser' && styles.activeText]}>내 정보 수정</Text>
        </TouchableOpacity>
      </View>

      {/* 컨텐츠 렌더링 */}
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  titleText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noActivityText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999999',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#c78c30',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default MyActivityScreen;
