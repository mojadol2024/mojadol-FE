import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const inquiries = []; // 예제 데이터를 위한 빈 배열. 실제 데이터는 서버나 상태 관리에서 불러올 수 있습니다.

const InquiryList = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>1:1 문의</Text>

      {/* "전체" 버튼 */}
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>전체</Text>
        </TouchableOpacity>
      </View>

      {/* 문의 목록 */}
      <FlatList
        data={inquiries}
        ListEmptyComponent={<Text style={styles.emptyMessage}>게시물이 없습니다.</Text>}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>번호: {item.id}</Text>
            <Text style={styles.itemText}>제목: {item.title}</Text>
            <Text style={styles.itemText}>작성일: {item.date}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      {/* 문의 등록 버튼 */}
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('Inquiry')}
      >
        <Text style={styles.registerButtonText}>문의 등록</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 20, // 좌우 여백을 추가하여 버튼을 더 넓게 만듭니다
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyMessage: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  item: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  itemText: {
    fontSize: 16,
  },
  registerButton: {
    padding: 15,
    backgroundColor: '#1A73E8',
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default InquiryList;
