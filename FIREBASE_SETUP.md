# Firebase 설정 완벽 가이드

## 1단계: Firebase 프로젝트 생성

### 1.1 Firebase 콘솔 접속
1. 브라우저에서 [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 추가" 클릭
2. 프로젝트 이름 입력: `즉결심판` (또는 원하는 이름)
3. Google Analytics 설정 (선택사항 - 체크 해제해도 됨)
4. "프로젝트 만들기" 클릭
5. 생성 완료까지 대기 (약 1분)

---

## 2단계: Android 앱 등록

### 2.1 앱 추가
1. Firebase 프로젝트 대시보드에서 "Android 앱 추가" 클릭 (또는 설정 > 프로젝트 설정 > 앱 추가)
2. Android 아이콘 클릭

### 2.2 패키지 이름 설정
1. **패키지 이름** 입력: `com.example.jeukgyeol_simpan`
   - ⚠️ 중요: 이 패키지 이름은 나중에 Flutter 앱의 `android/app/build.gradle`의 `applicationId`와 일치해야 합니다!
2. 앱 닉네임: `즉결심판` (선택사항)
3. 디버그 서명 인증서 SHA-1: 비워두기 (나중에 추가 가능)
4. "앱 등록" 클릭

### 2.3 google-services.json 다운로드
1. **google-services.json** 파일 다운로드 버튼 클릭
2. 다운로드한 파일을 다음 위치에 복사:
   ```
   android/app/google-services.json
   ```
   ⚠️ 파일 경로가 정확해야 합니다!

### 2.4 다음 단계 건너뛰기
- "다음" 버튼을 클릭하되, SDK 설정은 나중에 할 예정이므로 일단 건너뛰기

---

## 3단계: Firestore 데이터베이스 생성

### 3.1 Firestore Database 생성
1. Firebase 콘솔 왼쪽 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭

### 3.2 보안 규칙 설정
1. **프로덕션 모드로 시작** 선택 (나중에 규칙 적용)
   - 또는 **테스트 모드로 시작** 선택 (개발 중에는 편리함)
2. "다음" 클릭

### 3.3 위치 선택
1. **asia-northeast3 (서울)** 선택 (가장 빠름)
   - 또는 가장 가까운 지역 선택
2. "사용 설정" 클릭
3. 데이터베이스 생성 완료까지 대기 (약 1분)

### 3.4 Firestore 규칙 배포
터미널에서 실행:
```bash
firebase deploy --only firestore:rules
```

---

## 4단계: Authentication 설정

### 4.1 익명 로그인 활성화
1. Firebase 콘솔 왼쪽 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭 (처음인 경우)
3. "Sign-in method" 탭 클릭
4. "익명" 클릭
5. "사용 설정" 토글을 **ON**으로 변경
6. "저장" 클릭

---

## 5단계: Firebase CLI 설치 및 로그인

### 5.1 Node.js 설치 확인
```bash
node --version
```
- Node.js가 없으면 [nodejs.org](https://nodejs.org/)에서 설치 (LTS 버전 권장)

### 5.2 Firebase CLI 설치
```bash
npm install -g firebase-tools
```

### 5.3 Firebase 로그인
```bash
firebase login
```
- 브라우저가 열리면 Google 계정으로 로그인
- 권한 승인

### 5.4 프로젝트 초기화
프로젝트 루트 디렉토리에서:
```bash
firebase init
```

선택 사항:
1. **Firestore**: `Space`로 선택, `Enter`
2. **Functions**: `Space`로 선택, `Enter`
3. **Firestore rules**: `firestore.rules` (기본값), `Enter`
4. **Firestore indexes**: `firestore.indexes.json` (기본값), `Enter`
5. **Functions directory**: `functions` (기본값), `Enter`
6. **Functions language**: `JavaScript` 선택
7. **ESLint**: `Yes` 선택
8. **Install dependencies**: `Yes` 선택

### 5.5 Firebase 프로젝트 연결
```bash
firebase use --add
```
- 방금 만든 Firebase 프로젝트 선택
- 별칭: `default` (또는 원하는 이름)

---

## 6단계: Cloud Functions 배포

### 6.1 Functions 의존성 설치
```bash
cd functions
npm install
```

### 6.2 Functions 배포
```bash
cd ..
firebase deploy --only functions
```

배포 완료까지 약 2-3분 소요됩니다.

배포 성공 시 다음과 같은 URL이 표시됩니다:
```
Function URL: https://asia-northeast3-프로젝트ID.cloudfunctions.net/submitVote
```

---

## 7단계: Firestore 인덱스 생성

### 7.1 자동 배포 (권장)
```bash
firebase deploy --only firestore:indexes
```

### 7.2 수동 생성 (선택사항)
Firebase 콘솔에서:
1. Firestore Database > 인덱스 탭
2. "인덱스 만들기" 클릭
3. 다음 인덱스들을 각각 생성:

**인덱스 1: questions**
- 컬렉션 ID: `questions`
- 필드: `status` (오름차순), `createdAt` (내림차순)

**인덱스 2: votes**
- 컬렉션 ID: `votes`
- 필드: `questionId` (오름차순), `deviceId` (오름차순)

**인덱스 3: checkins**
- 컬렉션 ID: `checkins`
- 필드: `deviceId` (오름차순), `date` (오름차순)

---

## 8단계: Flutter 앱 설정 확인

### 8.1 패키지 이름 확인
`android/app/build.gradle` 파일에서:
```gradle
applicationId "com.example.jeukgyeol_simpan"
```
이 값이 Firebase에서 등록한 패키지 이름과 일치하는지 확인!

### 8.2 google-services.json 위치 확인
파일이 다음 위치에 있는지 확인:
```
android/app/google-services.json
```

### 8.3 의존성 설치
```bash
flutter pub get
```

---

## 9단계: 캠퍼스 위치 설정

`lib/utils/constants.dart` 파일을 열고 실제 캠퍼스 좌표로 수정:

```dart
// 예시: 서울대학교
static const double campusLatitude = 37.4599;
static const double campusLongitude = 126.9522;
static const double campusRadiusMeters = 500.0; // 500m 반경
```

위도/경도 찾는 방법:
1. Google Maps에서 캠퍼스 위치 검색
2. 우클릭 > 좌표 복사
3. 위도, 경도 값 사용

---

## 10단계: 테스트

### 10.1 앱 실행
```bash
flutter run
```

### 10.2 기능 테스트
1. ✅ 앱 실행 시 deviceId 자동 생성 확인
2. ✅ 고민 작성하기 테스트
3. ✅ 투표하기 테스트 (10초 타이머 확인)
4. ✅ 출석하기 테스트 (GPS 위치 확인)
5. ✅ 포인트 증가 확인

---

## 문제 해결

### 문제 1: google-services.json을 찾을 수 없음
- 파일이 `android/app/` 폴더에 정확히 있는지 확인
- 파일 이름이 정확히 `google-services.json`인지 확인 (대소문자 구분)

### 문제 2: Firebase 초기화 오류
- `google-services.json` 파일이 올바른 프로젝트의 것인지 확인
- Firebase 프로젝트에서 패키지 이름이 일치하는지 확인

### 문제 3: Cloud Functions 배포 실패
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 문제 4: 위치 권한 오류
Android: `AndroidManifest.xml`에 위치 권한이 추가되어 있는지 확인
iOS: `Info.plist`에 위치 권한 설명이 추가되어 있는지 확인

### 문제 5: Firestore 인덱스 오류
콘솔에서 인덱스 생성 링크를 클릭하거나:
```bash
firebase deploy --only firestore:indexes
```

---

## 완료 체크리스트

- [ ] Firebase 프로젝트 생성 완료
- [ ] Android 앱 등록 완료
- [ ] google-services.json 다운로드 및 배치 완료
- [ ] Firestore 데이터베이스 생성 완료
- [ ] Authentication 익명 로그인 활성화 완료
- [ ] Firebase CLI 설치 및 로그인 완료
- [ ] Cloud Functions 배포 완료
- [ ] Firestore 인덱스 생성 완료
- [ ] 캠퍼스 위치 설정 완료
- [ ] 앱 실행 및 테스트 완료

---

## 다음 단계

모든 설정이 완료되면:
1. `flutter run`으로 앱 실행
2. 첫 번째 고민 작성해보기
3. 투표 기능 테스트
4. 출석 기능 테스트

축하합니다! 🎉

