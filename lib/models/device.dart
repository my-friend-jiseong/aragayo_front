import 'package:cloud_firestore/cloud_firestore.dart';

class Device {
  final String deviceId;
  final int points;
  final int totalVotes;
  final int totalCheckins;
  final DateTime createdAt;
  final DateTime lastActiveAt;

  Device({
    required this.deviceId,
    required this.points,
    required this.totalVotes,
    required this.totalCheckins,
    required this.createdAt,
    required this.lastActiveAt,
  });

  factory Device.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Device(
      deviceId: doc.id,
      points: data['points'] ?? 0,
      totalVotes: data['totalVotes'] ?? 0,
      totalCheckins: data['totalCheckins'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      lastActiveAt: (data['lastActiveAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'points': points,
      'totalVotes': totalVotes,
      'totalCheckins': totalCheckins,
      'createdAt': Timestamp.fromDate(createdAt),
      'lastActiveAt': Timestamp.fromDate(lastActiveAt),
    };
  }

  Device copyWith({
    String? deviceId,
    int? points,
    int? totalVotes,
    int? totalCheckins,
    DateTime? createdAt,
    DateTime? lastActiveAt,
  }) {
    return Device(
      deviceId: deviceId ?? this.deviceId,
      points: points ?? this.points,
      totalVotes: totalVotes ?? this.totalVotes,
      totalCheckins: totalCheckins ?? this.totalCheckins,
      createdAt: createdAt ?? this.createdAt,
      lastActiveAt: lastActiveAt ?? this.lastActiveAt,
    );
  }
}

