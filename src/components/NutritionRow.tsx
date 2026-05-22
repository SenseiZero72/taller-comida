import { View, Text, StyleSheet } from 'react-native';

export type NutritionData = {
  id: string;
  label: string;
  value: string;
  isSubItem?: boolean;
};

type NutritionRowProps = {
  item: NutritionData;
};

export default function NutritionRow({ item }: NutritionRowProps) {
  if (item.isSubItem) {
    return (
      <View style={styles.nutritionSubRow}>
        <Text style={styles.nutritionSubLabel}>— of which {item.label}</Text>
        <Text style={styles.nutritionSubValue}>{item.value}</Text>
      </View>
    );
  }

  return (
    <View style={styles.nutritionRow}>
      <Text style={styles.nutritionLabel}>{item.label}</Text>
      <Text style={styles.nutritionValue}>{item.value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nutritionSubRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingLeft: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  nutritionLabel: {
    fontSize: 14,
    color: '#333',
  },
  nutritionSubLabel: {
    fontSize: 13,
    color: '#777',
    fontStyle: 'italic',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  nutritionSubValue: {
    fontSize: 13,
    fontWeight: '500',
    color: '#555',
  },
});
