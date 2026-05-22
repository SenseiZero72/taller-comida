import { Pressable, View, Text, StyleSheet } from 'react-native';

type BrandCardProps = {
  nombre: string;
  logoText: string;
  logoColor: string;
  textColor: string;
  onPress: () => void;
};

export default function BrandCard({ nombre, logoText, logoColor, textColor, onPress }: BrandCardProps) {
  return (
    <Pressable style={styles.brandCard} onPress={onPress}>
      <View style={[styles.brandCircle, { backgroundColor: logoColor }]}>
        <Text
          style={[styles.brandCircleText, { color: textColor }]}
          adjustsFontSizeToFit
          numberOfLines={1}
        >
          {logoText}
        </Text>
      </View>
      <Text style={styles.brandNameText}>{nombre}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  brandCard: {
    width: '48%',
    backgroundColor: '#F1F3F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  brandCircleText: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    textAlign: 'center',
  },
  brandNameText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#11181C',
  },
});
