import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';

const noticeList = [
  { id: '1', title: '[공지] 공지사항 1', author: '관리자', date: '2022-11-06', content: '안녕하세요?\n공지사항 1 내용입니다.\n감사합니다.', image: require('../assets/logo.png') },
  { id: '2', title: '[공지] 공지사항 2 입니다.', author: '관리자', date: '2022-11-07', content: '공지사항 2 내용입니다.', image: require('../assets/logo.png') },
  { id: '3', title: '안녕하세요', author: '관리자', date: '2022-11-08', content: '안녕하세요?', image: require('../assets/logo.png') },
  { id: '4', title: '[공지] 테스트입니다.', author: '관리자', date: '2022-11-09', content: '안녕하세요?\n 추견 60분 공지사항 입니다.', image: require('../assets/logo.png') },
  { id: '5', title: '[공지] 공지사항', author: '관리자', date: '2022-11-10', content: '추견60분 공지사항 페이지 입니다.', image: require('../assets/logo.png') }
];

export default function NoticeDetailScreen({ route, navigation }) {
  const { noticeId } = route.params; // 전달받은 noticeId
  const [loading, setLoading] = useState(true);

  // 선택된 공지사항 데이터 가져오기
  const noticeData = noticeList.find((item) => item.id === noticeId);

  // 이전 글, 다음 글 찾기
  const currentIndex = noticeList.findIndex((item) => item.id === noticeId);
  const prevNotice = currentIndex > 0 ? noticeList[currentIndex - 1] : null;
  const nextNotice = currentIndex < noticeList.length - 1 ? noticeList[currentIndex + 1] : null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#F1c0ba" />
        <Text>로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{noticeData.title}</Text>
      <Text style={styles.info}>작성자: {noticeData.author}</Text>
      <Text style={styles.info}>등록일: {noticeData.date}</Text>

      {/* 공지사항 내용 */}
      <ScrollView style={styles.contentContainer}>
        <Image source={noticeData.image} style={styles.image} />
        <Text style={styles.content}>{noticeData.content}</Text>
      </ScrollView>

      {/* 이전 글 / 뒤로 가기 / 다음 글 버튼 */}
      <View style={styles.navigationButtonsContainer}>
        <TouchableOpacity
          style={[styles.navigationButton, !prevNotice && styles.disabledButton]} // 이전 글 없으면 비활성화
          onPress={() => prevNotice && navigation.navigate('NoticeDetailScreen', { noticeId: prevNotice.id })}
          disabled={!prevNotice} // prevNotice가 없으면 클릭 불가능
        >
          <Text style={styles.navigationButtonText}>이전 글</Text>
        </TouchableOpacity>

        {/* 뒤로 가기 버튼 수정 */}
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('NoticeScreen')}>
          <Text style={styles.backButtonText}>목록</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navigationButton, styles.nextButton, !nextNotice && styles.disabledButton]} // 다음 글 없으면 비활성화
          onPress={() => nextNotice && navigation.navigate('NoticeDetailScreen', { noticeId: nextNotice.id })}
          disabled={!nextNotice} // nextNotice가 없으면 클릭 불가능
        >
          <Text style={styles.navigationButtonText}>다음 글</Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  contentContainer: {
    marginTop: 10,
    marginBottom: 10,
    borderTopWidth: 3,
    borderTopColor: '#F1c0ba',
    paddingVertical: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navigationButton: {
    backgroundColor: '#F1c0ba',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 22.375,
    flex: 1, // 버튼이 가로로 고정되도록 합니다.
    marginBottom: 10,
  },
  nextButton: {
    marginLeft: 0, // "다음 글" 버튼과 이전 버튼 간 간격
  },
  disabledButton: {
    backgroundColor: '#DDDDDD', // 비활성화된 버튼의 색상
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center', // 텍스트 가운데 정렬
  },
  navigationButtonsContainer: {
    flexDirection: 'row', // 세 개의 버튼을 한 줄에 배치
    justifyContent: 'space-between', // 버튼들이 양쪽 끝에 배치되도록
    marginTop: 20,
  },
  // 뒤로가기 버튼 스타일 추가
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 70, // 버튼 사이 간격
  },
  backButtonText: {
    fontSize: 16,
    color: '#ccc', // 텍스트 색상
    fontWeight: 'bold', // 글자 강조
  },
});
