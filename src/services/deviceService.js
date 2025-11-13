// 로컬 스토리지 기반으로 단순화
import * as localStorage from './localStorage';

export const getOrCreateDeviceId = localStorage.getOrCreateDeviceId;
export const getDevice = localStorage.getDevice;
export const subscribeToDevice = (deviceId, callback) => {
  // 간단한 폴링 방식 (실시간은 나중에 필요하면 추가)
  const interval = setInterval(async () => {
    const device = await localStorage.getDevice(deviceId);
    callback(device);
  }, 1000);
  
  // 초기값도 전달
  localStorage.getDevice(deviceId).then(callback);
  
  return () => clearInterval(interval);
};
