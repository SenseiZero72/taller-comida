import { StyleSheet, Text, View } from 'react-native';

export default function FavoritesScreen() {

  return (
    <View style={[styles.container]}>
      <Text style={styles.text}>estas en la pagina Favorites</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
