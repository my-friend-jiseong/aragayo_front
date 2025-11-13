import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';
import '../models/device.dart';
import '../utils/constants.dart';

class DeviceService {
  final FirebaseFirestore _firestore = FirebaseFirestore.instance;
  final Uuid _uuid = const Uuid();

  // deviceId 가져오기 또는 생성
  Future<String> getOrCreateDeviceId() async {
    final prefs = await SharedPreferences.getInstance();
    String? deviceId = prefs.getString(AppConstants.deviceIdKey);

    if (deviceId == null || deviceId.isEmpty) {
      deviceId = _uuid.v4();
      await prefs.setString(AppConstants.deviceIdKey, deviceId);
      await createDevice(deviceId);
    } else {
      // 기존 deviceId가 있으면 Firestore에 존재하는지 확인
      final doc = await _firestore
          .collection(AppConstants.devicesCollection)
          .doc(deviceId)
          .get();
      if (!doc.exists) {
        await createDevice(deviceId);
      } else {
        // lastActiveAt 업데이트
        await updateLastActiveAt(deviceId);
      }
    }

    return deviceId;
  }

  // Device 문서 생성
  Future<void> createDevice(String deviceId) async {
    final now = DateTime.now();
    final device = Device(
      deviceId: deviceId,
      points: 0,
      totalVotes: 0,
      totalCheckins: 0,
      createdAt: now,
      lastActiveAt: now,
    );

    await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .set(device.toFirestore());
  }

  // Device 정보 가져오기
  Future<Device?> getDevice(String deviceId) async {
    final doc = await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .get();

    if (!doc.exists) return null;
    return Device.fromFirestore(doc);
  }

  // Device 실시간 스트림
  Stream<Device?> getDeviceStream(String deviceId) {
    return _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .snapshots()
        .map((doc) => doc.exists ? Device.fromFirestore(doc) : null);
  }

  // 마지막 활동 시간 업데이트
  Future<void> updateLastActiveAt(String deviceId) async {
    await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .update({
      'lastActiveAt': Timestamp.fromDate(DateTime.now()),
    });
  }

  // 포인트 증가 (Cloud Function에서 호출하거나 직접 업데이트)
  Future<void> addPoints(String deviceId, int points) async {
    await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .update({
      'points': FieldValue.increment(points),
    });
  }

  // 투표 수 증가
  Future<void> incrementTotalVotes(String deviceId) async {
    await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .update({
      'totalVotes': FieldValue.increment(1),
    });
  }

  // 출석 수 증가
  Future<void> incrementTotalCheckins(String deviceId) async {
    await _firestore
        .collection(AppConstants.devicesCollection)
        .doc(deviceId)
        .update({
      'totalCheckins': FieldValue.increment(1),
    });
  }
}

