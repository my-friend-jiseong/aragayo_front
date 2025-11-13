import 'package:geolocator/geolocator.dart';
import '../utils/constants.dart';

class LocationService {
  // 현재 위치 가져오기
  Future<Position> getCurrentPosition() async {
    bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      throw Exception('위치 서비스가 비활성화되어 있습니다.');
    }

    LocationPermission permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        throw Exception('위치 권한이 거부되었습니다.');
      }
    }

    if (permission == LocationPermission.deniedForever) {
      throw Exception('위치 권한이 영구적으로 거부되었습니다.');
    }

    return await Geolocator.getCurrentPosition(
      desiredAccuracy: LocationAccuracy.high,
    );
  }

  // 캠퍼스 범위 내에 있는지 확인
  Future<bool> isWithinCampus() async {
    try {
      final position = await getCurrentPosition();
      final distance = Geolocator.distanceBetween(
        AppConstants.campusLatitude,
        AppConstants.campusLongitude,
        position.latitude,
        position.longitude,
      );

      return distance <= AppConstants.campusRadiusMeters;
    } catch (e) {
      return false;
    }
  }

  // 두 지점 간 거리 계산 (미터)
  double calculateDistance(
    double lat1,
    double lon1,
    double lat2,
    double lon2,
  ) {
    return Geolocator.distanceBetween(lat1, lon1, lat2, lon2);
  }
}

