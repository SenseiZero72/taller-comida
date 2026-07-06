import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getProductByCode, Producto } from '../src/services/openFoodFacts';
import ScoreBadge from '../src/components/ScoreBadge';
import NutritionRow, { NutritionData } from '../src/components/NutritionRow';

const { width } = Dimensions.get('window');

export default function ProductoScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const [product, setProduct] = useState<Producto | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let active = true;
        const fetchProduct = async () => {
            if (!id) {
                setError('ID/Código de producto no válido');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                const data = await getProductByCode(id);
                if (active) {
                    if (data) {
                        setProduct(data);
                    } else {
                        setError('Producto no encontrado en la base de datos de Open Food Facts');
                    }
                }
            } catch (err) {
                if (active) {
                    setError('Error al obtener la información. Revisa tu conexión de red.');
                }
            } finally {
                if (active) {
                    setIsLoading(false);
                }
            }
        };

        fetchProduct();
        return () => {
            active = false;
        };
    }, [id]);

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <Stack.Screen options={{ headerShown: false }} />
                <ActivityIndicator size="large" color="#1E3932" />
                <Text style={styles.loadingText}>Obteniendo datos de Open Food Facts...</Text>
            </View>
        );
    }

    if (error || !product) {
        return (
            <View style={styles.centered}>
                <Stack.Screen options={{ headerShown: false }} />
                <Ionicons name="alert-circle" size={48} color="#D32F2F" />
                <Text style={styles.errorText}>{error || 'Producto no encontrado'}</Text>
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const formatValue = (val: number | undefined, unit: string = 'g') => {
        return val !== undefined ? `${val.toFixed(1)} ${unit}` : 'No disponible';
    };

    const getEnergyString = () => {
        const kcal = product.nutrientes?.energiaKcal;
        const kj = product.nutrientes?.energiaKj;
        if (kcal !== undefined && kj !== undefined) {
            return `${kcal.toFixed(0)} kcal / ${kj.toFixed(0)} kJ`;
        }
        if (kcal !== undefined) return `${kcal.toFixed(0)} kcal`;
        if (kj !== undefined) return `${kj.toFixed(0)} kJ`;
        return 'No disponible';
    };

    // Construcción de la tabla nutricional dinámica
    const nutritionValues: NutritionData[] = [
        { id: '1', label: 'Energy', value: getEnergyString() },
        { id: '2', label: 'Fat', value: formatValue(product.nutrientes?.grasas) },
        { id: '3', label: 'saturates', value: formatValue(product.nutrientes?.grasasSaturadas), isSubItem: true },
        { id: '4', label: 'Carbohydrate', value: formatValue(product.nutrientes?.carbohidratos) },
        { id: '5', label: 'sugars', value: formatValue(product.nutrientes?.azucares), isSubItem: true },
        { id: '6', label: 'Fibre', value: formatValue(product.nutrientes?.fibra) },
        { id: '7', label: 'Protein', value: formatValue(product.nutrientes?.proteinas) },
        { id: '8', label: 'Salt', value: formatValue(product.nutrientes?.sal) },
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
                    {product.imagen ? (
                        <Image source={{ uri: product.imagen }} style={styles.productImage} resizeMode="contain" />
                    ) : (
                        <View style={styles.imagePlaceholder}>
                            <MaterialCommunityIcons name="food-fork-drink" size={64} color="#FFF" />
                        </View>
                    )}

                    <TouchableOpacity style={styles.favoriteButton}>
                        <Ionicons name="heart" size={24} color="#1E3932" />
                    </TouchableOpacity>
                </View>

                {/* Content Area */}
                <View style={styles.contentContainer}>
                    <Text style={styles.brand}>{product.marcas ? product.marcas.toUpperCase() : 'MARCA DESCONOCIDA'}</Text>
                    <Text style={styles.title}>{product.nombre}</Text>

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
                            <Text style={styles.macroValue}>
                                {product.nutrientes?.energiaKcal !== undefined 
                                    ? `${product.nutrientes.energiaKcal.toFixed(0)} kcal` 
                                    : '_'}
                            </Text>
                        </View>
                        <View style={styles.macroBox}>
                            <Text style={styles.macroLabel}>FAT</Text>
                            <Text style={styles.macroValue}>
                                {product.nutrientes?.grasas !== undefined 
                                    ? `${product.nutrientes.grasas.toFixed(1)} g` 
                                    : '_'}
                            </Text>
                        </View>
                        <View style={styles.macroBox}>
                            <Text style={styles.macroLabel}>PROTEIN</Text>
                            <Text style={styles.macroValue}>
                                {product.nutrientes?.proteinas !== undefined 
                                    ? `${product.nutrientes.proteinas.toFixed(1)} g` 
                                    : '_'}
                            </Text>
                        </View>
                    </View>

                    {/* Ingredients and Allergens */}
                    <View style={styles.sectionContainer}>
                        <View style={styles.sectionHeader}>
                            <MaterialCommunityIcons name="food-apple" size={20} color="#1E3932" />
                            <Text style={styles.sectionTitle}>Ingredients</Text>
                        </View>
                        <Text style={styles.bodyText}>{product.ingredientes}</Text>

                        {/* Allergen Info */}
                        <View style={styles.allergenBox}>
                            <Ionicons name="warning" size={20} color="#D32F2F" style={styles.allergenIcon} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.allergenTitle}>ALLERGEN INFORMATION</Text>
                                <Text style={styles.allergenText}>{product.alergenos}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Nutritional Values Table */}
                    <View style={styles.nutritionTable}>
                        <Text style={styles.nutritionTableTitle}>Nutritional Values (per 100g)</Text>
                        
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
    imagePlaceholder: {
        width: '60%',
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
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
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: '#FFF',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#687076',
    },
    errorText: {
        fontSize: 16,
        color: '#D32F2F',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    backButton: {
        backgroundColor: '#1E3932',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    backButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});;
