# 즉결심판 앱 설정 가이드

## 1. Firebase 프로젝트 설정

### 1.1 Firebase 콘솔에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. 프로젝트 이름: "즉결심판" (또는 원하는 이름)

### 1.2 Android 앱 등록
1. 프로젝트 설정 > 앱 추가 > Android
2. 패키지 이름 입력 (예: `com.example.jeukgyeol_simpan`)
3. `google-services.json` 다운로드
4. `android/app/` 폴더에 `google-services.json` 복사

### 1.3 iOS 앱 등록 (선택사항)
1. 프로젝트 설정 > 앱 추가 > iOS
2. 번들 ID 입력
3. `GoogleService-Info.plist` 다운로드
4. `ios/Runner/` 폴더에 `GoogleService-Info.plist` 복사

### 1.4 Firestore 데이터베이스 생성
1. Firestore Database > 데이터베이스 만들기
2. 테스트 모드로 시작 (나중에 규칙 적용)
3. 위치 선택 (asia-northeast3 권장)

### 1.5 Authentication 설정
1. Authentication > Sign-in method
2. 익명 로그인 활성화

### 1.6 Cloud Functions 설정
1. Functions > 시작하기
2. Node.js 18 선택
3. `functions` 폴더에서 배포:
   ```bash
   cd functions
   npm install
   firebase deploy --only functions
   ```

## 2. Flutter 프로젝트 설정

### 2.1 의존성 설치
```bash
flutter pub get
```

### 2.2 Android 설정

#### android/app/build.gradle
```gradle
dependencies {
    // ... 기존 코드 ...
    implementation platform('com.google.firebase:firebase-bom:32.7.0')
}
```

#### android/build.gradle
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.4.0'
}
```

### 2.3 iOS 설정 (선택사항)

#### ios/Runner/Info.plist
위치 권한 추가:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>캠퍼스 출석 확인을 위해 위치 정보가 필요합니다.</string>
```

## 3. 캠퍼스 위치 설정

`lib/utils/constants.dart` 파일에서 캠퍼스 좌표 수정:

```dart
static const double campusLatitude = 37.5665; // 실제 캠퍼스 위도
static const double campusLongitude = 126.9780; // 실제 캠퍼스 경도
static const double campusRadiusMeters = 500.0; // 반경 (미터)
```

## 4. Firestore 인덱스 생성

Firebase 콘솔에서 다음 인덱스 생성:

1. **questions 컬렉션**
   - 필드: `status` (오름차순), `createdAt` (내림차순)

2. **votes 컬렉션**
   - 필드: `questionId` (오름차순), `deviceId` (오름차순)

3. **checkins 컬렉션**
   - 필드: `deviceId` (오름차순), `date` (오름차순)

또는 `firestore.indexes.json` 파일을 Firebase에 배포:
```bash
firebase deploy --only firestore:indexes
```

## 5. 실행

```bash
flutter run
```

## 6. 테스트

1. 앱 실행 후 deviceId 자동 생성 확인
2. 고민 작성하기 테스트
3. 투표하기 테스트 (10초 타이머 확인)
4. 출석하기 테스트 (GPS 위치 확인)
5. 포인트 증가 확인

## 문제 해결

### Firebase 초기화 오류
- `google-services.json` 파일이 올바른 위치에 있는지 확인
- Firebase 프로젝트 설정 확인

### 위치 권한 오류
- Android: `AndroidManifest.xml`에 위치 권한 추가
- iOS: `Info.plist`에 위치 권한 설명 추가

### Cloud Functions 오류
- Functions 로그 확인: `firebase functions:log`
- 로컬 테스트: `firebase emulators:start`

