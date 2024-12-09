import axios from 'axios';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../components/BoardStyle';
import { configurePushNotification, requestNotificationPermission, getFCMToken, setUpBackgroundMessageListener } from '../utils/FCMUtils';

const Board = () => {
  const [province, setProvince] = useState('');
  const [breedName, setBreedName] = useState('');
  const [subLocationVisible, setSubLocationVisible] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pageData, setPageData] = useState(null);
  const navigation = useNavigation();

  const locations = [
    '전체','서울', '경기', '부산', '인천', '대구', '대전', '광주', 
    '울산', '강원', '경남', '전북', '충남', '경북', '전남', '충북', '제주'
  ];

  // 데이터 로드 함수
  const fetchBoardData = async (page, isSearch = false) => {
    if (loading || (pageData && page >= pageData.totalPages)) return;
    setLoading(true);

    const adjustedProvince = province === '전체' ? null : province;

    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const params = { page, breedName, province : adjustedProvince};
      const response = await axios.get(`${API_URL}/board/list`, {
        headers: { Authorization: `${accessToken}` },
        params: isSearch ? params : { page },
      });

      const data = response.data;
      setBoardData((prevData) => (page === 0 ? data.content : [...prevData, ...data.content]));
      setPageData(data.pagination);
    } catch (error) {
      console.error('Error fetching board list:', error);
    } finally {
      setLoading(false);
    }
  };

  // FCM 초기화 함수
  const initializeFCM = async () => {
    try {
      configurePushNotification();
      const hasPermission = await requestNotificationPermission();
      if (!hasPermission) {
        console.log('Notification permission denied');
        return;
      }

      const fcmToken = await getFCMToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);
      } else {
        console.warn('FCM token is null');
      }

      setUpBackgroundMessageListener();
    } catch (error) {
      console.error('FCM initialization error:', error);
    }
  };

  // 컴포넌트 마운트 및 페이지 변경 시 데이터 로드
  useEffect(() => {
    setProvince(locations[0]);
    fetchBoardData(page, breedName !== '' || province !== '');
    initializeFCM();
  }, [page]);

  // 포커스 시 데이터 초기화
  useFocusEffect(
    useCallback(() => {
      const refreshRoute = navigation.getState()?.routes.find((route) => route.params?.refresh);
      if (refreshRoute) {
        setBoardData([]);
        setPage(0);
        navigation.setParams({ refresh: false });
      }
    }, [navigation])
  );

  // 게시글 항목 렌더링
  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate('BoardDetail', { boardSeq: item.boardSeq })}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.photo }} style={styles.image} />
        </View>
        <Text>{item.report === 0 ? "실종" : item.report === 1 ? "제보" : item.report == null ? "정보 없음" : ""}</Text>
        <Text style={styles.breed}>{item.breedName}</Text>
        <Text>발견장소: {item.location}</Text>
        <Text>실종날짜: {item.lostDate}</Text>
      </TouchableOpacity>
    </View>
  );

  // 지역 선택
  const handleLocationPress = (locationName) => {
    setProvince(locationName);
    setSubLocationVisible(false);
  };

  // 검색
  const handleSearch = () => {
    // 기존 데이터를 초기화
    setBoardData([]);
    setPage(0);
  
    // 검색 조건에 따라 데이터를 새로 로드
    fetchBoardData(0, true);
  };

  // 무한 스크롤
  const handleLoadMore = () => {
    if (!loading && pageData && page < pageData.totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <View style={styles.container}>
      {/* 검색 영역 */}
      <View style={styles.searchContainer}>
        {/* 지역 선택 드롭다운 */}
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setSubLocationVisible(!subLocationVisible)}
        >
          <Text style={styles.locationText}>{province || "전체"}</Text>
        </TouchableOpacity>
  
        {subLocationVisible && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.scrollContainer}>
              {locations.map((location) => (
                <TouchableOpacity
                  key={location}
                  style={styles.dropdownItem}
                  onPress={() => handleLocationPress(location)}
                >
                  <Text style={styles.dropdownItemText}>{location}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
  
        {/* 검색창 */}
        <TextInput
          style={styles.searchInput}
          placeholder="견종 검색"
          value={breedName}
          onChangeText={setBreedName}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>검색</Text>
        </TouchableOpacity>
      </View>
      {/* 게시글 리스트 */}
      {boardData.length === 0 ? (
        <Text style={styles.noDataText}>게시글이 없습니다.</Text>
      ) : (
        <FlatList
          data={boardData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.boardSeq}`}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
        />
      )}
      {/* 로딩 중 */}
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      )}
    </View>
  
  );
};
export default Board;
