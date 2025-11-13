import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
    DEVICE_ID: 'device_id',
    DEVICES: 'devices',
    QUESTIONS: 'questions',
    VOTES: 'votes',
    CHECKINS: 'checkins',
};

// Device 관리
export const getOrCreateDeviceId = async () => {
    try {
        let deviceId = await AsyncStorage.getItem(STORAGE_KEYS.DEVICE_ID);

        if (!deviceId) {
            deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            await AsyncStorage.setItem(STORAGE_KEYS.DEVICE_ID, deviceId);

            // Device 생성
            const devices = await getDevices();
            devices[deviceId] = {
                deviceId,
                points: 0,
                totalVotes: 0,
                totalCheckins: 0,
                createdAt: new Date().toISOString(),
                lastActiveAt: new Date().toISOString(),
            };
            await saveDevices(devices);
        } else {
            // lastActiveAt 업데이트
            const devices = await getDevices();
            if (devices[deviceId]) {
                devices[deviceId].lastActiveAt = new Date().toISOString();
                await saveDevices(devices);
            }
        }

        return deviceId;
    } catch (error) {
        console.error('DeviceId 가져오기 오류:', error);
        throw error;
    }
};

export const getDevices = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.DEVICES);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        return {};
    }
};

export const saveDevices = async (devices) => {
    await AsyncStorage.setItem(STORAGE_KEYS.DEVICES, JSON.stringify(devices));
};

export const getDevice = async (deviceId) => {
    const devices = await getDevices();
    return devices[deviceId] || null;
};

export const updateDevice = async (deviceId, updates) => {
    const devices = await getDevices();
    if (devices[deviceId]) {
        devices[deviceId] = { ...devices[deviceId], ...updates };
        await saveDevices(devices);
    }
};

// Question 관리
export const getQuestions = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        return {};
    }
};

export const saveQuestions = async (questions) => {
    await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
};

export const getLatestOpenQuestion = async (category = 'all') => {
    const questions = await getQuestions();
    let openQuestions = Object.values(questions)
        .filter(q => q.status === 'OPEN');

    // 카테고리 필터링
    if (category !== 'all') {
        openQuestions = openQuestions.filter(q => q.category === category);
    }

    openQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return openQuestions.length > 0 ? openQuestions[0] : null;
};

export const getOpenQuestionsByCategory = async (category = 'all') => {
    const questions = await getQuestions();
    let openQuestions = Object.values(questions)
        .filter(q => q.status === 'OPEN');

    if (category !== 'all') {
        openQuestions = openQuestions.filter(q => q.category === category);
    }

    return openQuestions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

export const createQuestion = async ({ text, type, optionA, optionB, deviceId, category = 'etc' }) => {
    const questions = await getQuestions();
    const questionId = `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    questions[questionId] = {
        questionId,
        text,
        type,
        optionA,
        optionB,
        votesA: 0,
        votesB: 0,
        totalVotes: 0,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        createdBy: deviceId,
        category,
    };

    await saveQuestions(questions);
    return questionId;
};

export const getQuestion = async (questionId) => {
    const questions = await getQuestions();
    return questions[questionId] || null;
};

export const updateQuestion = async (questionId, updates) => {
    const questions = await getQuestions();
    if (questions[questionId]) {
        questions[questionId] = { ...questions[questionId], ...updates };
        await saveQuestions(questions);
    }
};

// 사진 인증
export const verifyQuestion = async (questionId, imageUri, deviceId) => {
    const question = await getQuestion(questionId);
    if (!question) {
        throw new Error('질문을 찾을 수 없습니다.');
    }

    if (question.createdBy !== deviceId) {
        throw new Error('본인이 작성한 질문만 인증할 수 있습니다.');
    }

    if (question.verified) {
        throw new Error('이미 인증된 질문입니다.');
    }

    // 질문 업데이트
    await updateQuestion(questionId, {
        verified: true,
        verificationImage: imageUri,
        verifiedAt: new Date().toISOString(),
    });

    // 질문 작성자에게 포인트 지급
    const device = await getDevice(deviceId);
    if (device) {
        const { verificationPointReward } = await import('../utils/constants');
        await updateDevice(deviceId, {
            points: device.points + verificationPointReward,
            lastActiveAt: new Date().toISOString(),
        });
    }
};

// 명예의 전당 (하루 최고 투표율 질문)
export const getHallOfFame = async () => {
    const questions = await getQuestions();
    const today = new Date().toISOString().split('T')[0];

    // 오늘 생성된 질문들 중에서
    const todayQuestions = Object.values(questions).filter(q => {
        const questionDate = new Date(q.createdAt).toISOString().split('T')[0];
        return questionDate === today && q.totalVotes > 0;
    });

    if (todayQuestions.length === 0) return null;

    // 투표율 계산 (totalVotes 기준이 아니라 비율로)
    const questionsWithRate = todayQuestions.map(q => {
        const rate = q.totalVotes > 0
            ? Math.max(q.votesA / q.totalVotes, q.votesB / q.totalVotes) * 100
            : 0;
        return { ...q, voteRate: rate };
    });

    // 투표율이 가장 높은 질문
    const hallOfFame = questionsWithRate.reduce((prev, current) => {
        return (prev.voteRate > current.voteRate) ? prev : current;
    });

    return hallOfFame;
};

// Vote 관리
export const getVotes = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.VOTES);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        return {};
    }
};

export const saveVotes = async (votes) => {
    await AsyncStorage.setItem(STORAGE_KEYS.VOTES, JSON.stringify(votes));
};

export const hasVoted = async (questionId, deviceId) => {
    const votes = await getVotes();
    return Object.values(votes).some(
        vote => vote.questionId === questionId && vote.deviceId === deviceId
    );
};

export const submitVote = async ({ questionId, deviceId, choice }) => {
    // 중복 확인
    if (await hasVoted(questionId, deviceId)) {
        throw new Error('이미 투표했습니다.');
    }

    // 포인트 확인 및 차감
    const device = await getDevice(deviceId);
    if (!device) {
        throw new Error('기기 정보를 찾을 수 없습니다.');
    }

    const { votePointCost } = await import('../utils/constants');
    if (device.points < votePointCost) {
        throw new Error(`포인트가 부족합니다. (필요: ${votePointCost}P, 보유: ${device.points}P)`);
    }

    // Vote 생성
    const votes = await getVotes();
    const voteId = `vote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    votes[voteId] = {
        voteId,
        questionId,
        deviceId,
        choice,
        createdAt: new Date().toISOString(),
    };
    await saveVotes(votes);

    // Question 업데이트
    const question = await getQuestion(questionId);
    if (question) {
        const updates = {
            totalVotes: question.totalVotes + 1,
        };
        if (choice === 'A') {
            updates.votesA = question.votesA + 1;
        } else {
            updates.votesB = question.votesB + 1;
        }
        await updateQuestion(questionId, updates);
    }

    // Device 포인트 차감
    await updateDevice(deviceId, {
        points: device.points - votePointCost,
        totalVotes: device.totalVotes + 1,
        lastActiveAt: new Date().toISOString(),
    });
};

// Checkin 관리
export const getCheckins = async () => {
    try {
        const data = await AsyncStorage.getItem(STORAGE_KEYS.CHECKINS);
        return data ? JSON.parse(data) : {};
    } catch (error) {
        return {};
    }
};

export const saveCheckins = async (checkins) => {
    await AsyncStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(checkins));
};

