import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { submitCheckin, hasCheckedInToday } from '../services/checkinService';
import { isWithinCampus } from '../services/locationService';
import { AppConstants } from '../utils/constants';

export default function HomeScreen() {
  const navigation = useNavigation();
  const device = useSelector((state) => state.app.device);
  const currentQuestion = useSelector((state) => state.app.currentQuestion);
  const deviceId = useSelector((state) => state.app.deviceId);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckin = async () => {
    if (!deviceId) return;

    setIsCheckingIn(true);
    try {
      // 위치 확인
      const withinCampus = await isWithinCampus();
      if (!withinCampus) {
        Alert.alert('알림', '캠퍼스 범위 내에 있지 않습니다.');
        return;
      }

      // 오늘 이미 출석했는지 확인
      const hasCheckedIn = await hasCheckedInToday(deviceId);
      if (hasCheckedIn) {
        Alert.alert('알림', '오늘 이미 출석했습니다.');
        return;
      }

      // 출석 체크
      await submitCheckin(deviceId);
      Alert.alert('성공', '출석 완료! +10 포인트');
    } catch (error) {
      Alert.alert('오류', `출석 실패: ${error.message}`);
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 포인트 표시 */}
      <View style={styles.pointCard}>
        <Text style={styles.pointLabel}>내 포인트</Text>
        <Text style={styles.pointValue}>{device?.points || 0}P</Text>
      </View>

      {/* 출석하기 버튼 */}
      <TouchableOpacity
        style={[styles.checkinButton, isCheckingIn && styles.buttonDisabled]}
        onPress={handleCheckin}
        disabled={isCheckingIn}
      >
        <Text style={styles.checkinButtonText}>
          {isCheckingIn ? '출석 중...' : '출석하기 (+10P)'}
        </Text>
      </TouchableOpacity>

      {/* 현재 질문 */}
      {currentQuestion ? (
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>현재 고민</Text>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          <View style={styles.questionInfo}>
            <Text style={styles.questionOptions}>
              {currentQuestion.optionA} vs {currentQuestion.optionB}
            </Text>
            <Text style={styles.voteCount}>
              {currentQuestion.totalVotes || 0}명 투표
            </Text>
          </View>
          <TouchableOpacity
            style={styles.voteButton}
            onPress={() => navigation.navigate('Vote', { question: currentQuestion })}
          >
            <Text style={styles.voteButtonText}>투표하기</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>❓</Text>
          <Text style={styles.emptyText}>현재 진행 중인 고민이 없습니다</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('QuestionCreate')}
          >
            <Text style={styles.createButtonText}>고민 작성하기</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* 고민 작성하기 버튼 */}
      <TouchableOpacity
        style={styles.createQuestionButton}
        onPress={() => navigation.navigate('QuestionCreate')}
      >
        <Text style={styles.createQuestionButtonText}>+ 고민 작성하기</Text>
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
  pointCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pointLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pointValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  checkinButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  checkinButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
  },
  questionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  questionInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionOptions: {
    fontSize: 16,
    color: '#0ea5e9',
  },
  voteCount: {
    fontSize: 14,
    color: '#666',
  },
  voteButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  voteButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 40,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  createButton: {
    backgroundColor: '#0ea5e9',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  createQuestionButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0ea5e9',
  },
  createQuestionButtonText: {
    color: '#0ea5e9',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

