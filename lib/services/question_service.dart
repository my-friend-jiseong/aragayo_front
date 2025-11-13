import 'package:cloud_firestore/cloud_firestore.dart';
import '../models/question.dart';
import '../utils/constants.dart';

class QuestionService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;

  // 최신 OPEN 질문 가져오기
  Future<Question?> getLatestOpenQuestion() async {
    final querySnapshot = await _firestore
        .collection(AppConstants.questionsCollection)
        .where('status', isEqualTo: AppConstants.questionStatusOpen)
        .orderBy('createdAt', descending: true)
        .limit(1)
        .get();

    if (querySnapshot.docs.isEmpty) return null;
    return Question.fromFirestore(querySnapshot.docs.first);
  }

  // 질문 실시간 스트림 (최신 1개)
  Stream<Question?> getLatestOpenQuestionStream() {
    return _firestore
        .collection(AppConstants.questionsCollection)
        .where('status', isEqualTo: AppConstants.questionStatusOpen)
        .orderBy('createdAt', descending: true)
        .limit(1)
        .snapshots()
        .map((snapshot) {
      if (snapshot.docs.isEmpty) return null;
      return Question.fromFirestore(snapshot.docs.first);
    });
  }

  // 질문 생성
  Future<String> createQuestion({
    required String text,
    required String type,
    required String optionA,
    required String optionB,
    required String deviceId,
  }) async {
    final questionRef = _firestore.collection(AppConstants.questionsCollection).doc();
    
    final question = Question(
      questionId: questionRef.id,
      text: text,
      type: type,
      optionA: optionA,
      optionB: optionB,
      votesA: 0,
      votesB: 0,
      totalVotes: 0,
      createdAt: DateTime.now(),
      status: AppConstants.questionStatusOpen,
      createdBy: deviceId,
    );

    await questionRef.set(question.toFirestore());
    return questionRef.id;
  }

  // 질문 가져오기
  Future<Question?> getQuestion(String questionId) async {
    final doc = await _firestore
        .collection(AppConstants.questionsCollection)
        .doc(questionId)
        .get();

    if (!doc.exists) return null;
    return Question.fromFirestore(doc);
  }

  // 질문 실시간 스트림
  Stream<Question?> getQuestionStream(String questionId) {
    return _firestore
        .collection(AppConstants.questionsCollection)
        .doc(questionId)
        .snapshots()
        .map((doc) => doc.exists ? Question.fromFirestore(doc) : null);
  }
}

