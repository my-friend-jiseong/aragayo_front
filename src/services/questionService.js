// 로컬 스토리지 기반으로 단순화
import * as localStorage from './localStorage';

export const getLatestOpenQuestion = localStorage.getLatestOpenQuestion;
export const createQuestion = localStorage.createQuestion;
export const getQuestion = localStorage.getQuestion;

export const subscribeToLatestOpenQuestion = (callback) => {
  // 간단한 폴링 방식
  const interval = setInterval(async () => {
    const question = await localStorage.getLatestOpenQuestion();
    callback(question);
  }, 1000);
  
  // 초기값도 전달
  localStorage.getLatestOpenQuestion().then(callback);
  
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
