import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../models/vote.dart';
import '../utils/constants.dart';

class VoteService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  // 이미 투표했는지 확인
  Future<bool> hasVoted(String questionId, String deviceId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.votesCollection)
        .where('questionId', isEqualTo: questionId)
        .where('deviceId', isEqualTo: deviceId)
        .limit(1)
        .get();

    return querySnapshot.docs.isNotEmpty;
  }

  // 투표 제출 (Cloud Function 호출)
  Future<void> submitVote({
    required String questionId,
    required String deviceId,
    required String choice, // 'A' or 'B'
  }) async {
    try {
      final callable = _functions.httpsCallable('submitVote');
      await callable.call({
        'questionId': questionId,
        'deviceId': deviceId,
        'choice': choice,
      });
    } catch (e) {
      throw Exception('투표 제출 실패: $e');
    }
  }

  // 투표 내역 가져오기
  Future<List<Vote>> getVotesByQuestion(String questionId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.votesCollection)
        .where('questionId', isEqualTo: questionId)
        .get();

    return querySnapshot.docs
        .map((doc) => Vote.fromFirestore(doc))
        .toList();
  }

  // 사용자의 투표 가져오기
  Future<Vote?> getUserVote(String questionId, String deviceId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.votesCollection)
        .where('questionId', isEqualTo: questionId)
        .where('deviceId', isEqualTo: deviceId)
        .limit(1)
        .get();

    if (querySnapshot.docs.isEmpty) return null;
    return Vote.fromFirestore(querySnapshot.docs.first);
  }
}

