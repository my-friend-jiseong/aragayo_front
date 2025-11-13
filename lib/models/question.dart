import 'package:cloud_firestore/cloud_firestore.dart';
import '../utils/constants.dart';

class Question {
  final String questionId;
  final String text;
  final String type; // YES_NO or A_B
  final String optionA;
  final String optionB;
  final int votesA;
  final int votesB;
  final int totalVotes;
  final DateTime createdAt;
  final String status; // OPEN or CLOSED
  final String createdBy;

  Question({
    required this.questionId,
    required this.text,
    required this.type,
    required this.optionA,
    required this.optionB,
    required this.votesA,
    required this.votesB,
    required this.totalVotes,
    required this.createdAt,
    required this.status,
    required this.createdBy,
  });

  factory Question.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    return Question(
      questionId: doc.id,
      text: data['text'] ?? '',
      type: data['type'] ?? AppConstants.questionTypeYesNo,
      optionA: data['optionA'] ?? 'YES',
      optionB: data['optionB'] ?? 'NO',
      votesA: data['votesA'] ?? 0,
      votesB: data['votesB'] ?? 0,
      totalVotes: data['totalVotes'] ?? 0,
      createdAt: (data['createdAt'] as Timestamp).toDate(),
      status: data['status'] ?? AppConstants.questionStatusOpen,
      createdBy: data['createdBy'] ?? '',
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'text': text,
      'type': type,
      'optionA': optionA,
      'optionB': optionB,
      'votesA': votesA,
      'votesB': votesB,
      'totalVotes': totalVotes,
      'createdAt': Timestamp.fromDate(createdAt),
      'status': status,
      'createdBy': createdBy,
    };
  }

  double get percentageA {
    if (totalVotes == 0) return 0.0;
    return (votesA / totalVotes) * 100;
  }

  double get percentageB {
    if (totalVotes == 0) return 0.0;
    return (votesB / totalVotes) * 100;
  }

  bool get isOpen => status == AppConstants.questionStatusOpen;
}

