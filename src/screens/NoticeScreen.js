import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

const notices = [
  { id: '61', title: '[공지] 공지사항입니다.', author: 'admin01', date: '2022-11-06' },
  { id: '41', title: '하이', author: 'admin01', date: '2022-10-17' },
  { id: '23', title: '안녕하세요 클래스', author: 'admin01', date: '2022-10-17' },
  { id: '22', title: '[공지사항] 테스트입니다.', author: 'admin01', date: '2022-10-16' },
  { id: '21', title: '관리자 테스트22', author: 'admin01', date: '2022-10-16' },
];

export default function NoticeScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.id}</Text>
      <Text style={styles.cell}>{item.title}</Text>
      <Text style={styles.cell}>{item.author}</Text>
      <Text style={styles.cell}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>공지사항</Text>

      {/* Table Header */}
      <View style={styles.headerRow}>
        <Text style={styles.headerCell}>번호</Text>
        <Text style={styles.headerCell}>제목</Text>
        <Text style={styles.headerCell}>글쓴이</Text>
        <Text style={styles.headerCell}>등록일</Text>
      </View>

      {/* Notice List */}
      <FlatList
        data={notices}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />

      {/* 작성하기 버튼 */}
      <TouchableOpacity
        style={styles.writeButton}
        onPress={() => navigation.navigate('NoticeWrite')}
      >
        <Text style={styles.writeButtonText}>작성하기</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A73E8', // 제목 색상
    marginBottom: 20,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    paddingVertical: 10,
    backgroundColor: '#F5F5F5',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
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
  writeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#1A73E8', // 버튼 색상
    borderRadius: 5,
    alignItems: 'center',
    alignSelf: 'flex-end', // 오른쪽 아래에 배치
  },
  writeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
