import { Pressable, Text, StyleSheet } from 'react-native';

type TagBadgeProps = {
  tag: string;
  onPress: () => void;
};

export default function TagBadge({ tag, onPress }: TagBadgeProps) {
  return (
    <Pressable style={styles.tagBadge} onPress={onPress}>
      <Text style={styles.tagText}>{tag}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tagBadge: {
    backgroundColor: '#EAEAEA',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 12,
    color: '#333333',
    fontWeight: '600',
  },
});
