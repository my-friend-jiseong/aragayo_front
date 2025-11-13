const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const db = admin.firestore();

/**
 * 투표 제출 Cloud Function
 * - 중복 투표 방지
 * - questions 집계 수 증가
 * - devices 포인트 증가
 */
exports.submitVote = functions.https.onCall(async (data, context) => {
  const { questionId, deviceId, choice } = data;

  // 입력 검증
  if (!questionId || !deviceId || !choice) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      '필수 파라미터가 누락되었습니다.'
    );
  }

  if (choice !== 'A' && choice !== 'B') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'choice는 A 또는 B여야 합니다.'
    );
  }

  try {
    // 중복 투표 확인
    const voteQuery = await db.collection('votes')
      .where('questionId', '==', questionId)
      .where('deviceId', '==', deviceId)
      .limit(1)
      .get();

    if (!voteQuery.empty) {
      throw new functions.https.HttpsError(
        'already-exists',
        '이미 투표했습니다.'
      );
    }

    // 질문 존재 확인
    const questionDoc = await db.collection('questions').doc(questionId).get();
    if (!questionDoc.exists) {
      throw new functions.https.HttpsError(
        'not-found',
        '질문을 찾을 수 없습니다.'
      );
    }

    const questionData = questionDoc.data();
    if (questionData.status !== 'OPEN') {
      throw new functions.https.HttpsError(
        'failed-precondition',
        '이미 종료된 질문입니다.'
      );
    }

    // 투표 기록 생성
    const voteRef = db.collection('votes').doc();
    await voteRef.set({
      questionId: questionId,
      deviceId: deviceId,
      choice: choice,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 질문 집계 수 업데이트
    const updateData = {
      totalVotes: admin.firestore.FieldValue.increment(1),
    };

    if (choice === 'A') {
      updateData.votesA = admin.firestore.FieldValue.increment(1);
    } else {
      updateData.votesB = admin.firestore.FieldValue.increment(1);
    }

    await db.collection('questions').doc(questionId).update(updateData);

    // 디바이스 포인트 증가
    await db.collection('devices').doc(deviceId).update({
      points: admin.firestore.FieldValue.increment(5),
      totalVotes: admin.firestore.FieldValue.increment(1),
      lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: '투표가 완료되었습니다.' };
  } catch (error) {
    console.error('투표 제출 오류:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      '투표 제출 중 오류가 발생했습니다.'
    );
  }
});

/**
 * 출석 체크 Cloud Function
 * - 하루 1회 제한
 * - devices 포인트 증가
 */
exports.submitCheckin = functions.https.onCall(async (data, context) => {
  const { deviceId } = data;

  // 입력 검증
  if (!deviceId) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'deviceId가 필요합니다.'
    );
  }

  try {
    // 오늘 날짜 문자열 생성 (YYYY-MM-DD)
    const today = new Date();
    const dateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 오늘 이미 출석했는지 확인
    const checkinQuery = await db.collection('checkins')
      .where('deviceId', '==', deviceId)
      .where('date', '==', dateString)
      .limit(1)
      .get();

    if (!checkinQuery.empty) {
      throw new functions.https.HttpsError(
        'already-exists',
        '오늘 이미 출석했습니다.'
      );
    }

    // 출석 기록 생성
    const checkinRef = db.collection('checkins').doc();
    await checkinRef.set({
      deviceId: deviceId,
      date: dateString,
      locationType: 'campus',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 디바이스 포인트 증가
    await db.collection('devices').doc(deviceId).update({
      points: admin.firestore.FieldValue.increment(10),
      totalCheckins: admin.firestore.FieldValue.increment(1),
      lastActiveAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true, message: '출석이 완료되었습니다.' };
  } catch (error) {
    console.error('출석 체크 오류:', error);
    if (error instanceof functions.https.HttpsError) {
      throw error;
    }
    throw new functions.https.HttpsError(
      'internal',
      '출석 체크 중 오류가 발생했습니다.'
    );
  }
});

