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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { createQuestion } from '../services/questionService';
import { AppConstants } from '../utils/constants';

export default function QuestionCreateScreen() {
  const navigation = useNavigation();
  const deviceId = useSelector((state) => state.app.deviceId);

  const [questionType, setQuestionType] = useState(AppConstants.questionTypeYesNo);
  const [text, setText] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
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
      });

      Alert.alert('성공', '고민이 등록되었습니다!');
      navigation.goBack();
    } catch (error) {
      Alert.alert('오류', `등록 실패: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 질문 타입 선택 */}
      <View style={styles.typeCard}>
        <Text style={styles.typeTitle}>질문 타입</Text>
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
          >
            <Text
              style={[
                styles.typeButtonText,
                questionType === AppConstants.questionTypeYesNo &&
                  styles.typeButtonTextSelected,
              ]}
            >
              YES/NO
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.typeButton,
              questionType === AppConstants.questionTypeAB &&
                styles.typeButtonSelected,
            ]}
            onPress={() => setQuestionType(AppConstants.questionTypeAB)}
          >
            <Text
              style={[
                styles.typeButtonText,
                questionType === AppConstants.questionTypeAB &&
                  styles.typeButtonTextSelected,
              ]}
            >
              A/B
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 질문 입력 */}
      <View style={styles.inputCard}>
        <Text style={styles.inputLabel}>고민을 입력하세요</Text>
        <TextInput
          style={styles.textInput}
          multiline
          numberOfLines={3}
          placeholder="예: 알바 그만둘까?"
          value={text}
          onChangeText={setText}
        />
      </View>

      {/* A/B 옵션 입력 */}
      {questionType === AppConstants.questionTypeAB && (
        <>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>옵션 A</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 그만두기"
              value={optionA}
              onChangeText={setOptionA}
            />
          </View>
          <View style={styles.inputCard}>
            <Text style={styles.inputLabel}>옵션 B</Text>
            <TextInput
              style={styles.textInput}
              placeholder="예: 계속하기"
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
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? '등록 중...' : '등록하기'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  typeCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  typeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  typeButtonSelected: {
    borderColor: '#0ea5e9',
    backgroundColor: '#dbeafe',
  },
  typeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#0ea5e9',
    fontWeight: 'bold',
  },
  inputCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 50,
  },
  submitButton: {
    backgroundColor: '#0ea5e9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

