import 'package:cloud_firestore/cloud_firestore.dart';

class Checkin {
  final String checkinId;
  final String deviceId;
  final String date; // YYYY-MM-DD 형식
  final String locationType; // campus
  final DateTime createdAt;

  Checkin({
    required this.checkinId,
    required this.deviceId,
    required this.date,
    required this.locationType,
    required this.createdAt,
  });

  factory Checkin.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Checkin(
      checkinId: doc.id,
      deviceId: data['deviceId'] ?? '',
      date: data['date'] ?? '',
      locationType: data['locationType'] ?? 'campus',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'deviceId': deviceId,
      'date': date,
      'locationType': locationType,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

