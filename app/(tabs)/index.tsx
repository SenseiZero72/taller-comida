import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import BrandCard from '../../src/components/BrandCard';
import CategoryCard from '../../src/components/CategoryCard';
import TagBadge from '../../src/components/TagBadge';
import { CATEGORIAS } from '../../src/constants/categorias';
import { MARCAS } from '../../src/constants/marcas';
import { TAGS } from '../../src/constants/tags';

export default function IndexScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content]}>
      <Text style={styles.topLabel}>CURATED FLAVORS</Text>
      <Text style={styles.title}>
        The art of <Text style={styles.titleHighlight}>conscious</Text> discovery.
      </Text>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <Text style={styles.viewLibrary}>View Library</Text>
      </View>

      <View style={styles.grid}>
        {CATEGORIAS.map((item) => (
          <CategoryCard
            key={item.id}
            nombre={item.nombre}
            color={item.color}
            icono={item.icono}
            onPress={() => router.push({ pathname: '/search', params: { category: item.nombre } })}
          />
        ))}
      </View>

      <View style={[styles.sectionHeader, { marginTop: 32 }]}>
        <Text style={styles.sectionTitle}>Refine by Taste</Text>
      </View>

      <View style={styles.tagsContainer}>
        {TAGS.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            onPress={() => router.push({ pathname: '/search', params: { tag: tag } })}
          />
        ))}
      </View>

      <View style={[styles.sectionHeader, { marginTop: 32 }]}>
        <View>
          <Text style={styles.sectionTitle}>Global Brands</Text>
          <Text style={styles.sectionSubtitle}>Explored through the lens of quality</Text>
        </View>
      </View>

      <View style={styles.brandsGrid}>
        {MARCAS.map((marca) => (
          <BrandCard
            key={marca.id}
            nombre={marca.nombre}
            logoText={marca.logoText}
            logoColor={marca.logoColor}
            textColor={marca.textColor}
            onPress={() => router.push({ pathname: '/search', params: { marca: marca.nombre } })}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    padding: 20,
    paddingBottom: 80,
  },
  topLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#28884B',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#11181C',
    lineHeight: 38,
    marginBottom: 32,
  },
  titleHighlight: {
    color: '#28884B',
    fontStyle: 'italic',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202020',
  },
  viewLibrary: {
    fontSize: 12,
    color: '#28884B',
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#687076',
    marginTop: 4,
  },
  brandsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});