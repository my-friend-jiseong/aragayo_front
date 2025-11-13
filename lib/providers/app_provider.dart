import 'package:flutter/foundation.dart';
import '../models/device.dart';
import '../models/question.dart';
import '../services/device_service.dart';
import '../services/question_service.dart';

class AppProvider with ChangeNotifier {
  final DeviceService _deviceService = DeviceService();
  final QuestionService _questionService = QuestionService();

  String? _deviceId;
  Device? _device;
  Question? _currentQuestion;
  bool _isLoading = true;

  String? get deviceId => _deviceId;
  Device? get device => _device;
  Question? get currentQuestion => _currentQuestion;
  bool get isLoading => _isLoading;

  // 초기화
  Future<void> initialize() async {
    _isLoading = true;
    notifyListeners();

    try {
      // deviceId 가져오기 또는 생성
      _deviceId = await _deviceService.getOrCreateDeviceId();

      // Device 스트림 구독
      _deviceService.getDeviceStream(_deviceId!).listen((device) {
        _device = device;
        notifyListeners();
      });

      // 최신 질문 스트림 구독
      _questionService.getLatestOpenQuestionStream().listen((question) {
        _currentQuestion = question;
        notifyListeners();
      });
    } catch (e) {
      debugPrint('초기화 오류: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  // 질문 새로고침
  Future<void> refreshQuestion() async {
    _currentQuestion = await _questionService.getLatestOpenQuestion();
    notifyListeners();
  }
}

