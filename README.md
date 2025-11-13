# 즉결심판 (로컬 스토리지 버전) 🚀

지역 대학생의 고민을 10초 안에 YES/NO 또는 A/B로 투표해주는 앱

## 🎯 Expo Go로 바로 실행!

```bash
npm install
npx expo start
```

QR 코드를 스캔하면 바로 실행됩니다! 📱

## 주요 기능

- ✅ 고민 투표 (YES/NO 또는 A/B)
- ✅ 출석 체크 (GPS 기반 캠퍼스 인증)
- ✅ 포인트 시스템 (투표 +5P, 출석 +10P)
- ✅ 실시간 투표 결과 확인
- ✅ 익명 기기 기반 인증

## 🎉 Firebase 없이 작동!

- **로컬 스토리지 기반**: AsyncStorage 사용
- **설정 불필요**: 바로 실행 가능
- **간단한 구조**: 복잡한 백엔드 없이 작동

## 기술 스택

- Expo SDK 54
- React Native
- AsyncStorage (로컬 저장소)
- Redux (상태관리)
- Expo Location

## 프로젝트 구조

```
src/
├── screens/          # 화면 컴포넌트
├── services/         # 로컬 스토리지 서비스
│   └── localStorage.js  # 모든 데이터 저장
├── store/           # Redux store
└── utils/           # 상수 및 유틸리티
```

## 빠른 시작

1. 의존성 설치: `npm install`
2. 실행: `npx expo start`
3. QR 코드 스캔
4. 완료! 🎉

## 데이터 저장

모든 데이터는 기기의 AsyncStorage에 저장됩니다:
- 질문과 투표 결과
- 사용자 포인트
- 출석 기록

**참고**: 앱을 삭제하면 데이터도 함께 삭제됩니다.
