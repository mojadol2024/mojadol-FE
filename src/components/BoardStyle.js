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
  locationContainer: {
    height: 40,
    width: '21.5%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 23.375,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    backgroundColor: '#f9f9f9',
    marginLeft: 10,
  },
  locationText: {
    fontSize: 14,
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
    height: 40,
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
});

export default styles;
