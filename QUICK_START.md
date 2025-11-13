# 빠른 시작 가이드 (5분 버전)

## 필수 단계만 빠르게!

### 1. Firebase 프로젝트 생성 (2분)
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" → 이름: `즉결심판` → 생성

### 2. Android 앱 등록 (1분)
1. "Android 앱 추가" 클릭
2. 패키지 이름: `com.example.jeukgyeol_simpan`
3. **google-services.json** 다운로드
4. 파일을 `android/app/google-services.json`에 복사

### 3. Firestore 생성 (1분)
1. "Firestore Database" → "데이터베이스 만들기"
2. 테스트 모드로 시작
3. 위치: asia-northeast3 (서울)
4. "사용 설정"

### 4. Authentication 설정 (30초)
1. "Authentication" → "시작하기"
2. "Sign-in method" → "익명" → 사용 설정 ON

### 5. Firebase CLI 설치 (1분)
```bash
npm install -g firebase-tools
firebase login
firebase init
```
- Firestore: 선택
- Functions: 선택
- 나머지는 기본값으로 Enter

### 6. 프로젝트 연결
```bash
firebase use --add
```
- 방금 만든 프로젝트 선택

### 7. Functions 배포 (2분)
```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 8. 인덱스 배포
```bash
firebase deploy --only firestore:indexes
firebase deploy --only firestore:rules
```

### 9. 캠퍼스 위치 설정
`lib/utils/constants.dart` 파일에서 실제 캠퍼스 좌표 수정

### 10. 실행!
```bash
flutter pub get
flutter run
```

---

## 완료! 🎉

이제 앱을 실행하고 테스트해보세요!

