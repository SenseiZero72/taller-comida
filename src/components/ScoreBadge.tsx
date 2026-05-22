import { View, Text, StyleSheet } from 'react-native';

export type ScoreType = 'nutri-score' | 'eco-score' | 'nova-group';

type ScoreBadgeProps = {
  type: ScoreType;
  score?: string | number;
  variant?: 'pill' | 'card';
};

const getScoreStyles = (type: ScoreType, score: string | number) => {
  if (type === 'nutri-score') {
    const s = String(score).toUpperCase();
    let bg = '#999999';
    if (s === 'A') bg = '#038141';
    else if (s === 'B') bg = '#85BB2F';
    else if (s === 'C') bg = '#FECB02';
    else if (s === 'D') bg = '#EE8100';
    else if (s === 'E') bg = '#E63E11';
    return { backgroundColor: bg, color: 'white', label: 'NUTRI-SCORE' };
  }
  
  if (type === 'eco-score') {
    return { backgroundColor: '#C3E8C1', color: '#28884B', label: 'ECO-SCORE' };
  }

  if (type === 'nova-group') {
    const s = String(score);
    let bg = '#FFD700';
    if (s === '1') bg = '#038141';
    else if (s === '2') bg = '#FECB02';
    else if (s === '3') bg = '#EE8100';
    else if (s === '4') bg = '#E63E11';
    return { backgroundColor: bg, color: '#000', label: 'NOVA GROUP' };
  }

  return { backgroundColor: '#999999', color: 'white', label: type.toUpperCase() };
};

export default function ScoreBadge({ type, score, variant = 'pill' }: ScoreBadgeProps) {
  if (score === undefined || score === null || score === '') return null;

  const { backgroundColor, color, label } = getScoreStyles(type, score);

  if (variant === 'card') {
    return (
      <View style={styles.cardBox}>
        <Text style={styles.cardLabel}>{label}</Text>
        <View style={[styles.cardValueBox, { backgroundColor }]}>
          <Text style={[styles.cardValueText, { color }]}>{score}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.badgeText, { color }]}>
        {label} {score}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  cardBox: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  cardValueBox: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 8,
  },
  cardValueText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
