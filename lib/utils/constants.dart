class AppConstants {
  // Firestore 컬렉션 이름
  static const String devicesCollection = 'devices';
  static const String questionsCollection = 'questions';
  static const String votesCollection = 'votes';
  static const String checkinsCollection = 'checkins';
  
  // SharedPreferences 키
  static const String deviceIdKey = 'device_id';
  
  // 포인트
  static const int votePointReward = 5;
  static const int checkinPointReward = 10;
  
  // 투표 타이머
  static const int voteTimerSeconds = 10;
  
  // 캠퍼스 위치 (예시 - 실제 캠퍼스 좌표로 변경 필요)
  static const double campusLatitude = 37.5665;
  static const double campusLongitude = 126.9780;
  static const double campusRadiusMeters = 500.0; // 500m 반경
  
  // 질문 상태
  static const String questionStatusOpen = 'OPEN';
  static const String questionStatusClosed = 'CLOSED';
  
  // 질문 타입
  static const String questionTypeYesNo = 'YES_NO';
  static const String questionTypeAB = 'A_B';
}

