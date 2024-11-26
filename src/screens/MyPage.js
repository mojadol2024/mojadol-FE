import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function MyPageScreen({ navigation }) {
  // 닉네임 상태 생성
  const [nickname, setNickname] = useState('닉네임ㅇㅇ1');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>{nickname}</Text>
      </View>

      {/* 메뉴 섹션 */}
      <View style={styles.menuContainer}>
        <Text style={styles.menuTitle}>마이메뉴</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('MyActivity')}
        >
          <Text style={styles.menuItemText}>나의 활동</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('EditProfileScreen')}
        >
          <Text style={styles.menuItemText}>회원 정보 수정</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('NotificationSettings')}
        >
          <Text style={styles.menuItemText}>알림 설정</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>정보</Text>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Notice')}
        >
          <Text style={styles.menuItemText}>공지사항</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => navigation.navigate('Inquiry')}
        >
          <Text style={styles.menuItemText}>문의하기</Text>
        </TouchableOpacity>

        <Text style={styles.menuTitle}>기타</Text>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>별점, 추천사 남기기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>추천 60분 후원하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuContainer: {
    marginTop: 15,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#c78c30',
    paddingVertical: 10,
    borderBottomWidth: 3,
    borderBottomColor: '#C78c30',
  },
  menuItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  menuItemText: {
    fontSize: 14,
    color: '#000000',
  },
});
