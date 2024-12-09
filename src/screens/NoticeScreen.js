import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ActivityIndicator } from 'react-native';

const notices = [
  { id: '1', title: '[공지] 공지사항 1', author: '관리자', date: '2022-11-06', content: '안녕하세요?\n공지사항 1 내용입니다.\n감사합니다.', image: require('../assets/logo.png') },
  { id: '2', title: '[공지] 공지사항 2 입니다.', author: '관리자', date: '2022-11-07', content: '공지사항 2 내용입니다.', image: require('../assets/logo.png') },
  { id: '3', title: '안녕하세요', author: '관리자', date: '2022-11-08', content: '안녕하세요?', image: require('../assets/logo.png') },
  { id: '4', title: '[공지] 테스트입니다.', author: '관리자', date: '2022-11-09', content: '안녕하세요?\n 추견 60분 공지사항 입니다.', image: require('../assets/logo.png') },
  { id: '5', title: '[공지] 공지사항', author: '관리자', date: '2022-11-10', content: '추견60분 공지사항 페이지 입니다.', image: require('../assets/logo.png') }
];

export default function NoticeScreen({ navigation }) {
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [noticesData, setNoticesData] = useState([]);

  useEffect(() => {
    // 로딩 상태만 관리
    const timer = setTimeout(() => {
      setNoticesData(notices); // 더미 데이터를 로드
      setLoading(false); // 로딩 완료
    }, 200); // 0.2초 로딩 시간

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 정리
  }, []);

  // renderItem 수정
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.row}
        onPress={() => navigation.navigate('NoticeDetailScreen', { noticeId: item.id })} // id를 전달하여 상세 페이지로 이동
      >
        <Text style={[styles.cell, styles.titleCell]}>{item.title}</Text>
        <Text style={[styles.cell, styles.authorCell]}>{item.author}</Text>
        <Text style={[styles.cell, styles.dateCell]}>{item.date}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>공지사항</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.headerTitleCell]}>제목</Text>
        <Text style={[styles.headerCell, styles.headerAuthorCell]}>글쓴이</Text>
        <Text style={[styles.headerCell, styles.headerDateCell]}>등록일</Text>
      </View>

      {/* 로딩 상태 표시 */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F1c0ba" />
          <Text>로딩 중...</Text>
        </View>
      ) : (
        <FlatList
          data={noticesData} // 더미 데이터 사용
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 2,
    borderBottomColor: '#F1c0ba',
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  headerTitleCell: {
    flex: 2, // 제목 칸을 넓게 조정
  },
  headerAuthorCell: {
    flex: 1, // 글쓴이 칸
  },
  headerDateCell: {
    flex: 1, // 날짜 칸
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
  },
  titleCell: {
    flex: 2, // 제목 칸을 더 넓게 설정
  },
  authorCell: {
    flex: 1, // 글쓴이 칸
  },
  dateCell: {
    flex: 1, // 날짜 칸
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});
