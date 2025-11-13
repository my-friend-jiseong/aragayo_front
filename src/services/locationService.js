import * as Location from 'expo-location';
import { AppConstants } from '../utils/constants';

export const getCurrentPosition = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  
  if (status !== 'granted') {
    throw new Error('위치 권한이 거부되었습니다.');
  }

  return await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });
};

export const isWithinCampus = async () => {
  try {
    const position = await getCurrentPosition();
    const distance = calculateDistance(
      AppConstants.campusLatitude,
      AppConstants.campusLongitude,
      position.coords.latitude,
      position.coords.longitude
    );

    return distance <= AppConstants.campusRadiusMeters;
  } catch (error) {
    console.error('위치 확인 오류:', error);
    return false;
  }
};

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // 지구 반경 (미터)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // 미터 단위
};

