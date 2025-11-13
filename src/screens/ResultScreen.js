import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { subscribeToQuestion } from '../services/questionService';
import { verifyQuestion } from '../services/localStorage';
import { AppConstants } from '../utils/constants';

export default function ResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { questionId } = route.params;
  const deviceId = useSelector((state) => state.app.deviceId);
  const dispatch = useDispatch();
  const [question, setQuestion] = useState(null);
  const [animatedA] = useState(new Animated.Value(0));
  const [animatedB] = useState(new Animated.Value(0));
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToQuestion(questionId, (questionData) => {
      setQuestion(questionData);
      if (questionData) {
        const percentageA = questionData.totalVotes > 0 
          ? (questionData.votesA / questionData.totalVotes) * 100 
          : 0;
        const percentageB = questionData.totalVotes > 0 
          ? (questionData.votesB / questionData.totalVotes) * 100 
          : 0;
        
        Animated.parallel([
          Animated.timing(animatedA, {
            toValue: percentageA,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedB, {
            toValue: percentageB,
            duration: 1000,
            useNativeDriver: false,
          }),
        ]).start();
      }
    });

    return unsubscribe;
  }, [questionId]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '사진 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleVerify(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleVerify(result.assets[0].uri);
    }
  };

  const handleVerify = async (imageUri) => {
    if (!deviceId || !question) return;

    setIsVerifying(true);
    try {
      await verifyQuestion(questionId, imageUri, deviceId);
      
      // 디바이스 정보 다시 로드하여 포인트 업데이트
      const { getDevice } = await import('../services/deviceService');
      const updatedDevice = await getDevice(deviceId);
      dispatch({ type: 'SET_DEVICE', payload: updatedDevice });
      
      // 질문 다시 로드
      const updatedQuestion = await import('../services/localStorage').then(m => 
        m.getQuestion(questionId)
      );
      setQuestion(updatedQuestion);
      
      Alert.alert('성공', '인증 완료! +100 포인트');
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const showVerifyOptions = () => {
    Alert.alert(
      '사진 인증',
      '결과를 인증할 사진을 선택하세요',
      [
        { text: '카메라', onPress: takePhoto },
        { text: '앨범', onPress: pickImage },
        { text: '취소', style: 'cancel' },
      ]
    );
  };

  if (!question) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>로딩 중...</Text>
      </View>
    );
  }

  const totalVotes = question.totalVotes || 0;
  const votesA = question.votesA || 0;
  const votesB = question.votesB || 0;
  const percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0;
  const percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0;
  const isOwner = question.createdBy === deviceId;
  const canVerify = isOwner && !question.verified && totalVotes > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 질문 카드 */}
      <View style={styles.questionCard}>
        <Text style={styles.questionText}>{question.text}</Text>
        {question.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedIcon}>✓</Text>
            <Text style={styles.verifiedText}>인증 완료</Text>
          </View>
        )}
      </View>

      {/* 인증 사진 */}
      {question.verificationImage && (
        <View style={styles.imageCard}>
          <Text style={styles.imageTitle}>인증 사진</Text>
          <Image 
            source={{ uri: question.verificationImage }} 
            style={styles.verificationImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* 통계 */}
      <View style={styles.statsCard}>
        <View style={styles.statsHeader}>
          <Text style={styles.statsTitle}>📊 투표 결과</Text>
          <View style={styles.totalBadge}>
            <Text style={styles.totalBadgeText}>{totalVotes}명</Text>
          </View>
        </View>

        {/* A 결과 */}
        <View style={styles.resultRow}>
          <View style={styles.resultInfo}>
            <Text style={styles.resultLabel}>{question.optionA}</Text>
            <Text style={styles.resultCount}>
              {votesA}표 ({percentageA.toFixed(1)}%)
            </Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                styles.progressBarA,
                {
                  width: animatedA.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
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
            <Animated.View
              style={[
                styles.progressBar,
                styles.progressBarB,
                {
                  width: animatedB.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>
      </View>

      {/* 그래프 */}
      <View style={styles.graphCard}>
        <Text style={styles.graphTitle}>📈 비율 그래프</Text>
        <View style={styles.graphContainer}>
          <Animated.View
            style={[
              styles.graphBar,
              styles.graphBarA,
              {
                height: animatedA.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 200],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['#3b82f6', '#2563eb']}
              style={styles.graphBarGradient}
            >
              <Text style={styles.graphBarText}>{question.optionA}</Text>
              <Text style={styles.graphBarPercentage}>
                {percentageA.toFixed(1)}%
              </Text>
            </LinearGradient>
          </Animated.View>
          <Animated.View
            style={[
              styles.graphBar,
              styles.graphBarB,
              {
                height: animatedB.interpolate({
                  inputRange: [0, 100],
                  outputRange: [0, 200],
                }),
              },
            ]}
          >
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.graphBarGradient}
            >
              <Text style={styles.graphBarText}>{question.optionB}</Text>
              <Text style={styles.graphBarPercentage}>
                {percentageB.toFixed(1)}%
              </Text>
            </LinearGradient>
          </Animated.View>
        </View>
      </View>

      {/* 사진 인증 버튼 (질문 작성자만) */}
      {canVerify && (
        <TouchableOpacity
          style={styles.verifyButton}
          onPress={showVerifyOptions}
          disabled={isVerifying}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#f59e0b', '#d97706']}
            style={styles.verifyButtonGradient}
          >
            <Text style={styles.verifyButtonText}>
              {isVerifying ? '인증 중...' : '📷 사진 인증하기 (+100P)'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {/* 돌아가기 버튼 */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => navigation.navigate('Home')}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.homeButtonGradient}
        >
          <Text style={styles.homeButtonText}>🏠 홈으로 돌아가기</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748b',
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
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  questionText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    gap: 6,
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#fff',
  },
  verifiedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  imageCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  imageTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  verificationImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  totalBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  totalBadgeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#d97706',
  },
  resultRow: {
    marginBottom: 24,
  },
  resultInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  resultCount: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 24,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 12,
  },
  progressBarA: {
    backgroundColor: '#3b82f6',
  },
  progressBarB: {
    backgroundColor: '#ef4444',
  },
  graphCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  graphTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#1e293b',
  },
  graphContainer: {
    flexDirection: 'row',
    height: 200,
    alignItems: 'flex-end',
    gap: 12,
  },
  graphBar: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    minHeight: 40,
  },
  graphBarGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
  },
  graphBarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 4,
  },
  graphBarPercentage: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  verifyButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  verifyButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  verifyButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  homeButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  homeButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
