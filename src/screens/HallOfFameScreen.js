import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getHallOfFame } from '../services/localStorage';
import { AppConstants } from '../utils/constants';

export default function HallOfFameScreen() {
  const [hallOfFame, setHallOfFame] = useState(null);

  useEffect(() => {
    loadHallOfFame();
    const interval = setInterval(loadHallOfFame, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, []);

  const loadHallOfFame = async () => {
    const hof = await getHallOfFame();
    setHallOfFame(hof);
  };

  const getCategoryName = (categoryId) => {
    const category = AppConstants.categories.find(c => c.id === categoryId);
    return category ? category.name : '기타';
  };

  const getCategoryIcon = (categoryId) => {
    const category = AppConstants.categories.find(c => c.id === categoryId);
    return category ? category.icon : '🤔';
  };

  if (!hallOfFame) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>🏆</Text>
          <Text style={styles.emptyText}>오늘의 명예의 전당이 아직 없습니다</Text>
          <Text style={styles.emptySubtext}>투표가 많이 모이면 여기에 표시됩니다!</Text>
        </View>
      </ScrollView>
    );
  }

  const totalVotes = hallOfFame.totalVotes || 0;
  const votesA = hallOfFame.votesA || 0;
  const votesB = hallOfFame.votesB || 0;
  const percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0;
  const percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0;
  const voteRate = Math.max(percentageA, percentageB);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 명예의 전당 헤더 */}
      <LinearGradient
        colors={['#fbbf24', '#f59e0b']}
        style={styles.headerCard}
      >
        <Text style={styles.headerIcon}>🏆</Text>
        <Text style={styles.headerTitle}>명예의 전당</Text>
        <Text style={styles.headerSubtitle}>오늘의 최고 질문</Text>
      </LinearGradient>

      {/* 질문 카드 */}
      <View style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryIcon}>
              {getCategoryIcon(hallOfFame.category)}
            </Text>
            <Text style={styles.categoryText}>
              {getCategoryName(hallOfFame.category)}
            </Text>
          </View>
          <View style={styles.rateBadge}>
            <Text style={styles.rateText}>{voteRate.toFixed(1)}%</Text>
          </View>
        </View>
        <Text style={styles.questionText}>{hallOfFame.text}</Text>
        
        {/* 인증 사진 */}
        {hallOfFame.verificationImage && (
          <View style={styles.imageContainer}>
            <Image 
              source={{ uri: hallOfFame.verificationImage }} 
              style={styles.hallImage}
              resizeMode="cover"
            />
            {hallOfFame.verified && (
              <View style={styles.verifiedOverlay}>
                <Text style={styles.verifiedText}>✓ 인증됨</Text>
              </View>
            )}
          </View>
        )}

        {/* 결과 */}
        <View style={styles.resultContainer}>
          <View style={styles.resultItem}>
            <Text style={styles.resultOption}>{hallOfFame.optionA}</Text>
            <Text style={styles.resultPercentage}>{percentageA.toFixed(1)}%</Text>
            <Text style={styles.resultVotes}>({votesA}표)</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultOption}>{hallOfFame.optionB}</Text>
            <Text style={styles.resultPercentage}>{percentageB.toFixed(1)}%</Text>
            <Text style={styles.resultVotes}>({votesB}표)</Text>
          </View>
        </View>

        <View style={styles.totalVotesContainer}>
          <Text style={styles.totalVotesText}>총 {totalVotes}명 투표</Text>
        </View>
      </View>

      {/* 설명 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 명예의 전당이란?</Text>
        <Text style={styles.infoText}>
          하루 동안 가장 높은 투표율을 기록한 질문이 명예의 전당에 등록됩니다.
        </Text>
        <Text style={styles.infoText}>
          매일 자정에 초기화되며, 새로운 하루의 명예의 전당이 결정됩니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  headerCard: {
    padding: 32,
    borderRadius: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  headerIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 2,
    borderColor: '#fbbf24',
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d97706',
  },
  rateBadge: {
    backgroundColor: '#fbbf24',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  hallImage: {
    width: '100%',
    height: 200,
  },
  verifiedOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  verifiedText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultContainer: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  resultItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultOption: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    flex: 1,
  },
  resultPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3b82f6',
    marginRight: 8,
  },
  resultVotes: {
    fontSize: 14,
    color: '#64748b',
  },
  totalVotesContainer: {
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalVotesText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 22,
    marginBottom: 8,
  },
});

