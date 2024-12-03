import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import styles from '../components/BoardStyle.js';
import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { requestNotificationPermission, 
  getFCMToken, 
  saveTokenToServer, 
  configurePushNotification, 
  setUpBackgroundMessageListener } from '../utils/FCMUtils';
  

const Board = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSubLocation, setSelectedSubLocation] = useState('');
  const [subLocationVisible, setSubLocationVisible] = useState(false);
  const [boardData, setBoardData] = useState([]);
  const [page, setPage] = useState(0);  // 현재 페이지
  const [loading, setLoading] = useState(false);  // 로딩 상태 관리
  const [pageData, setPageData] = useState(false);  // 로딩 상태 관리
  const navigation = useNavigation();

  const locations = [
    { name: '광주광역시', subLocations: ['동구', '서구', '남구', '북구', '광산구'] },
    { name: '대구광역시', subLocations: ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군']
    },
    { name: '대전광역시', subLocations: ['동구', '중구', '서구', '유성구', '대덕구'] },
    { name: '부산광역시', subLocations: ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'] },
    { name: '서울특별시', subLocations: ['종로구', '중구', '용산구', '성동구', '광진구', '동대문구', '중랑구', '성북구', '강북구', '도봉구', '노원구', '은평구', '서대문구', '마포구', '양천구', '강서구', '구로구', '금천구', '영등포구', '동작구', '관악구', '서초구', '강남구', '송파구', '강동구'] },
    { name: '울산광역시', subLocations: ['울주군', '남구', '동구', '북구', '중구'] },
    { name: '인천광역시', subLocations: ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'] },
    { name: '경기도', subLocations:  ['수원', '성남', '의정부', '안양', '부천', '광명', '평택', '동두천', '안산', '고양', '과천', '구리', '남양주', '오산', '시흥', '파주', '여주', '하남', '김포', '광주', '이천', '양평', '포천', '가평'] },
    { name: '강원도', subLocations: ['춘천', '원주', '강릉', '동해', '태백', '속초', '삼척', '홍천', '횡성', '영월', '평창', '정선', '철원', '화천', '양구', '인제', '고성'] },
    { name: '경상남도', subLocations: ['진주', '창원', '김해', '밀양', '통영', '사천', '거제', '양산', '함안', '창녕', '하동', '산청', '의령', '함양', '거창', '남해', '산청']
    },
    { name: '경상북도', subLocations: ['포항', '경주', '김천', '안동', '구미', '영주', '상주', '문경', '경산', '군위', '의성', '청송', '영양', '영덕', '청도', '고령', '성주', '칠곡', '예천', '봉화', '울진', '울릉'] },
    { name: '충청남도', subLocations: ['천안', '공주', '보령', '아산', '서산', '논산', '당진', '금산', '부여', '서천', '청양', '홍성', '예산', '태안'] },
    { name: '충청북도', subLocations: ['청주', '충주', '제천', '보은', '옥천', '영동', '증평', '진천', '괴산', '음성', '단양'] },
    { name: '전라북도', subLocations: ['목포', '여수', '순천', '광양', '나주', '담양', '곡성', '구례', '고흥', '보성', '화순', '장흥', '강진', '완도', '진도', '신안'] },
    { name: '전라남도', subLocations: ['전주', '군산', '익산', '정읍', '남원', '김제', '완주', '진안', '무주', '장수', '임실', '순창', '고창', '부안'] },
    { name: '제주도', subLocations: ['제주','서귀포'] },
    
  ];
  

  // 데이터 로딩 함수
  const loadBoardData = async (page) => {
    if (loading) return;
    try {
      setLoading(true);
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`${API_URL}/board/list?page=${page}`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });

      const data = response.data;

      // 새로운 데이터를 기존 데이터와 합쳐서 상태 업데이트
      setBoardData((prevData) => [...prevData, ...data.content]);
      setPageData(data.pagination)
      setLoading(false);
      console.log(data.content.map(item => item.photo));
    } catch (error) {
      console.error('Error fetching board list:', error);
      setLoading(false);
    }
  };
  

  // 최초 데이터 로딩
  useEffect(() => {
    loadBoardData(page);
    const initializeFCM = async () => {
      try {
        // 1. 알림 채널 설정 (Android 전용)
        configurePushNotification();

        // 2. 알림 권한 요청
        const hasPermission = await requestNotificationPermission();
        if (!hasPermission) {
          console.log('Notification permission denied');
          return;
        }

        // 3. FCM 토큰 가져오기
        const fcmToken = await getFCMToken();
        if (fcmToken) {
          console.log('FCM Token:', fcmToken);
        } else {
          console.warn('FCM token is null');
        }

        // 5. 백그라운드 및 종료 상태 알림 리스너 설정
        setUpBackgroundMessageListener();
      } catch (error) {
        console.error('FCM 초기화 중 오류 발생:', error);
      }
    };

    // FCM 초기화 함수 호출
    initializeFCM();
  }, [page]);


  // 리스트 아이템 렌더링
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

  // 스크롤 끝에 도달했을 때 호출되는 함수
  const handleLoadMore = () => {
    if (loading || (pageData && page >= pageData.totalPages)) return;
    setPage((prevPage) => prevPage + 1);
  };

  const handleLocationPress = (locationName) => {
    const location = locations.find((loc) => loc.name === locationName);

    if (location.subLocations.length > 0) {
      if (selectedLocation === locationName) {
        setSubLocationVisible(!subLocationVisible);
      } else {
        setSelectedLocation(locationName);
        setSubLocationVisible(true);
        setSelectedSubLocation('');
      }
    } else {
      setSelectedLocation(locationName);
      setSubLocationVisible(false);
    }
  };

  const handleSubLocationPress = (subLocation) => {
    setSelectedSubLocation(subLocation);
    setSubLocationVisible(false);
  };

  const handleResetLocation = () => {
    setSelectedLocation('');
    setSubLocationVisible(false);
    setSelectedSubLocation('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setSubLocationVisible(!subLocationVisible)}
        >
          <Text style={styles.locationText}>
            {selectedSubLocation ? selectedSubLocation : selectedLocation ? selectedLocation : '지역'}
          </Text>
        </TouchableOpacity>

        {!subLocationVisible && !selectedSubLocation && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.scrollContainer}>
              {locations.map((location, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownItem}
                  onPress={() => handleLocationPress(location.name)}
                >
                  <Text style={styles.dropdownItemText}>{location.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

{subLocationVisible && (
  <View style={styles.dropdown}>
    <ScrollView style={styles.scrollContainer}>
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={handleResetLocation}
      >
        <Text style={styles.dropdownItemText}>상위 지역</Text>
      </TouchableOpacity>

      {/* 반복문을 사용하여 지역별 서브로케이션을 처리 */}
      {['광주광역시',
  '대구광역시',
  '대전광역시',
  '부산광역시',
  '서울특별시',
  '울산광역시',
  '인천광역시',
  '경기도',
  '강원도',
  '경상남도',
  '경상북도',
  '충청남도',
  '충청북도',
  '전라북도',
  '전라남도',
  '제주도'].map((locationName) => {
        if (selectedLocation === locationName) {
          return locations
            .find((loc) => loc.name === locationName)
            .subLocations.map((subLocation, index) => (
              <TouchableOpacity
                key={index}
                style={styles.dropdownItem}
                onPress={() => handleSubLocationPress(subLocation)}
              >
                <Text style={styles.dropdownItemText}>{subLocation}</Text>
              </TouchableOpacity>
            ));
        }
        return null; // 조건에 맞지 않으면 아무것도 반환하지 않음
      })}
    </ScrollView>
  </View>
)}



        <TextInput style={styles.searchInput} placeholder="검색" />

        <TouchableOpacity style={styles.writeButton} onPress={() => navigation.navigate('DogRegistration')}>
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {boardData.length === 0 ? (
        <Text style={styles.noDataText}>게시글이 없습니다.</Text>
      ) : (
        <FlatList
          data={boardData}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.boardSeq}`}  // id와 breedName을 결합하여 고유한 key 생성
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.contentContainer}
          onEndReached={handleLoadMore}  // 리스트 끝에 도달 시 데이터 추가 로딩
          onEndReachedThreshold={0.5}
          initialNumToRender={pageData.pageSize}
        />

      )}

      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      )}
    </View>
  );
};

export default Board;