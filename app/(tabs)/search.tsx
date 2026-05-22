import { Image } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { PRODUCTOS } from '../../src/data/productos';

import ScoreBadge from '../../src/components/ScoreBadge';

export default function SearchScreen() {
  const { category, tag, marca } = useLocalSearchParams<{ category?: string, tag?: string, marca?: string }>();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const clearFilters = () => {
    setSearchQuery('');
    router.setParams({ category: '', tag: '', marca: '' });
  };

  const filteredProducts = PRODUCTOS.filter(product => {
    const matchesSearch = product.nombre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = category
      ? product.categoria.toLowerCase() === category.toLowerCase()
      : true;
    const matchesTag = tag
      ? product.tags && product.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      : true;
    const matchesMarca = marca
      ? product.marcas && product.marcas.toLowerCase() === marca.toLowerCase()
      : true;
    return matchesSearch && matchesCategory && matchesTag && matchesMarca;
  });

  const pageTitle = marca
    ? `Brand: ${marca.charAt(0).toUpperCase() + marca.slice(1)}`
    : tag
      ? `Tag: ${tag.charAt(0).toUpperCase() + tag.slice(1)}`
      : category
        ? category.charAt(0).toUpperCase() + category.slice(1)
        : 'Products';

  const renderProduct = ({ item }: { item: typeof PRODUCTOS[0] }) => (
    <Pressable style={styles.card} onPress={() => router.push(`/producto?id=${item.id}`)}>
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
        <Text style={styles.productName}>{item.nombre}</Text>
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

  return (
    <View style={[styles.container]}>
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>{pageTitle}</Text>
        {(category || tag || marca || searchQuery.length > 0) ? (
          <Pressable style={styles.clearButton} onPress={clearFilters}>
            <Text style={styles.clearButtonText}>X</Text>
          </Pressable>
        ) : null}
      </View>
      <Text style={styles.itemCount}>{filteredProducts.length} ITEMS FOUND</Text>

      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={[styles.listContainer]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#11181C',
  },
  clearButton: {
    backgroundColor: '#ff4d4f',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
  },
  itemCount: {
    fontSize: 12,
    color: '#687076',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F3F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 5,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
    color: '#999',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
  },
  listContainer: {
  },
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
