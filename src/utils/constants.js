export const AppConstants = {
  // Firestore 컬렉션 이름
  devicesCollection: 'devices',
  questionsCollection: 'questions',
  votesCollection: 'votes',
  checkinsCollection: 'checkins',
  
  // AsyncStorage 키
  deviceIdKey: 'device_id',
  
  // 포인트
  votePointCost: 50, // 투표 시 차감
  checkinPointReward: 100, // 출석 시 획득
  verificationPointReward: 100, // 사진 인증 시 획득
  
  // 투표 타이머 (10초)
  voteTimerSeconds: 10,
  
  // 카테고리
  categories: [
    { id: 'all', name: '전체', icon: '📋' },
    { id: 'study', name: '공부', icon: '📚' },
    { id: 'work', name: '알바/취업', icon: '💼' },
    { id: 'relationship', name: '인간관계', icon: '👥' },
    { id: 'money', name: '돈/소비', icon: '💰' },
    { id: 'health', name: '건강', icon: '💪' },
    { id: 'love', name: '연애', icon: '💕' },
    { id: 'hobby', name: '취미/여가', icon: '🎮' },
    { id: 'etc', name: '기타', icon: '🤔' },
  ],
  
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

