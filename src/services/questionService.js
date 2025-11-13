// 로컬 스토리지 기반으로 단순화
import * as localStorage from './localStorage';

export const getLatestOpenQuestion = localStorage.getLatestOpenQuestion;
export const createQuestion = localStorage.createQuestion;
export const getQuestion = localStorage.getQuestion;
export const getOpenQuestionsByCategory = localStorage.getOpenQuestionsByCategory;
export const verifyQuestion = localStorage.verifyQuestion;
export const getHallOfFame = localStorage.getHallOfFame;
export const getHotVotes = localStorage.getHotVotes;
export const getAllTimeHotVotes = localStorage.getAllTimeHotVotes;

export const subscribeToLatestOpenQuestion = (callback, category = 'all') => {
  // 간단한 폴링 방식
  const interval = setInterval(async () => {
    const question = await localStorage.getLatestOpenQuestion(category);
    callback(question);
  }, 1000);
  
  // 초기값도 전달
  localStorage.getLatestOpenQuestion(category).then(callback);
  
  return () => clearInterval(interval);
};

export const subscribeToQuestion = (questionId, callback) => {
  // 간단한 폴링 방식
  const interval = setInterval(async () => {
    const question = await localStorage.getQuestion(questionId);
    callback(question);
  }, 1000);
  
  // 초기값도 전달
  localStorage.getQuestion(questionId).then(callback);
  
  return () => clearInterval(interval);
};
