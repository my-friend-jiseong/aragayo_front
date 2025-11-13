import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';
import '../services/question_service.dart';
import '../utils/constants.dart';

class QuestionCreateScreen extends StatefulWidget {
  const QuestionCreateScreen({super.key});

  @override
  State<QuestionCreateScreen> createState() => _QuestionCreateScreenState();
}

class _QuestionCreateScreenState extends State<QuestionCreateScreen> {
  final _formKey = GlobalKey<FormState>();
  final _textController = TextEditingController();
  final _optionAController = TextEditingController();
  final _optionBController = TextEditingController();
  String _selectedType = AppConstants.questionTypeYesNo;
  bool _isSubmitting = false;

  @override
  void dispose() {
    _textController.dispose();
    _optionAController.dispose();
    _optionBController.dispose();
    super.dispose();
  }

  Future<void> _submitQuestion() async {
    if (!_formKey.currentState!.validate()) return;

    final appProvider = Provider.of<AppProvider>(context, listen: false);
    final deviceId = appProvider.deviceId;

    if (deviceId == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('기기 정보를 불러올 수 없습니다.'),
          backgroundColor: Colors.red,
        ),
      );
      return;
    }

    setState(() {
      _isSubmitting = true;
    });

    try {
      final questionService = QuestionService();
      
      String optionA = _optionAController.text.trim();
      String optionB = _optionBController.text.trim();

      // YES/NO 타입인 경우 기본값 사용
      if (_selectedType == AppConstants.questionTypeYesNo) {
        optionA = 'YES';
        optionB = 'NO';
      }

      await questionService.createQuestion(
        text: _textController.text.trim(),
        type: _selectedType,
        optionA: optionA,
        optionB: optionB,
        deviceId: deviceId,
      );

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('고민이 등록되었습니다!'),
            backgroundColor: Colors.green,
          ),
        );
        Navigator.of(context).pop();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('등록 실패: $e'),
            backgroundColor: Colors.red,
          ),
        );
      }
    } finally {
      if (mounted) {
        setState(() {
          _isSubmitting = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('고민 작성하기'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // 질문 타입 선택
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        '질문 타입',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Expanded(
                            child: RadioListTile<String>(
                              title: const Text('YES/NO'),
                              value: AppConstants.questionTypeYesNo,
                              groupValue: _selectedType,
                              onChanged: (value) {
                                setState(() {
                                  _selectedType = value!;
                                  if (value == AppConstants.questionTypeYesNo) {
                                    _optionAController.clear();
                                    _optionBController.clear();
                                  }
                                });
                              },
                            ),
                          ),
                          Expanded(
                            child: RadioListTile<String>(
                              title: const Text('A/B'),
                              value: AppConstants.questionTypeAB,
                              groupValue: _selectedType,
                              onChanged: (value) {
                                setState(() {
                                  _selectedType = value!;
                                });
                              },
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 20),

              // 질문 입력
              TextFormField(
                controller: _textController,
                decoration: const InputDecoration(
                  labelText: '고민을 입력하세요',
                  hintText: '예: 알바 그만둘까?',
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
                validator: (value) {
                  if (value == null || value.trim().isEmpty) {
                    return '고민을 입력해주세요';
                  }
                  return null;
                },
              ),
              const SizedBox(height: 20),

              // A/B 옵션 입력 (A/B 타입인 경우만)
              if (_selectedType == AppConstants.questionTypeAB) ...[
                TextFormField(
                  controller: _optionAController,
                  decoration: const InputDecoration(
                    labelText: '옵션 A',
                    hintText: '예: 그만두기',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (_selectedType == AppConstants.questionTypeAB) {
                      if (value == null || value.trim().isEmpty) {
                        return '옵션 A를 입력해주세요';
                      }
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
                TextFormField(
                  controller: _optionBController,
                  decoration: const InputDecoration(
                    labelText: '옵션 B',
                    hintText: '예: 계속하기',
                    border: OutlineInputBorder(),
                  ),
                  validator: (value) {
                    if (_selectedType == AppConstants.questionTypeAB) {
                      if (value == null || value.trim().isEmpty) {
                        return '옵션 B를 입력해주세요';
                      }
                    }
                    return null;
                  },
                ),
                const SizedBox(height: 20),
              ],

              // 제출 버튼
              ElevatedButton(
                onPressed: _isSubmitting ? null : _submitQuestion,
                style: ElevatedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  backgroundColor: Colors.blue,
                  foregroundColor: Colors.white,
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(
                          strokeWidth: 2,
                          valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                        ),
                      )
                    : const Text(
                        '등록하기',
                        style: TextStyle(fontSize: 18),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

