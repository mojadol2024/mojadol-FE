import { StyleSheet } from 'react-native';

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
  locationText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#333',
  },
  dropdown: {
    position: 'absolute',
    top: -40,
    left: '0%',
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
    height: 40,
    width: '55%',
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius: 22.375,
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    marginTop: -120,
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // 그림자의 위치
    shadowOpacity: 0.1, // 그림자의 투명도
    shadowRadius: 8, // 그림자의 퍼짐 정도
    elevation: 5, // 안드로이드에서의 그림자 효과
  },
  locationContainer: {
    height: 40,
    width: '21.5%',
    borderColor: 'gray',
    borderWidth: 0,
    borderRadius:22.375,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#f1c0ba',
    marginTop: -120,
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 4 }, // 그림자의 위치
    shadowOpacity: 0.1, // 그림자의 투명도
    shadowRadius: 8, // 그림자의 퍼짐 정도
    elevation: 5, // 안드로이드에서의 그림자 효과
  },
  
  writeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  card: {
    width: '45%',
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 22.375,
    padding: 10,
    marginLeft: '2%',
    marginRight: '2%',
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 6 }, // 그림자 오프셋을 더 크게 설정하여 입체감 증가
    shadowOpacity: 0.5, // 그림자 투명도를 조금 더 높여서 더 강한 그림자 효과
    shadowRadius: 5, // 그림자 확산 정도를 늘려서 더 부드럽고 넓은 그림자
    elevation: 10, // Android 그림자 강도를 증가시켜 더 두드러진 그림자
  },
  imageContainer: {
    borderRadius: 10,
    overflow: 'hidden', // 이미지를 박스에 맞추어 자르기
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
  textContainer: {
    padding: 10,
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
  buttonPrimary: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#666',
  },
  bannerAdContainer: {
    width: '100%',
    height: 60,
    maxWidth: 600,
    marginBottom: 10,
  },
  searchButton: {
    height: 40,
    width: 70,
    marginTop: -120,
    borderRadius: 22.375,
    backgroundColor: '#f1c0ba', // 검색 버튼 배경색
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000', // 그림자 색상
    shadowOffset: { width: 0, height: 8 }, // 그림자의 위치를 아래로 조금 더 많이 이동
    shadowOpacity: 0.3, // 그림자의 투명도 증가
    shadowRadius: 10, // 그림자 퍼짐 정도 증가
    elevation: 10, // 안드로이드에서의 그림자 강도를 증가

  },
  searchButtonText: {
    color: '#000', // 글자 색상
    fontWeight: '100', // 글자를 굵게
    fontSize: 13, // 글자 크기
  },
});

export default styles;
