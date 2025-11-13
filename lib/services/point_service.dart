import '../services/device_service.dart';
import '../utils/constants.dart';

class PointService {
  final DeviceService _deviceService = DeviceService();

  // 투표 포인트 지급
  Future<void> rewardVotePoint(String deviceId) async {
    await _deviceService.addPoints(deviceId, AppConstants.votePointReward);
    await _deviceService.incrementTotalVotes(deviceId);
  }

  // 출석 포인트 지급
  Future<void> rewardCheckinPoint(String deviceId) async {
    await _deviceService.addPoints(deviceId, AppConstants.checkinPointReward);
    await _deviceService.incrementTotalCheckins(deviceId);
  }
}

