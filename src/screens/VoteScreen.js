import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { submitVote, hasVoted } from '../services/voteService';
import { AppConstants } from '../utils/constants';

export default function VoteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { question } = route.params;
  const deviceId = useSelector((state) => state.app.deviceId);

  const [remainingSeconds, setRemainingSeconds] = useState(AppConstants.voteTimerSeconds);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotedAlready, setHasVotedAlready] = useState(false);

  useEffect(() => {
    checkVoteStatus();
    startTimer();
  }, []);

  const checkVoteStatus = async () => {
    if (!deviceId) return;
    const voted = await hasVoted(question.questionId, deviceId);
    if (voted) {
      setHasVotedAlready(true);
      navigation.replace('Result', { questionId: question.questionId });
    }
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (!hasVotedAlready && !selectedChoice) {
            navigation.replace('Result', { questionId: question.questionId });
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  };

  const handleVote = async (choice) => {
    if (isSubmitting || hasVotedAlready || !deviceId) return;

    setSelectedChoice(choice);
    setIsSubmitting(true);

    try {
      await submitVote({
        questionId: question.questionId,
        deviceId,
        choice,
      });

      setHasVotedAlready(true);
      Alert.alert('성공', '투표 완료! +5 포인트');
      navigation.replace('Result', { questionId: question.questionId });
    } catch (error) {
      setSelectedChoice(null);
      setIsSubmitting(false);
      Alert.alert('오류', `투표 실패: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      {/* 타이머 */}
      <View style={[styles.timerCard, remainingSeconds <= 5 && styles.timerCardUrgent]}>
        <Text style={styles.timerLabel}>남은 시간</Text>
        <Text style={[styles.timerText, remainingSeconds <= 5 && styles.timerTextUrgent]}>
          {remainingSeconds}초
        </Text>
      </View>

      {/* 질문 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* 선택 버튼 */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            styles.choiceButtonA,
            selectedChoice === 'A' && styles.choiceButtonSelected,
            (isSubmitting || hasVotedAlready) && styles.buttonDisabled,
          ]}
          onPress={() => handleVote('A')}
          disabled={isSubmitting || hasVotedAlready}
        >
          <Text
            style={[
              styles.choiceButtonText,
              selectedChoice === 'A' && styles.choiceButtonTextSelected,
            ]}
          >
            {question.optionA}
          </Text>
        </TouchableOpacity>

        <Text style={styles.vsText}>VS</Text>

        <TouchableOpacity
          style={[
            styles.choiceButton,
            styles.choiceButtonB,
            selectedChoice === 'B' && styles.choiceButtonSelected,
            (isSubmitting || hasVotedAlready) && styles.buttonDisabled,
          ]}
          onPress={() => handleVote('B')}
          disabled={isSubmitting || hasVotedAlready}
        >
          <Text
            style={[
              styles.choiceButtonText,
              selectedChoice === 'B' && styles.choiceButtonTextSelected,
            ]}
          >
            {question.optionB}
          </Text>
        </TouchableOpacity>
      </View>

      {isSubmitting && (
        <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  timerCard: {
    backgroundColor: '#dbeafe',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  timerCardUrgent: {
    backgroundColor: '#fee2e2',
  },
  timerLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  timerTextUrgent: {
    color: '#ef4444',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 40,
    elevation: 2,
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceButton: {
    padding: 24,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  choiceButtonA: {
    backgroundColor: '#dbeafe',
  },
  choiceButtonB: {
    backgroundColor: '#fee2e2',
  },
  choiceButtonSelected: {
    backgroundColor: '#0ea5e9',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  choiceButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  choiceButtonTextSelected: {
    color: '#fff',
  },
  vsText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  loader: {
    marginTop: 20,
  },
});

