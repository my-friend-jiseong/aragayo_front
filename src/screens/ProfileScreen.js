import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { updateUserProfile } from '../services/deviceService';
import { AppConstants } from '../utils/constants';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const device = useSelector((state) => state.app.device);
  const deviceId = useSelector((state) => state.app.deviceId);
  const [editingSchool, setEditingSchool] = useState(false);
  const [editingMajor, setEditingMajor] = useState(false);

  const formatDate = (timestamp) => {
    if (!timestamp) return '로딩 중...';
    const date = new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSchoolSelect = async (school) => {
    try {
      const updatedDevice = await updateUserProfile(deviceId, {
        school,
        major: device?.major || null,
      });
      dispatch({ type: 'SET_DEVICE', payload: updatedDevice });
      setEditingSchool(false);
      Alert.alert('성공', '학교 정보가 저장되었습니다.');
    } catch (error) {
      Alert.alert('오류', `저장 실패: ${error.message}`);
    }
  };

  const handleMajorSelect = async (major) => {
    try {
      const updatedDevice = await updateUserProfile(deviceId, {
        school: device?.school || null,
        major,
      });
      dispatch({ type: 'SET_DEVICE', payload: updatedDevice });
      setEditingMajor(false);
      Alert.alert('성공', '학과 정보가 저장되었습니다.');
    } catch (error) {
      Alert.alert('오류', `저장 실패: ${error.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 프로필 카드 - 그라데이션 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.profileCard}
      >
        <View style={styles.profileIconContainer}>
          <Text style={styles.profileIcon}>👤</Text>
        </View>
        <Text style={styles.deviceIdLabel}>기기 ID</Text>
        <Text style={styles.deviceId} numberOfLines={1} ellipsizeMode="middle">
          {deviceId || '로딩 중...'}
        </Text>
      </LinearGradient>

      {/* 학교/학과 정보 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>🏫 학교/학과 정보</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>학교</Text>
          {editingSchool ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectContainer}>
              {AppConstants.schools.map((school) => (
                <TouchableOpacity
                  key={school}
                  style={styles.selectOption}
                  onPress={() => handleSchoolSelect(school)}
                >
                  <Text style={styles.selectOptionText}>{school}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.infoValueContainer}
              onPress={() => setEditingSchool(true)}
            >
              <Text style={styles.infoValue}>
                {device?.school || '설정하기'}
              </Text>
              <Text style={styles.editButton}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>학과</Text>
          {editingMajor ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.selectContainer}>
              {AppConstants.majors.map((major) => (
                <TouchableOpacity
                  key={major}
                  style={styles.selectOption}
                  onPress={() => handleMajorSelect(major)}
                >
                  <Text style={styles.selectOptionText}>{major}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <TouchableOpacity
              style={styles.infoValueContainer}
              onPress={() => setEditingMajor(true)}
            >
              <Text style={styles.infoValue}>
                {device?.major || '설정하기'}
              </Text>
              <Text style={styles.editButton}>✏️</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.statisticsButton}
          onPress={() => navigation.navigate('Statistics')}
        >
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.statisticsButtonGradient}
          >
            <Text style={styles.statisticsButtonText}>📊 통계 보기</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 내 통계</Text>

        <View style={styles.statRow}>
          <LinearGradient
            colors={['#fbbf24', '#f59e0b']}
            style={styles.statIconContainer}
          >
            <Text style={styles.statIcon}>⭐</Text>
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>포인트</Text>
          </View>
          <Text style={styles.statValue}>{device?.points || 0}P</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <LinearGradient
            colors={['#3b82f6', '#2563eb']}
            style={styles.statIconContainer}
          >
            <Text style={styles.statIcon}>🗳️</Text>
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>총 투표 수</Text>
          </View>
          <Text style={styles.statValue}>{device?.totalVotes || 0}회</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.statIconContainer}
          >
            <Text style={styles.statIcon}>✅</Text>
          </LinearGradient>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>총 출석 수</Text>
          </View>
          <Text style={styles.statValue}>{device?.totalCheckins || 0}회</Text>
        </View>
      </View>

      {/* 활동 정보 */}
      {device && (
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>📅 활동 정보</Text>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>가입일</Text>
            <Text style={styles.activityValue}>
              {formatDate(device.createdAt)}
            </Text>
          </View>
          <View style={styles.activityRow}>
            <Text style={styles.activityLabel}>마지막 활동</Text>
            <Text style={styles.activityValue}>
              {formatDate(device.lastActiveAt)}
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 20,
  },
  profileCard: {
    padding: 32,
    borderRadius: 24,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  profileIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    fontSize: 50,
  },
  deviceIdLabel: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
    fontWeight: '600',
  },
  deviceId: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 24,
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
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  infoRow: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  infoValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
  },
  infoValue: {
    fontSize: 16,
    color: device?.school || device?.major ? '#1e293b' : '#94a3b8',
    fontWeight: '600',
  },
  editButton: {
    fontSize: 16,
  },
  selectContainer: {
    flexDirection: 'row',
  },
  selectOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    backgroundColor: '#667eea',
    borderRadius: 20,
  },
  selectOptionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  statisticsButton: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statisticsButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  statisticsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statsCard: {
    backgroundColor: '#fff',
    padding: 24,
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
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statIcon: {
    fontSize: 24,
  },
  statInfo: {
    flex: 1,
  },
  statLabel: {
    fontSize: 16,
    color: '#1e293b',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3b82f6',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 8,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#1e293b',
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  activityLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  activityValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
  },
});
