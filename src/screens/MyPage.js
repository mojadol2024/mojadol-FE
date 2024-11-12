import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MyPageScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* 상단 오른쪽에 '나의 활동' 버튼 배치 */}
      <View style={styles.header}>
        <Text style={styles.greeting}>○○님 환영합니다!</Text>
        <TouchableOpacity
          style={styles.activityButton}
          onPress={() => navigation.navigate('MyActivity')}
        >
          <Text style={styles.activityButtonText}>나의 활동</Text>
        </TouchableOpacity>
      </View>

      {/* 아이콘 버튼 섹션 */}
      <View style={styles.iconContainer}>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>찜한 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>나의 등록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Text style={styles.iconText}>저장한 검색어</Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>마이메뉴</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Text>알림 설정</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>정보</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notice')}
        >
          <Text>공지사항</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text>자주하는 질문</Text></TouchableOpacity>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Inquiry')}
        >
          <Text>문의하기</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>기타</Text>
        <TouchableOpacity style={styles.menuItem}><Text>별점, 추천사 남기기</Text></TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}><Text>추천 60분 후원하기</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  activityButton: {
    padding: 10,
    backgroundColor: '#F5D5CB',
    borderRadius: 10,
  },
  activityButtonText: {
    fontSize: 14,
    color: '#000',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  iconButton: {
    width: '30%',
    padding: 10,
    backgroundColor: '#F5D5CB',
    alignItems: 'center',
    borderRadius: 10,
  },
  iconText: {
    fontSize: 14,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
});