export const hasCheckedInToday = async (deviceId) => {
    const today = new Date().toISOString().split('T')[0];
    const checkins = await getCheckins();

    return Object.values(checkins).some(
        checkin => checkin.deviceId === deviceId && checkin.date === today
    );
};

// 더미 데이터 생성
export const createDummyData = async () => {
    const questions = await getQuestions();
    const dummyDeviceId = 'dummy_device';

    // 이미 더미 데이터가 있으면 생성하지 않음
    const existingDummy = Object.values(questions).find(q => q.createdBy === dummyDeviceId);
    if (existingDummy) {
        return;
    }

    const dummyQuestions = [
        {
            text: '이번 학기 수강신청, 인기 과목 신청할까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'study',
        },
        {
            text: '알바 그만두고 공부에 집중할까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'work',
        },
        {
            text: '친구와 싸웠는데 먼저 사과할까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'relationship',
        },
        {
            text: '이번 달 용돈으로 뭐 살까?',
            type: 'A_B',
            optionA: '옷',
            optionB: '음식',
            category: 'money',
        },
        {
            text: '헬스장 등록할까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'health',
        },
        {
            text: '고백할까 말까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'love',
        },
        {
            text: '주말에 뭐 할까?',
            type: 'A_B',
            optionA: '게임',
            optionB: '영화',
            category: 'hobby',
        },
        {
            text: '전공 바꿀까?',
            type: 'YES_NO',
            optionA: 'YES',
            optionB: 'NO',
            category: 'study',
        },
    ];

    dummyQuestions.forEach((q, index) => {
        const questionId = `dummy_question_${index}`;
        questions[questionId] = {
            questionId,
            ...q,
            votesA: Math.floor(Math.random() * 20),
            votesB: Math.floor(Math.random() * 20),
            totalVotes: 0,
            createdAt: new Date(Date.now() - index * 3600000).toISOString(), // 시간차를 두고 생성
            status: 'OPEN',
            createdBy: dummyDeviceId,
        };
        questions[questionId].totalVotes = questions[questionId].votesA + questions[questionId].votesB;
    });

    await saveQuestions(questions);
};

export const submitCheckin = async (deviceId) => {
    // 오늘 이미 출석했는지 확인
    if (await hasCheckedInToday(deviceId)) {
        throw new Error('오늘 이미 출석했습니다.');
    }

    // Checkin 생성
    const checkins = await getCheckins();
    const checkinId = `checkin_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const today = new Date().toISOString().split('T')[0];

    checkins[checkinId] = {
        checkinId,
        deviceId,
        date: today,
        locationType: 'campus',
        createdAt: new Date().toISOString(),
    };
    await saveCheckins(checkins);

    // Device 포인트 증가 (100점)
    const device = await getDevice(deviceId);
    if (device) {
        const { checkinPointReward } = await import('../utils/constants');
        await updateDevice(deviceId, {
            points: device.points + checkinPointReward,
            totalCheckins: device.totalCheckins + 1,
            lastActiveAt: new Date().toISOString(),
        });
    }
};

