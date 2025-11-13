import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getOrCreateDeviceId } from '../services/deviceService';
import { createDummyData } from '../services/localStorage';

export default function SplashScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    async function initialize() {
      try {
        // 더미 데이터 생성
        await createDummyData();
        
        const deviceId = await getOrCreateDeviceId();
        dispatch({ type: 'SET_DEVICE_ID', payload: deviceId });
        
        // 디바이스 정보 로드
        const { getDevice } = await import('../services/deviceService');
        const device = await getDevice(deviceId);
        dispatch({ type: 'SET_DEVICE', payload: device });
        
        // 최신 질문 로드
        const { getLatestOpenQuestion } = await import('../services/questionService');
        const question = await getLatestOpenQuestion('all');
        dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });

        dispatch({ type: 'SET_LOADING', payload: false });
        navigation.replace('Home');
      } catch (error) {
        console.error('초기화 오류:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    setTimeout(initialize, 1500);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.icon}>⚖️</Text>
        <Text style={styles.title}>즉결심판</Text>
        <Text style={styles.subtitle}>10초 안에 결정하세요</Text>
        <ActivityIndicator size="large" color="#fff" style={styles.loader} />
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  icon: {
    fontSize: 120,
    marginBottom: 24,
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 48,
    fontWeight: '600',
  },
  loader: {
    marginTop: 20,
  },
});
