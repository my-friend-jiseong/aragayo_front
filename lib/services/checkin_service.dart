import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import '../models/checkin.dart';
import '../utils/constants.dart';

class CheckinService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final FirebaseFunctions _functions = FirebaseFunctions.instance;

  // 오늘 출석했는지 확인
  Future<bool> hasCheckedInToday(String deviceId) async {
    final today = DateTime.now();
    final dateString = '${today.year}-${today.month.toString().padLeft(2, '0')}-${today.day.toString().padLeft(2, '0')}';

    final querySnapshot = await _firestore
        .collection(AppConstants.checkinsCollection)
        .where('deviceId', isEqualTo: deviceId)
        .where('date', isEqualTo: dateString)
        .limit(1)
        .get();

    return querySnapshot.docs.isNotEmpty;
  }

  // 출석 체크 (Cloud Function 호출)
  Future<void> submitCheckin(String deviceId) async {
    try {
      final callable = _functions.httpsCallable('submitCheckin');
      await callable.call({
        'deviceId': deviceId,
      });
    } catch (e) {
      throw Exception('출석 체크 실패: $e');
    }
  }

  // 출석 내역 가져오기
  Future<List<Checkin>> getCheckinsByDevice(String deviceId) async {
    final querySnapshot = await _firestore
        .collection(AppConstants.checkinsCollection)
        .where('deviceId', isEqualTo: deviceId)
        .orderBy('createdAt', descending: true)
        .get();

    return querySnapshot.docs
        .map((doc) => Checkin.fromFirestore(doc))
        .toList();
  }
}

