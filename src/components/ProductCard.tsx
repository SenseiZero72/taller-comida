import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Producto } from '../services/openFoodFacts';
import ScoreBadge from './ScoreBadge';

interface ProductCardProps {
  item: Producto;
  onPress: () => void;
}

export default function ProductCard({ item, onPress }: ProductCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {item.imagen ? (
        <Image
          source={{ uri: item.imagen }}
          style={styles.productImage}
          contentFit="contain"
          transition={200}
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
      <View style={styles.cardContent}>
        <Text style={styles.productName} numberOfLines={2}>{item.nombre}</Text>
        <Text style={styles.brandName}>{item.marcas?.toUpperCase()}</Text>
        <View style={styles.badgesRow}>
          <ScoreBadge type="nutri-score" score={item.nutriScore} />
          <ScoreBadge type="eco-score" score={item.ecoScore} />
        </View>
      </View>
      <View style={styles.chevronContainer}>
        <Text style={styles.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#E9ECEF',
    marginRight: 16,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 16,
    backgroundColor: '#F8F9FA',
  },
  cardContent: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  brandName: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 8,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chevronContainer: {
    marginLeft: 8,
  },
  chevron: {
    fontSize: 24,
    color: '#CED4DA',
    lineHeight: 24,
  },
});
