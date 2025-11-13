import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';

export default function ShopScreen() {
  const device = useSelector((state) => state.app.device);

  const shopItems = [
    {
      id: 'item1',
      name: '투표 쿠폰',
      description: '투표 1회 무료',
      price: 100,
      icon: '🎫',
    },
    {
      id: 'item2',
      name: '프리미엄 배지',
      description: '프로필에 표시되는 특별 배지',
      price: 500,
      icon: '⭐',
    },
    {
      id: 'item3',
      name: '질문 부스터',
      description: '질문이 상단에 고정됨',
      price: 300,
      icon: '🚀',
    },
    {
      id: 'item4',
      name: '익명 모드',
      description: '1일간 익명으로 활동',
      price: 200,
      icon: '🎭',
    },
  ];

  const handlePurchase = (item) => {
    if (!device) {
      Alert.alert('오류', '기기 정보를 불러올 수 없습니다.');
      return;
    }

    if (device.points < item.price) {
      Alert.alert(
        '포인트 부족',
        `구매하려면 ${item.price}P가 필요합니다.\n현재 보유: ${device.points}P`
      );
      return;
    }

    Alert.alert(
      '구매 확인',
      `${item.name}을(를) ${item.price}P에 구매하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '구매',
          onPress: () => {
            // TODO: 실제 구매 로직 구현
            Alert.alert('구매 완료', `${item.name} 구매가 완료되었습니다!`);
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 포인트 표시 */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.pointCard}
      >
        <Text style={styles.pointLabel}>보유 포인트</Text>
        <Text style={styles.pointValue}>{device?.points || 0}P</Text>
      </LinearGradient>

      {/* 상점 아이템 목록 */}
      <View style={styles.shopSection}>
        <Text style={styles.sectionTitle}>🛍️ 상점</Text>
        <Text style={styles.sectionSubtitle}>포인트로 다양한 아이템을 구매하세요</Text>

        {shopItems.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.itemIconContainer}>
              <Text style={styles.itemIcon}>{item.icon}</Text>
            </View>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.buyButton,
                device && device.points < item.price && styles.buyButtonDisabled,
              ]}
              onPress={() => handlePurchase(item)}
              disabled={device && device.points < item.price}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={
                  device && device.points >= item.price
                    ? ['#10b981', '#059669']
                    : ['#94a3b8', '#64748b']
                }
                style={styles.buyButtonGradient}
              >
                <Text style={styles.buyButtonText}>{item.price}P</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* 안내 */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>💡 포인트 획득 방법</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>출석하기: +100P</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>✓</Text>
          <Text style={styles.infoText}>사진 인증: +100P</Text>
        </View>
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
  pointCard: {
    padding: 24,
    borderRadius: 20,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  pointLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    opacity: 0.9,
    marginBottom: 8,
  },
  pointValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  shopSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 20,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  itemIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  itemIcon: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: '#64748b',
  },
  buyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: 80,
  },
  buyButtonDisabled: {
    opacity: 0.5,
  },
  buyButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoIcon: {
    fontSize: 16,
    color: '#10b981',
    marginRight: 12,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
  },
});

