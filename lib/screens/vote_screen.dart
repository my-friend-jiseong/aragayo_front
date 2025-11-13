import 'dart:async';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/question.dart';
import '../providers/app_provider.dart';
import '../services/vote_service.dart';
import '../utils/constants.dart';
import 'result_screen.dart';

class VoteScreen extends StatefulWidget {
  final Question question;

  const VoteScreen({
    super.key,
    required this.question,
  });

  @override
  State<VoteScreen> createState() => _VoteScreenState();
}

class _VoteScreenState extends State<VoteScreen> {
  final VoteService _voteService = VoteService();
  Timer? _timer;
  int _remainingSeconds = AppConstants.voteTimerSeconds;
  String? _selectedChoice;
  bool _hasVoted = false;
  bool _isSubmitting = false;

  @override
  void initState() {
    super.initState();
    _checkVoteStatus();
    _startTimer();
  }

  Future<void> _checkVoteStatus() async {
    final appProvider = Provider.of<AppProvider>(context, listen: false);
    final deviceId = appProvider.deviceId;

    if (deviceId == null) return;

    final hasVoted = await _voteService.hasVoted(widget.question.questionId, deviceId);
    setState(() {
      _hasVoted = hasVoted;
    });

    if (hasVoted) {
      // 이미 투표했다면 결과 화면으로 이동
      _navigateToResult();
    }
  }

  void _startTimer() {
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (mounted) {
        setState(() {
          _remainingSeconds--;
        });

        if (_remainingSeconds <= 0) {
          timer.cancel();
          if (!_hasVoted && _selectedChoice == null) {
            // 시간 초과 시 자동으로 결과 화면으로 이동
            _navigateToResult();
          }
        }
      }
    });
  }

  Future<void> _submitVote(String choice) async {
    if (_isSubmitting || _hasVoted) return;

    final appProvider = Provider.of<AppProvider>(context, listen: false);
    final deviceId = appProvider.deviceId;

    if (deviceId == null) return;

    setState(() {
      _selectedChoice = choice;
      _isSubmitting = true;
    });

    try {
      await _voteService.submitVote(
        questionId: widget.question.questionId,
        deviceId: deviceId,
        choice: choice,
      );

      setState(() {
        _hasVoted = true;
      });

      _timer?.cancel();

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('투표 완료! +5 포인트'),
            backgroundColor: Colors.green,
          ),
        );
      }

      // 결과 화면으로 이동
      _navigateToResult();
    } catch (e) {
      setState(() {
        _selectedChoice = null;
        _isSubmitting = false;
      });

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('투표 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  void _navigateToResult() {
    Navigator.pushReplacement(
      context,
      MaterialPageRoute(
        builder: (_) => ResultScreen(questionId: widget.question.questionId),
      ),
    );
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('투표하기'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // 타이머
            Card(
              color: _remainingSeconds <= 5 ? Colors.red.shade50 : Colors.blue.shade50,
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  children: [
                    const Text(
                      '남은 시간',
                      style: TextStyle(
                        fontSize: 16,
                        color: Colors.grey,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      '$_remainingSeconds초',
                      style: TextStyle(
                        fontSize: 48,
                        fontWeight: FontWeight.bold,
                        color: _remainingSeconds <= 5 ? Colors.red : Colors.blue,
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),

            // 질문 표시
            Card(
              elevation: 4,
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Text(
                  widget.question.text,
                  style: const TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.bold,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            const SizedBox(height: 40),

            // 선택 버튼
            Expanded(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // A 선택
                  SizedBox(
                    width: double.infinity,
                    height: 80,
                    child: ElevatedButton(
                      onPressed: _isSubmitting || _hasVoted
                          ? null
                          : () => _submitVote('A'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedChoice == 'A'
                            ? Colors.blue
                            : Colors.blue.shade100,
                        foregroundColor: _selectedChoice == 'A'
                            ? Colors.white
                            : Colors.blue,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        widget.question.optionA,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(height: 20),

                  // VS 텍스트
                  const Text(
                    'VS',
                    style: TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.bold,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 20),

                  // B 선택
                  SizedBox(
                    width: double.infinity,
                    height: 80,
                    child: ElevatedButton(
                      onPressed: _isSubmitting || _hasVoted
                          ? null
                          : () => _submitVote('B'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _selectedChoice == 'B'
                            ? Colors.red
                            : Colors.red.shade100,
                        foregroundColor: _selectedChoice == 'B'
                            ? Colors.white
                            : Colors.red,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Text(
                        widget.question.optionB,
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            if (_isSubmitting)
              const Padding(
                padding: EdgeInsets.all(16),
                child: Center(
                  child: CircularProgressIndicator(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

