import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { createQuestion } from '../services/questionService';
import { AppConstants } from '../utils/constants';

export default function QuestionCreateScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const deviceId = useSelector((state) => state.app.deviceId);

  const [questionType, setQuestionType] = useState(AppConstants.questionTypeYesNo);
  const [text, setText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [category, setCategory] = useState('etc');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!text.trim()) {
      Alert.alert('오류', '고민을 입력해주세요.');
      return;
    }

    if (questionType === AppConstants.questionTypeAB) {
      if (!optionA.trim() || !optionB.trim()) {
        Alert.alert('오류', '옵션 A와 B를 모두 입력해주세요.');
        return;
      }
    }

    if (!deviceId) {
      Alert.alert('오류', '기기 정보를 불러올 수 없습니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      const finalOptionA =
        questionType === AppConstants.questionTypeYesNo ? 'YES' : optionA.trim();
      const finalOptionB =
        questionType === AppConstants.questionTypeYesNo ? 'NO' : optionB.trim();

      await createQuestion({
        text: text.trim(),
        type: questionType,
        optionA: finalOptionA,
        optionB: finalOptionB,
        deviceId,
        category,
      });

      // 홈 화면의 질문 목록 업데이트를 위해 질문 다시 로드
      const { getLatestOpenQuestion } = await import('../services/questionService');
      const updatedQuestion = await getLatestOpenQuestion('all');
      dispatch({ type: 'SET_CURRENT_QUESTION', payload: updatedQuestion });

      Alert.alert('성공', '고민이 등록되었습니다!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', `등록 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 질문 타입 선택 */}
      <View style={styles.typeCard}>
        <Text style={styles.typeTitle}>📝 질문 타입</Text>
        <View style={styles.typeButtons}>
          <TouchableOpacity
            style={[
              styles.typeButton,
              questionType === AppConstants.questionTypeYesNo &&
                styles.typeButtonSelected,
            ]}
            onPress={() => {
              setQuestionType(AppConstants.questionTypeYesNo);
              setOptionA('');
              setOptionB('');
            }}
            activeOpacity={0.7}
          >
            {questionType === AppConstants.questionTypeYesNo ? (
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.typeButtonGradient}
              >
                <Text style={styles.typeButtonTextSelected}>YES/NO</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.typeButtonText}>YES/NO</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              questionType === AppConstants.questionTypeAB &&
                styles.typeButtonSelected,
            ]}
            onPress={() => setQuestionType(AppConstants.questionTypeAB)}
            activeOpacity={0.7}
          >
            {questionType === AppConstants.questionTypeAB ? (
              <LinearGradient
                colors={['#8b5cf6', '#7c3aed']}
                style={styles.typeButtonGradient}
              >
                <Text style={styles.typeButtonTextSelected}>A/B</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.typeButtonText}>A/B</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* 카테고리 선택 */}
      <View style={styles.categoryCard}>
        <Text style={styles.categoryTitle}>🏷️ 카테고리</Text>
        <View style={styles.categoryGrid}>
          {AppConstants.categories.filter(c => c.id !== 'all').map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryItem,
                category === cat.id && styles.categoryItemSelected,
              ]}
              onPress={() => setCategory(cat.id)}
              activeOpacity={0.7}
            >
              {category === cat.id ? (
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  style={styles.categoryItemGradient}
                >
                  <Text style={styles.categoryItemIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryItemTextSelected}>{cat.name}</Text>
                </LinearGradient>
              ) : (
                <>
                  <Text style={styles.categoryItemIcon}>{cat.icon}</Text>
                  <Text style={styles.categoryItemText}>{cat.name}</Text>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 질문 입력 */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>💭 고민을 입력하세요</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={4}
          placeholder="예: 알바 그만둘까?"
          placeholderTextColor="#94a3b8"
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* A/B 옵션 입력 */}
      {questionType === AppConstants.questionTypeAB && (
        <>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>A 옵션</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 그만두기"
              placeholderTextColor="#94a3b8"
              value={optionA}
              onChangeText={setOptionA}
            />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>B 옵션</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 계속하기"
              placeholderTextColor="#94a3b8"
              value={optionB}
              onChangeText={setOptionB}
            />
          </View>
        </>
      )}

      {/* 제출 버튼 */}
      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={['#10b981', '#059669']}
          style={styles.submitButtonGradient}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? '등록 중...' : '✨ 등록하기'}
          </Text>
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
  typeCard: {
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
  typeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  typeButtonSelected: {
    borderColor: 'transparent',
  },
  typeButtonGradient: {
    padding: 16,
    alignItems: 'center',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#64748b',
    padding: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  categoryCard: {
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
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1e293b',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryItem: {
    width: '30%',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  categoryItemSelected: {
    borderColor: 'transparent',
  },
  categoryItemGradient: {
    width: '100%',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryItemIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryItemText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
  },
  categoryItemTextSelected: {
    fontSize: 12,
    color: '#fff',
    fontWeight: 'bold',
  },
  inputCard: {
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
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 60,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
});
