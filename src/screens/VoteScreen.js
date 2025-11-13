import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { submitVote, hasVoted } from '../services/voteService';
import { AppConstants } from '../utils/constants';

export default function VoteScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { question } = route.params;
  const deviceId = useSelector((state) => state.app.deviceId);
  const dispatch = useDispatch();

  const [remainingSeconds, setRemainingSeconds] = useState(AppConstants.voteTimerSeconds);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVotedAlready, setHasVotedAlready] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(1));
  const device = useSelector((state) => state.app.device);

  useEffect(() => {
    checkVoteStatus();
    startTimer();
    startPulseAnimation();
  }, []);

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

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
          // 10초 후 자동으로 결과 화면으로 이동
          if (!hasVotedAlready) {
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

    // 포인트 확인
    if (device && device.points < AppConstants.votePointCost) {
      Alert.alert('포인트 부족', `투표하려면 ${AppConstants.votePointCost}P가 필요합니다.\n현재 보유: ${device.points}P`);
      return;
    }

    setSelectedChoice(choice);
    setIsSubmitting(true);

    try {
      // submitVote가 업데이트된 디바이스를 반환
      const updatedDevice = await submitVote({
        questionId: question.questionId,
        deviceId,
        choice,
      });

      setHasVotedAlready(true);
      
      if (updatedDevice) {
        dispatch({ type: 'SET_DEVICE', payload: updatedDevice });
        console.log('투표 후 포인트:', updatedDevice.points);
      } else {
        // 폴백: 디바이스 정보 다시 로드
        const { getDevice } = await import('../services/deviceService');
        const device = await getDevice(deviceId);
        dispatch({ type: 'SET_DEVICE', payload: device });
      }
      
      Alert.alert('성공', `투표 완료! -${AppConstants.votePointCost}P`);
      
      // 투표 완료 후 바로 결과 화면으로 이동하지 않고 타이머가 끝날 때까지 대기
      // 타이머가 끝나면 자동으로 결과 화면으로 이동
    } catch (error) {
      setSelectedChoice(null);
      setIsSubmitting(false);
      Alert.alert('오류', `투표 실패: ${error.message}`);
    }
  };

  const formatTime = (seconds) => {
    return `${seconds}초`;
  };

  const isUrgent = remainingSeconds <= 5; // 마지막 5초

  return (
    <View style={styles.container}>
      {/* 타이머 - 그라데이션 */}
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <LinearGradient
          colors={isUrgent ? ['#ef4444', '#dc2626'] : ['#3b82f6', '#2563eb']}
          style={styles.timerCard}
        >
          <Text style={styles.timerLabel}>⏱️ 남은 시간</Text>
          <Text style={styles.timerText}>{formatTime(remainingSeconds)}</Text>
          {isUrgent && <Text style={styles.urgentText}>서둘러주세요!</Text>}
          {device && (
            <Text style={styles.pointInfo}>
              투표 비용: {AppConstants.votePointCost}P (보유: {device.points}P)
            </Text>
          )}
        </LinearGradient>
      </Animated.View>

      {/* 질문 카드 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
      </View>

      {/* 선택 버튼 */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.choiceButton,
            selectedChoice === 'A' && styles.choiceButtonSelected,
            (isSubmitting || hasVotedAlready) && styles.buttonDisabled,
          ]}
          onPress={() => handleVote('A')}
          disabled={isSubmitting || hasVotedAlready}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              selectedChoice === 'A'
                ? ['#3b82f6', '#2563eb']
                : ['#eff6ff', '#dbeafe']
            }
            style={styles.choiceButtonGradient}
          >
            <Text
              style={[
                styles.choiceButtonText,
                selectedChoice === 'A' && styles.choiceButtonTextSelected,
              ]}
            >
              {question.optionA}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.vsContainer}>
          <View style={styles.vsLine} />
          <Text style={styles.vsText}>VS</Text>
          <View style={styles.vsLine} />
        </View>

        <TouchableOpacity
          style={[
            styles.choiceButton,
            selectedChoice === 'B' && styles.choiceButtonSelected,
            (isSubmitting || hasVotedAlready) && styles.buttonDisabled,
          ]}
          onPress={() => handleVote('B')}
          disabled={isSubmitting || hasVotedAlready}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={
              selectedChoice === 'B'
                ? ['#ef4444', '#dc2626']
                : ['#fef2f2', '#fee2e2']
            }
            style={styles.choiceButtonGradient}
          >
            <Text
              style={[
                styles.choiceButtonText,
                selectedChoice === 'B' && styles.choiceButtonTextSelected,
              ]}
            >
              {question.optionB}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {isSubmitting && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loaderText}>투표 처리 중...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  timerCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  timerLabel: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '600',
  },
  timerText: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    fontFamily: 'monospace',
    letterSpacing: 4,
  },
  pointInfo: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 8,
  },
  urgentText: {
    fontSize: 12,
    color: '#fff',
    marginTop: 8,
    fontWeight: '600',
  },
  questionCard: {
    backgroundColor: '#fff',
    padding: 28,
    borderRadius: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionText: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    lineHeight: 36,
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  choiceButton: {
    borderRadius: 18,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  choiceButtonGradient: {
    padding: 28,
    alignItems: 'center',
  },
  choiceButtonSelected: {
    shadowColor: '#3b82f6',
    shadowOpacity: 0.4,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  choiceButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  choiceButtonTextSelected: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  vsLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#e2e8f0',
  },
  vsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#94a3b8',
    marginHorizontal: 16,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loaderText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
});
