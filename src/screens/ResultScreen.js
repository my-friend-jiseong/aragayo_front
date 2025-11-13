import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { subscribeToQuestion } from '../services/questionService';

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questionId } = route.params;
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToQuestion(questionId, (questionData) => {
      setQuestion(questionData);
    });

    return unsubscribe;
  }, [questionId]);

  if (!question) {
    return (
      <View style={styles.container}>
        <Text>로딩 중...</Text>
      </View>
    );
  }

  const totalVotes = question.totalVotes || 0;
  const votesA = question.votesA || 0;
  const votesB = question.votesB || 0;
  const percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0;
  const percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0;

  return (
    <ScrollView style={styles.container}>
      {/* 질문 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* 통계 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>총 {totalVotes}명 투표</Text>

        {/* A 결과 */}
        <View style={styles.resultRow}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{question.optionA}</Text>
            <Text style={styles.resultCount}>
              {votesA}표 ({percentageA.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                styles.progressBarA,
                { width: `${percentageA}%` },
              ]}
            />
          </View>
        </View>

        {/* B 결과 */}
        <View style={styles.resultRow}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{question.optionB}</Text>
            <Text style={styles.resultCount}>
              {votesB}표 ({percentageB.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                styles.progressBarB,
                { width: `${percentageB}%` },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 그래프 */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>비율 그래프</Text>
        <View style={styles.graphContainer}>
          <View
            style={[
              styles.graphBar,
              styles.graphBarA,
              { height: `${percentageA}%` },
            ]}
          >
            <Text style={styles.graphBarText}>{question.optionA}</Text>
            <Text style={styles.graphBarPercentage}>
              {percentageA.toFixed(1)}%
            </Text>
          </View>
          <View
            style={[
              styles.graphBar,
              styles.graphBarB,
              { height: `${percentageB}%` },
            ]}
          >
            <Text style={styles.graphBarText}>{question.optionB}</Text>
            <Text style={styles.graphBarPercentage}>
              {percentageB.toFixed(1)}%
            </Text>
          </View>
        </View>
      </View>

      {/* 돌아가기 버튼 */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  resultRow: {
    marginBottom: 20,
  },
  resultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  resultCount: {
    fontSize: 16,
    color: '#666',
  },
  progressBarContainer: {
    height: 20,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
  progressBarA: {
    backgroundColor: '#3b82f6',
  },
  progressBarB: {
    backgroundColor: '#ef4444',
  },
  graphCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  graphContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
  },
  graphBar: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 8,
  },
  graphBarA: {
    backgroundColor: '#3b82f6',
  },
  graphBarB: {
    backgroundColor: '#ef4444',
  },
  graphBarText: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  graphBarPercentage: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  homeButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

