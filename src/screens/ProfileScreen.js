import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useSelector } from 'react-redux';

export default function ProfileScreen() {
  const device = useSelector((state) => state.app.device);
  const deviceId = useSelector((state) => state.app.deviceId);

  const formatDate = (timestamp) => {
    if (!timestamp) return '로딩 중...';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.container}>
      {/* 프로필 카드 */}
      <View style={styles.profileCard}>
        <Text style={styles.profileIcon}>👤</Text>
        <Text style={styles.deviceIdLabel}>기기 ID</Text>
        <Text style={styles.deviceId}>{deviceId || '로딩 중...'}</Text>
      </View>

      {/* 통계 카드 */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>내 통계</Text>

        <View style={styles.statRow}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>⭐</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>포인트</Text>
          </View>
          <Text style={styles.statValue}>{device?.points || 0}P</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>🗳️</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>총 투표 수</Text>
          </View>
          <Text style={styles.statValue}>{device?.totalVotes || 0}회</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.statRow}>
          <View style={styles.statIconContainer}>
            <Text style={styles.statIcon}>✅</Text>
          </View>
          <View style={styles.statInfo}>
            <Text style={styles.statLabel}>총 출석 수</Text>
          </View>
          <Text style={styles.statValue}>{device?.totalCheckins || 0}회</Text>
        </View>
      </View>

      {/* 활동 정보 */}
      {device && (
        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>활동 정보</Text>
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
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
    elevation: 2,
  },
  profileIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  deviceIdLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  deviceId: {
    fontSize: 14,
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
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
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  activityCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  activityLabel: {
    fontSize: 14,
    color: '#666',
  },
  activityValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});

