# Expo Go로 즉결심판 실행하기 🚀

## 초간단 설정 (5분!)

### 1단계: Firebase 설정만 하기

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 프로젝트 생성: `즉결심판`
3. **웹 앱 추가** 클릭 (Android 말고 웹!)
4. 앱 닉네임: `즉결심판`
5. Firebase SDK 설정 복사

### 2단계: Firebase 설정 코드에 붙여넣기

`src/services/firebaseInit.js` 파일을 열고:

```javascript
const firebaseConfig = {
  apiKey: "여기에 복사한 값 붙여넣기",
  authDomain: "여기에 복사한 값 붙여넣기",
  projectId: "여기에 복사한 값 붙여넣기",
  storageBucket: "여기에 복사한 값 붙여넣기",
  messagingSenderId: "여기에 복사한 값 붙여넣기",
  appId: "여기에 복사한 값 붙여넣기"
};
```

### 3단계: Firestore 생성

1. Firebase 콘솔 > Firestore Database
2. "데이터베이스 만들기"
3. 테스트 모드로 시작
4. 위치: asia-northeast3 (서울)

### 4단계: Authentication 설정

1. Authentication > 시작하기
2. Sign-in method > 익명 > 사용 설정 ON

### 5단계: Cloud Functions 배포

```bash
cd functions
npm install
cd ..
firebase deploy --only functions
```

### 6단계: Expo Go로 실행!

```bash
npm install
npx expo start
```

QR 코드를 스캔하면 바로 실행됩니다! 📱

---

## 완료! 🎉

이제 Expo Go 앱에서 바로 테스트할 수 있습니다!

## 문제 해결

### Firebase 초기화 오류
- `firebaseInit.js`의 설정값이 올바른지 확인

### Functions 오류
- Functions가 배포되었는지 확인: `firebase functions:log`

### 위치 권한 오류
- Expo Go에서 위치 권한 허용 필요

