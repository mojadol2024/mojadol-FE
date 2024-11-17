import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useNavigation } from '@react-navigation/native';

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
    { name: '서울', subLocations: [] },
    { name: '부산', subLocations: [] },
    { name: '대구', subLocations: [] },
    { name: '광주', subLocations: [] },
    { name: '인천', subLocations: [] },
    { name: '경기도', subLocations: [] },
    { name: '충청북도', subLocations: [] },
    { name: '경상남도', subLocations: ['진주', '창원', '김해'] },
    { name: '경상북도', subLocations: [] },
    { name: '전라도', subLocations: [] },
  ];

  // 데이터 로딩 함수
  const loadBoardData = async (page) => {
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
    if (!loading) {
      setPage((prevPage) => prevPage + 1);  // 페이지 증가
    }
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

        {subLocationVisible && selectedLocation === '경상남도' && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.scrollContainer}>
              <TouchableOpacity
                style={styles.dropdownItem}
                onPress={handleResetLocation}
              >
                <Text style={styles.dropdownItemText}>상위 지역</Text>
              </TouchableOpacity>
              {locations
                .find((loc) => loc.name === '경상남도')
                .subLocations.map((subLocation, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => handleSubLocationPress(subLocation)}
                  >
                    <Text style={styles.dropdownItemText}>{subLocation}</Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        )}

        <TextInput style={styles.searchInput} placeholder="검색" />

        <TouchableOpacity style={styles.writeButton}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  locationContainer: {
    height: 25,
    width: '20%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    marginLeft: 10,
  },
  locationText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    left: '5%',
    width: '33%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    zIndex: 1,
    paddingVertical: 5,
    maxHeight: 200,
  },
  scrollContainer: {
    maxHeight: 200,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dropdownItemText: {
    fontSize: 18,
  },
  searchInput: {
    height: 30,
    width: '55%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
  },
  writeButton: {
    backgroundColor: '#008CBA',
    padding: 10,
    borderRadius: 10,
  },
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    padding: 10,
    marginLeft: '2%',
    marginRight: '2%',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    marginBottom: 5,
  },
  statusOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    color: 'white',
    padding: 5,
    borderRadius: 5,
  },
  breed: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#ccc',
    marginTop: 50,
  },
  columnWrapper: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
});

export default Board;
