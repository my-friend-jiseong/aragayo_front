# aragayo_front (즉결심판 · BlogRec-Map)

지역 대학생 고민 투표 앱 + BlogRec-Map 프로토타입(`blogrec-map/`)

## 🎯 Expo Go로 바로 실행

```bash
npm install
npx expo start
```

QR 코드를 스캔하면 바로 실행됩니다.

## 주요 기능

- 고민 투표 (YES/NO 또는 A/B)
- 출석 체크 (GPS 기반 캠퍼스 인증)
- 포인트 시스템 (투표 +5P, 출석 +10P)
- 실시간 투표 결과 확인
- 익명 기기 기반 인증

## BlogRec-Map

`blogrec-map/index.html` — Velog 연동 개념 맵 기반 블로그 추천 프로토타입 (단일 HTML)

```bash
npx serve blogrec-map -p 3456
```

## 기술 스택

- Expo SDK 54 · React Native · AsyncStorage · Redux · Expo Location

## 프로젝트 구조

```
src/           # 앱 화면·서비스
blogrec-map/   # BlogRec-Map 웹 프로토타입
```

## 데이터 저장

모든 앱 데이터는 기기 AsyncStorage에 저장됩니다. 앱 삭제 시 데이터도 삭제됩니다.
