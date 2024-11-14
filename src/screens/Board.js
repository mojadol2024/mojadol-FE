import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Board = () => {
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedSubLocation, setSelectedSubLocation] = useState('');
  const [subLocationVisible, setSubLocationVisible] = useState(false); // 하위 지역 표시 여부
  const [boardData, setBoardData] = useState([]);

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

  const boardList = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const response = await axios.get(`http://172.21.14.86:3000/board/list`, {
        headers: {
          Authorization: `${accessToken}`,
        },
      });
      const data = response.data;
      console.log('Board list:', data);
      setBoardData(data);
    }catch(error){
    console.error('Error fetching board list:', error);
    }
  };

  useEffect(() => {
    boardList();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image }} style={styles.image} />
        {/* 상태 텍스트를 이미지의 왼쪽 상단에 위치시키기 */}
        <Text style={styles.statusOverlay}>{item.report}</Text>
      </View>
      <Text style={styles.breed}>{item.breedName}</Text> 
      <Text>발견장소: {item.dogGender}</Text>  {/* gender를 location으로*/}
      <Text>실종날짜: {item.lostDate}</Text>
    </View>
  );


  const handleLocationPress = (locationName) => {
    const location = locations.find((loc) => loc.name === locationName);

    if (location.subLocations.length > 0) {
      // 하위 지역이 있을 경우
      if (selectedLocation === locationName) {
        setSubLocationVisible(!subLocationVisible); // 이미 선택된 상위 지역을 클릭하면 하위 지역을 토글
      } else {
        setSelectedLocation(locationName);
        setSubLocationVisible(true); // 새로운 상위 지역 선택 시 하위 지역 표시
        setSelectedSubLocation(''); // 하위 지역 초기화
      }
    } else {
      // 하위 지역이 없는 경우
      setSelectedLocation(locationName); // 상위 지역만 선택
      setSubLocationVisible(false); // 하위 지역 숨기기
    }
  };

  const handleSubLocationPress = (subLocation) => {
    setSelectedSubLocation(subLocation);
    setSubLocationVisible(false); // 하위 지역 선택 후 상위 지역을 숨김
  };

  const handleResetLocation = () => {
    // 경상남도를 클릭하면 상위 지역 드롭다운을 다시 표시
    setSelectedLocation('');
    setSubLocationVisible(false);
    setSelectedSubLocation('');
  };

  return (
    <View style={styles.container}>
      {/* 지역, 검색바, 글쓰기 버튼 */}
      <View style={styles.searchContainer}>
        {/* 지역 선택 버튼 */}
        <TouchableOpacity
          style={styles.locationContainer}
          onPress={() => setSubLocationVisible(!subLocationVisible)}
        >
          <Text style={styles.locationText}>
            {selectedSubLocation ? selectedSubLocation : selectedLocation ? selectedLocation : '지역'}
          </Text>
        </TouchableOpacity>

        {/* 상위 지역 드롭다운 */}
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

        {/* 하위 지역 드롭다운 */}
        {subLocationVisible && selectedLocation === '경상남도' && (
          <View style={styles.dropdown}>
            <ScrollView style={styles.scrollContainer}>
              {/* 상위 지역으로 돌아가기 버튼을 하위 지역 첫 번째 항목으로 추가 */}
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

        {/* 검색창 */}
        <TextInput style={styles.searchInput} placeholder="검색" />

        {/* 글쓰기 버튼 */}
        <TouchableOpacity style={styles.writeButton}>
          <Text style={styles.writeButtonText}>글쓰기</Text>
        </TouchableOpacity>
      </View>

      {/* FlatList 컴포넌트 */}
      <FlatList
        data={boardData}
        renderItem={renderItem}
        keyExtractor={(item) => item.nickName}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.contentContainer}
      />
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
    top: 50, // 지역 버튼 바로 아래에 위치하도록 설정
    left: '5%',
    width: '33%', // 드롭다운 가로 길이 1/3로 설정
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    zIndex: 1,
    paddingVertical: 5,
    maxHeight: 200, // 드롭다운의 최대 높이 설정
  },
  scrollContainer: {
    maxHeight: 200, // 드롭다운 최대 높이 설정
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
  height: 30, // 크기는 그대로 유지
  width: '40%', // 크기 그대로
  borderWidth: 2, // 테두리 두께를 약간 두껍게
  borderRadius: 15, // 모서리 둥글게 처리
  paddingHorizontal: 10, // 좌우 여백
  paddingVertical: 5, // 상하 여백
  textAlign: 'center', // 텍스트 중앙 정렬
  fontSize: 14, // 텍스트 크기 적당히 설정
  backgroundColor: '#f4f7fb', // 밝은 배경 색상으로 깨끗한 느낌
  color: '#3498db', // 텍스트 색상 파란색으로 강조
  placeholderTextColor: '#aaa', // placeholder 텍스트 색상 회색
  borderColor: '#ddd', // 테두리 색상 밝은 회색
  shadowColor: '#aaa', // 그림자 색상
  shadowOffset: { width: 0, height: 3 }, // 그림자 위치
  shadowOpacity: 0.2, // 그림자 투명도
  shadowRadius: 5, // 그림자 크기
  elevation: 3, // 안드로이드에서 그림자 효과
},

writeButton: {
  height: 30, // 버튼 높이 유지
  width: '25%', // 버튼 너비 유지
  backgroundColor: '#FFFFFF', // 따뜻한 베이지색
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 25, // 부드러운 둥근 모서리
  elevation: 4, // 입체적인 그림자 효과
  shadowColor: '#000', // 그림자 색상
  shadowOffset: { width: 0, height: 2 }, // 그림자 위치
  shadowOpacity: 0.15, // 그림자 투명도
  shadowRadius: 6, // 그림자 반경
  paddingHorizontal: 20, // 좌우 여백
  paddingVertical: 5, // 상하 여백
},

writeButtonText: {
  color: '#666', // 텍스트 색상 검은색
  fontSize: 16, // 텍스트 크기
  fontWeight: 'bold', // 텍스트 강조
  textTransform: 'uppercase', // 대문자로 텍스트 변환
},

  card: {
    width: '48%',
    backgroundColor: '#fff',
    padding: 10,
    margin: 5,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 110,
    borderRadius: 10,
  },
  image: {
    height: 110,
    width: '100%',
    borderRadius: 10,
  },
  statusOverlay: {
    position: 'absolute',
    top: 10,
    left: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  breed: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10, // 카드 간 간격을 띄우기 위한 margin 설정
  },
  contentContainer: {
    paddingBottom: 20,
  },
  resetButton: {
    marginTop: 10,
    alignItems: 'center',
    backgroundColor: '#FF6347',
    paddingVertical: 5,
    borderRadius: 10,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Board;
