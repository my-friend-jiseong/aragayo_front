import 'package:cloud_firestore/cloud_firestore.dart';

class Vote {
  final String voteId;
  final String questionId;
  final String deviceId;
  final String choice; // A or B
  final DateTime createdAt;

  Vote({
    required this.voteId,
    required this.questionId,
    required this.deviceId,
    required this.choice,
    required this.createdAt,
  });

  factory Vote.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Vote(
      voteId: doc.id,
      questionId: data['questionId'] ?? '',
      deviceId: data['deviceId'] ?? '',
      choice: data['choice'] ?? '',
      createdAt: (data['createdAt'] as Timestamp).toDate(),
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'questionId': questionId,
      'deviceId': deviceId,
      'choice': choice,
      'createdAt': Timestamp.fromDate(createdAt),
    };
  }
}

