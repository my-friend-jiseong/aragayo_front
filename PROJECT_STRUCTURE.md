# 즉결심판 프로젝트 구조

## 전체 실행 흐름도

```
1. 앱 시작 (main.dart)
   ↓
2. Firebase 초기화 및 익명 로그인
   ↓
3. SplashScreen
   ↓
4. AppProvider 초기화
   - deviceId 가져오기/생성
   - Device 스트림 구독
   - 최신 Question 스트림 구독
   ↓
5. HomeScreen
   - 현재 포인트 표시
   - 출석하기 버튼
   - 현재 질문 표시
   - 투표하기 버튼
   ↓
6. VoteScreen (투표 화면)
   - 10초 타이밍
   - YES/NO 또는 A/B 선택
   - Cloud Function 호출 (submitVote)
   ↓
7. ResultScreen (결과 화면)
   - 실시간 투표 결과 표시
   - 그래프 UI
```

## Cloud Functions 실행 흐름

### submitVote
```
1. 중복 투표 확인 (votes 컬렉션)
2. 질문 존재 및 OPEN 상태 확인
3. votes 컬렉션에 투표 기록 생성
4. questions 문서 업데이트 (votesA/votesB/totalVotes 증가)
5. devices 문서 업데이트 (points +5, totalVotes +1)
```

### submitCheckin
```
1. 오늘 날짜의 출석 기록 확인 (checkins 컬렉션)
2. checkins 컬렉션에 출석 기록 생성
3. devices 문서 업데이트 (points +10, totalCheckins +1)
```

## 주요 서비스 클래스 역할

- **DeviceService**: deviceId 관리, Device CRUD, 포인트 관리
- **QuestionService**: Question CRUD, 실시간 스트림
- **VoteService**: 투표 제출 (Cloud Function 호출), 중복 확인
- **CheckinService**: 출석 체크 (Cloud Function 호출), 중복 확인
- **LocationService**: GPS 위치 확인, 캠퍼스 범위 검증
- **PointService**: 포인트 지급 로직 (Cloud Function에서 처리)

## Firestore 컬렉션 구조

### devices/{deviceId}
- 포인트, 투표 수, 출석 수 관리
- 실시간 업데이트

### questions/{questionId}
- 질문 텍스트, 타입, 옵션
- 투표 집계 수 (votesA, votesB, totalVotes)
- 상태 (OPEN/CLOSED)

### votes/{voteId}
- 투표 기록 (questionId, deviceId, choice)
- 중복 방지용

### checkins/{checkinId}
- 출석 기록 (deviceId, date, locationType)
- 하루 1회 제한용

