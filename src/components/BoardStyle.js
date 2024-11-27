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

export default styles;
