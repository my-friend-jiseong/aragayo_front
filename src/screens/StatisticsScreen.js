import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  getSchoolStatistics,
  getMajorStatistics,
  getAllSchoolsStatistics,
  getAllMajorsStatistics,
} from '../services/questionService';
import { AppConstants } from '../utils/constants';

export default function StatisticsScreen() {
  const navigation = useNavigation();
  const device = useSelector((state) => state.app?.device || null);
  const [selectedTab, setSelectedTab] = useState('school'); // 'school' or 'major'
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [schoolStats, setSchoolStats] = useState(null);
  const [majorStats, setMajorStats] = useState(null);
  const [allSchoolsStats, setAllSchoolsStats] = useState([]);
  const [allMajorsStats, setAllMajorsStats] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStatistics = async () => {
      // device가 없으면 실행하지 않음
      if (!device) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        if (selectedTab === 'school') {
          if (device.school) {
            const stats = await getSchoolStatistics(device.school, selectedCategory === 'all' ? null : selectedCategory);
            setSchoolStats(stats);
          } else {
            setSchoolStats(null);
          }
          const allStats = await getAllSchoolsStatistics();
          setAllSchoolsStats(allStats || []);
        } else {
          if (device.major) {
            const stats = await getMajorStatistics(device.major, selectedCategory === 'all' ? null : selectedCategory);
            setMajorStats(stats);
          } else {
            setMajorStats(null);
          }
          const allStats = await getAllMajorsStatistics();
          setAllMajorsStats(allStats || []);
        }
      } catch (error) {
        console.error('통계 로드 오류:', error);
        // 에러 발생 시 빈 상태로 설정
        if (selectedTab === 'school') {
          setSchoolStats(null);
          setAllSchoolsStats([]);
        } else {
          setMajorStats(null);
          setAllMajorsStats([]);
        }
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [selectedTab, selectedCategory, device]);

  const getCategoryName = (categoryId) => {
    const category = AppConstants.categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  const renderMyStatistics = () => {
    const stats = selectedTab === 'school' ? schoolStats : majorStats;
    const title = selectedTab === 'school' 
      ? `우리 학교 (${device?.school || '미설정'})` 
      : `우리 학과 (${device?.major || '미설정'})`;

    if (!device?.school && selectedTab === 'school') {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>학교 정보를 설정해주세요</Text>
          <Text style={styles.emptySubtext}>마이페이지에서 학교를 설정하면 통계를 볼 수 있습니다</Text>
        </View>
      );
    }

    if (!device?.major && selectedTab === 'major') {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>학과 정보를 설정해주세요</Text>
          <Text style={styles.emptySubtext}>마이페이지에서 학과를 설정하면 통계를 볼 수 있습니다</Text>
        </View>
      );
    }

    if (!stats) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>아직 통계 데이터가 없습니다</Text>
        </View>
      );
    }

    return (
      <View style={styles.statCard}>
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.statCardHeader}
        >
          <Text style={styles.statCardTitle}>{title}</Text>
          <Text style={styles.statCardSubtitle}>총 {stats.totalVotes}건의 투표</Text>
        </LinearGradient>

        <View style={styles.statContent}>
          {/* 전체 YES/NO 통계 */}
          {stats.yesNoStats.total > 0 && (
            <View style={styles.yesNoSection}>
              <Text style={styles.sectionTitle}>전체 YES/NO 통계</Text>
              <View style={styles.yesNoContainer}>
                <View style={styles.yesNoItem}>
                  <Text style={styles.yesNoLabel}>YES</Text>
                  <Text style={styles.yesNoValue}>{stats.yesNoStats.yesRate}%</Text>
                  <Text style={styles.yesNoCount}>({stats.yesNoStats.yes}건)</Text>
                </View>
                <View style={styles.yesNoDivider} />
                <View style={styles.yesNoItem}>
                  <Text style={styles.yesNoLabel}>NO</Text>
                  <Text style={styles.yesNoValue}>{100 - stats.yesNoStats.yesRate}%</Text>
                  <Text style={styles.yesNoCount}>({stats.yesNoStats.no}건)</Text>
                </View>
              </View>
            </View>
          )}

          {/* 카테고리별 통계 */}
          {Object.keys(stats.categoryStats).length > 0 && (
            <View style={styles.categorySection}>
              <Text style={styles.sectionTitle}>카테고리별 통계</Text>
              {Object.entries(stats.categoryStats).map(([category, catStats]) => {
                if (catStats.total === 0) return null;
                const yesRate = catStats.total > 0 ? Math.round((catStats.yes / catStats.total) * 100) : 0;
                return (
                    <View key={category} style={styles.categoryItem}>
                      <View style={styles.categoryHeader}>
                        <Text style={styles.categoryName}>{getCategoryName(category)}</Text>
                        <Text style={styles.categoryTotal}>{catStats.total}건</Text>
                      </View>
                      {catStats.total > 0 && (
                        <>
                          <View style={styles.categoryBar}>
                            <LinearGradient
                              colors={['#10b981', '#059669']}
                              style={[styles.categoryBarFill, { width: `${yesRate}%` }]}
                            />
                            <LinearGradient
                              colors={['#ef4444', '#dc2626']}
                              style={[styles.categoryBarFill, { width: `${100 - yesRate}%` }]}
                            />
                          </View>
                          <View style={styles.categoryStats}>
                            <Text style={styles.categoryYes}>YES {yesRate}%</Text>
                            <Text style={styles.categoryNo}>NO {100 - yesRate}%</Text>
                          </View>
                        </>
                      )}
                    </View>
                );
              })}
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderComparisonStatistics = () => {
    const allStats = selectedTab === 'school' ? allSchoolsStats : allMajorsStats;

    if (allStats.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>비교할 데이터가 없습니다</Text>
        </View>
      );
    }

    return (
      <View style={styles.comparisonCard}>
        <Text style={styles.comparisonTitle}>
          {selectedTab === 'school' ? '🏫 학교별 비교' : '🎓 학과별 비교'}
        </Text>
        {allStats.slice(0, 10).map((stat, index) => {
          const name = selectedTab === 'school' ? stat.school : stat.major;
          const yesRate = stat.yesNoStats?.yesRate || 0;
          return (
            <View key={index} style={styles.comparisonItem}>
              <View style={styles.comparisonHeader}>
                <Text style={styles.comparisonName}>{name}</Text>
                <Text style={styles.comparisonTotal}>{stat.totalVotes}건</Text>
              </View>
              {stat.yesNoStats?.total > 0 && (
                <View style={styles.comparisonBar}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={[styles.comparisonBarFill, { width: `${yesRate}%` }]}
                  />
                  <Text style={styles.comparisonRate}>{yesRate}% YES</Text>
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 탭 선택 */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'school' && styles.tabActive]}
          onPress={() => setSelectedTab('school')}
        >
          <Text style={[styles.tabText, selectedTab === 'school' && styles.tabTextActive]}>
            🏫 학교별
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'major' && styles.tabActive]}
          onPress={() => setSelectedTab('major')}
        >
          <Text style={[styles.tabText, selectedTab === 'major' && styles.tabTextActive]}>
            🎓 학과별
          </Text>
        </TouchableOpacity>
      </View>

      {/* 카테고리 필터 */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryFilter}
        contentContainerStyle={styles.categoryFilterContent}
      >
        {AppConstants.categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text
              style={[
                styles.categoryChipText,
                selectedCategory === category.id && styles.categoryChipTextActive,
              ]}
            >
              {category.icon} {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : (
        <>
          {/* 내 통계 */}
          {renderMyStatistics()}

          {/* 비교 통계 */}
          {renderComparisonStatistics()}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: '#667eea',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },
  tabTextActive: {
    color: '#fff',
  },
  categoryFilter: {
    marginBottom: 20,
  },
  categoryFilterContent: {
    paddingHorizontal: 20,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  categoryChipActive: {
    backgroundColor: '#667eea',
    borderColor: '#667eea',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  statCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  statCardHeader: {
    padding: 24,
  },
  statCardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  statCardSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statContent: {
    padding: 20,
  },
  yesNoSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  yesNoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
  },
  yesNoItem: {
    flex: 1,
    alignItems: 'center',
  },
  yesNoDivider: {
    width: 1,
    backgroundColor: '#e2e8f0',
    marginHorizontal: 20,
  },
  yesNoLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
  },
  yesNoValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  yesNoCount: {
    fontSize: 12,
    color: '#94a3b8',
  },
  categorySection: {
    marginTop: 8,
  },
  categoryItem: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  categoryTotal: {
    fontSize: 14,
    color: '#64748b',
  },
  categoryBar: {
    height: 8,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 8,
  },
  categoryBarFill: {
    height: '100%',
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryYes: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
  },
  categoryNo: {
    fontSize: 12,
    color: '#ef4444',
    fontWeight: '600',
  },
  comparisonCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  comparisonTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
  },
  comparisonItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  comparisonHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  comparisonName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  comparisonTotal: {
    fontSize: 14,
    color: '#64748b',
  },
  comparisonBar: {
    height: 24,
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  comparisonBarFill: {
    height: '100%',
    position: 'absolute',
    left: 0,
  },
  comparisonRate: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    marginLeft: 8,
    zIndex: 1,
  },
  emptyCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  emptyText: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
  },
});

