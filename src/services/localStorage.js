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

export const getLatestOpenQuestion = async () => {
    const questions = await getQuestions();
    const openQuestions = Object.values(questions)
        .filter(q => q.status === 'OPEN')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return openQuestions.length > 0 ? openQuestions[0] : null;
};

export const createQuestion = async ({ text, type, optionA, optionB, deviceId }) => {
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

    // Device 포인트 증가
    const device = await getDevice(deviceId);
    if (device) {
        await updateDevice(deviceId, {
            points: device.points + 5,
            totalVotes: device.totalVotes + 1,
            lastActiveAt: new Date().toISOString(),
        });
    }
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

    // Device 포인트 증가
    const device = await getDevice(deviceId);
    if (device) {
        await updateDevice(deviceId, {
            points: device.points + 10,
            totalCheckins: device.totalCheckins + 1,
            lastActiveAt: new Date().toISOString(),
        });
    }
};

