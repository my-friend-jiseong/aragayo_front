export const AppConstants = {
  // Firestore 컬렉션 이름
  devicesCollection: 'devices',
  questionsCollection: 'questions',
  votesCollection: 'votes',
  checkinsCollection: 'checkins',
  
  // AsyncStorage 키
  deviceIdKey: 'device_id',
  
  // 포인트
  votePointReward: 5,
  checkinPointReward: 10,
  
  // 투표 타이머
  voteTimerSeconds: 10,
  
  // 캠퍼스 위치 (예시 - 실제 캠퍼스 좌표로 변경 필요)
  campusLatitude: 37.5665,
  campusLongitude: 126.9780,
  campusRadiusMeters: 500.0, // 500m 반경
  
  // 질문 상태
  questionStatusOpen: 'OPEN',
  questionStatusClosed: 'CLOSED',
  
  // 질문 타입
  questionTypeYesNo: 'YES_NO',
  questionTypeAB: 'A_B',
};

