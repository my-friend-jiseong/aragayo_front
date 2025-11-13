import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { getHotVotes, getAllTimeHotVotes } from '../services/questionService';
import { AppConstants } from '../utils/constants';

export default function HotVotesScreen() {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('now'); // 'now' or 'alltime'
  const [hotVotes, setHotVotes] = useState([]);
  const [allTimeHotVotes, setAllTimeHotVotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHotVotes();
    const interval = setInterval(loadHotVotes, 5000); // 5초마다 갱신
    return () => clearInterval(interval);
  }, [activeTab]);

  const loadHotVotes = async () => {
    try {
      if (activeTab === 'now') {
        const votes = await getHotVotes(10);
        setHotVotes(votes);
      } else {
        const votes = await getAllTimeHotVotes(10);
        setAllTimeHotVotes(votes);
      }
    } catch (error) {
      console.error('핫 투표 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = AppConstants.categories.find(c => c.id === categoryId);
    return category ? category.name : '기타';
  };

  const getCategoryIcon = (categoryId) => {
    const category = AppConstants.categories.find(c => c.id === categoryId);
    return category ? category.icon : '🤔';
  };

  const currentVotes = activeTab === 'now' ? hotVotes : allTimeHotVotes;

  return (
    <View style={styles.container}>
      {/* 탭 헤더 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'now' && styles.tabActive]}
          onPress={() => {
            setActiveTab('now');
            setLoading(true);
          }}
          activeOpacity={0.7}
        >
          {activeTab === 'now' ? (
            <LinearGradient
              colors={['#ef4444', '#dc2626']}
              style={styles.tabGradient}
            >
              <Text style={styles.tabTextActive}>🔥 지금 핫한 투표</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>🔥 지금 핫한 투표</Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'alltime' && styles.tabActive]}
          onPress={() => {
            setActiveTab('alltime');
            setLoading(true);
          }}
          activeOpacity={0.7}
        >
          {activeTab === 'alltime' ? (
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.tabGradient}
            >
              <Text style={styles.tabTextActive}>⭐ 가장 핫했던 투표</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>⭐ 가장 핫했던 투표</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 투표 목록 */}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading && currentVotes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>로딩 중...</Text>
          </View>
        ) : currentVotes.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'now' 
                ? '현재 진행 중인 핫한 투표가 없습니다'
                : '아직 핫한 투표가 없습니다'}
            </Text>
          </View>
        ) : (
          currentVotes.map((question, index) => {
            const totalVotes = question.totalVotes || 0;
            const votesA = question.votesA || 0;
            const votesB = question.votesB || 0;
            const percentageA = totalVotes > 0 ? (votesA / totalVotes) * 100 : 0;
            const percentageB = totalVotes > 0 ? (votesB / totalVotes) * 100 : 0;
            const isOpen = question.status === 'OPEN';

            return (
              <TouchableOpacity
                key={question.questionId}
                style={styles.voteCard}
                onPress={() => {
                  if (isOpen) {
                    navigation.navigate('Vote', { question });
                  } else {
                    navigation.navigate('Result', { questionId: question.questionId });
                  }
                }}
                activeOpacity={0.8}
              >
                {/* 순위 배지 */}
                <View style={styles.rankBadge}>
                  <LinearGradient
                    colors={
                      index === 0 ? ['#fbbf24', '#f59e0b'] :
                      index === 1 ? ['#94a3b8', '#64748b'] :
                      index === 2 ? ['#f97316', '#ea580c'] :
                      ['#e2e8f0', '#cbd5e1']
                    }
                    style={styles.rankBadgeGradient}
                  >
                    <Text style={styles.rankText}>
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                    </Text>
                  </LinearGradient>
                </View>

                <View style={styles.voteContent}>
                  {/* 카테고리 & 상태 */}
                  <View style={styles.voteHeader}>
                    <View style={styles.categoryBadge}>
                      <Text style={styles.categoryIcon}>
                        {getCategoryIcon(question.category)}
                      </Text>
                      <Text style={styles.categoryText}>
                        {getCategoryName(question.category)}
                      </Text>
                    </View>
                    {isOpen ? (
                      <View style={styles.statusBadgeOpen}>
                        <Text style={styles.statusTextOpen}>진행중</Text>
                      </View>
                    ) : (
                      <View style={styles.statusBadgeClosed}>
                        <Text style={styles.statusTextClosed}>종료</Text>
                      </View>
                    )}
                  </View>

                  {/* 질문 텍스트 */}
                  <Text style={styles.questionText} numberOfLines={2}>
                    {question.text}
                  </Text>

                  {/* 인증 배지 */}
                  {question.verified && (
                    <View style={styles.verifiedBadge}>
                      <Text style={styles.verifiedIcon}>✓</Text>
                      <Text style={styles.verifiedText}>인증됨</Text>
                    </View>
                  )}

                  {/* 투표 결과 */}
                  <View style={styles.resultContainer}>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultOption}>{question.optionA}</Text>
                      <View style={styles.resultBarContainer}>
                        <View 
                          style={[
                            styles.resultBar,
                            styles.resultBarA,
                            { width: `${percentageA}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.resultPercentage}>{percentageA.toFixed(1)}%</Text>
                      <Text style={styles.resultVotes}>({votesA})</Text>
                    </View>
                    <View style={styles.resultRow}>
                      <Text style={styles.resultOption}>{question.optionB}</Text>
                      <View style={styles.resultBarContainer}>
                        <View 
                          style={[
                            styles.resultBar,
                            styles.resultBarB,
                            { width: `${percentageB}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.resultPercentage}>{percentageB.toFixed(1)}%</Text>
                      <Text style={styles.resultVotes}>({votesB})</Text>
                    </View>
                  </View>

                  {/* 총 투표 수 */}
                  <View style={styles.totalVotesContainer}>
                    <Text style={styles.totalVotesText}>
                      총 {totalVotes}명 투표
                    </Text>
                    <Text style={styles.fireIcon}>🔥</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  tabActive: {
    borderColor: 'transparent',
  },
  tabGradient: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  voteCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  rankBadge: {
    marginRight: 16,
  },
  rankBadgeGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  voteContent: {
    flex: 1,
  },
  voteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  categoryIcon: {
    fontSize: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0369a1',
  },
  statusBadgeOpen: {
    backgroundColor: '#10b981',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextOpen: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadgeClosed: {
    backgroundColor: '#94a3b8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextClosed: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#fff',
  },
  questionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
    lineHeight: 22,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 12,
    gap: 4,
  },
  verifiedIcon: {
    fontSize: 12,
    color: '#fff',
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  resultContainer: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  resultOption: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e293b',
    width: 60,
  },
  resultBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  resultBar: {
    height: '100%',
    borderRadius: 4,
  },
  resultBarA: {
    backgroundColor: '#3b82f6',
  },
  resultBarB: {
    backgroundColor: '#ef4444',
  },
  resultPercentage: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1e293b',
    width: 45,
    textAlign: 'right',
  },
  resultVotes: {
    fontSize: 11,
    color: '#64748b',
    width: 35,
  },
  totalVotesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  totalVotesText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  fireIcon: {
    fontSize: 16,
  },
  emptyCard: {
    backgroundColor: '#fff',
    padding: 48,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
});

