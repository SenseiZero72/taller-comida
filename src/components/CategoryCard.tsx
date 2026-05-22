import { Pressable, Text, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type CategoryCardProps = {
  nombre: string;
  color: string;
  icono: string;
  onPress: () => void;
};

export default function CategoryCard({ nombre, color, icono, onPress }: CategoryCardProps) {
  return (
    <Pressable
      style={[styles.card, { backgroundColor: color }]}
      onPress={onPress}
    >
      <LinearGradient
        colors={['rgba(255,255,255,0.3)', 'transparent']}
        style={styles.gradientOverlay}
      />
      <View style={styles.contentContainer}>
        <Text style={styles.cardIcon}>{icono}</Text>
        <Text style={styles.cardText}>{nombre}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 140,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  cardIcon: {
    fontSize: 28,
    alignSelf: 'flex-end',
    opacity: 0.8,
  },
  cardText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '700',
  },
});
