
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  h1: {
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  audioItem: {
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20
  },
  recordButton: {
    padding: 20,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20
  },
  recordButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  resultText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333'
  },
  loader: {
    marginVertical: 20
  },
});
