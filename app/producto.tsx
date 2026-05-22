import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PRODUCTOS } from '../src/data/productos';
import ScoreBadge from '../src/components/ScoreBadge';
import NutritionRow, { NutritionData } from '../src/components/NutritionRow';

const { width } = Dimensions.get('window');

export default function ProductoScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const product = PRODUCTOS.find(p => p.id === id) || PRODUCTOS[0];

    if (!product) return <View style={styles.container}><Text>Producto no encontrado</Text></View>;

    // Datos estáticos/placeholder para la tabla nutricional
    const nutritionValues: NutritionData[] = [
        { id: '1', label: 'Energy', value: '_ kcal / _ kJ' },
        { id: '2', label: 'Fat', value: '_ g' },
        { id: '3', label: 'saturates', value: '_ g', isSubItem: true },
        { id: '4', label: 'Carbohydrate', value: '_ g' },
        { id: '5', label: 'sugars', value: '_ g', isSubItem: true },
        { id: '6', label: 'Fibre', value: '_ g' },
        { id: '7', label: 'Protein', value: '_ g' },
        { id: '8', label: 'Salt', value: '_ g' },
    ];

    return (
        <View style={styles.mainContainer}>
            <Stack.Screen options={{ headerShown: false }} />
            
            {/* Fixed Top Header */}
            <SafeAreaView style={styles.headerSafeArea}>
                <View style={styles.topHeader}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#1E3932" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Digital Epicurean</Text>
                    <TouchableOpacity style={styles.iconButton}>
                        <Ionicons name="share-social-outline" size={24} color="#1E3932" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>

            <ScrollView style={styles.container} bounces={false} showsVerticalScrollIndicator={false}>
                {/* Image Area */}
                <View style={styles.imageContainer}>
                    <Image source={{ uri: product.imagen }} style={styles.productImage} resizeMode="contain" />

                <TouchableOpacity style={styles.favoriteButton}>
                    <Ionicons name="heart" size={24} color="#1E3932" />
                </TouchableOpacity>
            </View>

            {/* Content Area */}
            <View style={styles.contentContainer}>
                <Text style={styles.brand}>{product.marcas ? product.marcas.toUpperCase() : '_'}</Text>
                <Text style={styles.title}>{product.nombre || '_'}</Text>

                {/* Scores */}
                <View style={styles.scoresRow}>
                    <ScoreBadge type="nutri-score" score={product.nutriScore} variant="card" />
                    <ScoreBadge type="nova-group" score={product.novaGroup} variant="card" />
                    <ScoreBadge type="eco-score" score={product.ecoScore} variant="card" />
                </View>

                {/* Macros Highlights */}
                <View style={styles.macrosRow}>
                    <View style={styles.macroBox}>
                        <Text style={styles.macroLabel}>ENERGY</Text>
                        <Text style={styles.macroValue}>_ kJ</Text>
                    </View>
                    <View style={styles.macroBox}>
                        <Text style={styles.macroLabel}>FAT</Text>
                        <Text style={styles.macroValue}>_ g</Text>
                    </View>
                    <View style={styles.macroBox}>
                        <Text style={styles.macroLabel}>PROTEIN</Text>
                        <Text style={styles.macroValue}>_ g</Text>
                    </View>
                </View>

                {/* Ingredients and Allergens */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionHeader}>
                        <MaterialCommunityIcons name="food-apple" size={20} color="#1E3932" />
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                    </View>
                    <Text style={styles.bodyText}>_</Text>

                    {/* Allergen Info */}
                    <View style={styles.allergenBox}>
                        <Ionicons name="warning" size={20} color="#D32F2F" style={styles.allergenIcon} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.allergenTitle}>ALLERGEN INFORMATION</Text>
                            <Text style={styles.allergenText}>_</Text>
                        </View>
                    </View>
                </View>

                {/* Nutritional Values Table */}
                <View style={styles.nutritionTable}>
                    <Text style={styles.nutritionTableTitle}>Nutritional Values (per 100ml)</Text>
                    
                    {nutritionValues.map((item) => (
                        <NutritionRow key={item.id} item={item} />
                    ))}
                </View>

            </View>
            </ScrollView>
        </View>
    );
}



const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    container: {
        flex: 1,
        backgroundColor: '#F7F7F7',
    },
    headerSafeArea: {
        backgroundColor: '#FFF',
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
    },
    imageContainer: {
        height: 350,
        backgroundColor: '#F07D69',
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: '60%',
        height: '80%',
    },
    iconButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E3932',
    },
    favoriteButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#FFF',
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 10,
    },
    contentContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
        paddingTop: 30,
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    brand: {
        fontSize: 12,
        fontWeight: '700',
        color: '#4CAF50',
        letterSpacing: 1,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 20,
        lineHeight: 34,
    },
  scoresRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    macrosRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    macroBox: {
        backgroundColor: '#E8F5E9',
        borderRadius: 8,
        padding: 8,
        flex: 1,
        marginHorizontal: 4,
        alignItems: 'center',
    },
    macroLabel: {
        fontSize: 10,
        fontWeight: '600',
        color: '#4CAF50',
        marginBottom: 4,
    },
    macroValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#333',
    },
    sectionContainer: {
        backgroundColor: '#F5F5F5',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginLeft: 8,
    },
    bodyText: {
        fontSize: 14,
        color: '#555',
        lineHeight: 22,
        marginBottom: 16,
    },
    allergenBox: {
        backgroundColor: '#FFEBEE',
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    allergenIcon: {
        marginRight: 12,
        marginTop: 2,
    },
    allergenTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D32F2F',
        marginBottom: 4,
    },
    allergenText: {
        fontSize: 13,
        color: '#D32F2F',
    },
    nutritionTable: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#EFEFEF',
    },
    nutritionTableTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 8,
    },
});
