import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { getOrCreateDeviceId, subscribeToDevice } from '../services/deviceService';
import { subscribeToLatestOpenQuestion } from '../services/questionService';

export default function SplashScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    async function initialize() {
      try {
        // deviceId 가져오기 또는 생성
        const deviceId = await getOrCreateDeviceId();
        dispatch({ type: 'SET_DEVICE_ID', payload: deviceId });
        
        // Device 구독
        const unsubscribeDevice = subscribeToDevice(deviceId, (device) => {
          dispatch({ type: 'SET_DEVICE', payload: device });
        });

        // 최신 질문 구독
        const unsubscribeQuestion = subscribeToLatestOpenQuestion((question) => {
          dispatch({ type: 'SET_CURRENT_QUESTION', payload: question });
        });

        dispatch({ type: 'SET_LOADING', payload: false });

        // 홈 화면으로 이동
        navigation.replace('Home');
        
        // cleanup 함수는 필요시 추가
      } catch (error) {
        console.error('초기화 오류:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }

    initialize();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⚖️</Text>
      <Text style={styles.title}>즉결심판</Text>
      <ActivityIndicator size="large" color="#0ea5e9" style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  icon: {
    fontSize: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  loader: {
    marginTop: 20,
  },
});

