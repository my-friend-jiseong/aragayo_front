export interface Concept {
  id: string;
  label: string;
  group: 'subject' | 'core-concept';
  description?: string;
  wikiUrl?: string;
}

export interface Link {
  source: string;
  target: string;
  value: number;
}

export interface Course {
  id: string;
  title: string;
  department: string;
  concepts: string[];
  prerequisites: string[];
  score?: number;
}

export const MOCK_CONCEPTS: Concept[] = [
  // subject group (26 subjects)
  { id: 'python-programming', label: 'Python프로그래밍', group: 'subject', description: '1학년 과목' },
  { id: 'linux-system', label: 'LinuxSystem', group: 'subject', description: '1학년 과목' },
  { id: 'data-structures', label: '데이터구조', group: 'subject', description: '2학년 과목' },
  { id: 'computer-architecture', label: '컴퓨터구조', group: 'subject', description: '2학년 과목' },
  { id: 'algorithms', label: '알고리즘', group: 'subject', description: '3학년 과목' },
  { id: 'oss-development', label: 'OSS개발', group: 'subject', description: '2학년 과목' },
  { id: 'oop', label: '객체지향프로그래밍', group: 'subject', description: '2학년 과목' },
  { id: 'web-programming', label: '웹프로그래밍', group: 'subject', description: '2학년 과목' },
  { id: 'programming-languages', label: '프로그래밍언어론', group: 'subject', description: '3학년 과목' },
  { id: 'database', label: '데이터베이스', group: 'subject', description: '2학년 과목' },
  { id: 'computer-networks', label: '컴퓨터네트워크', group: 'subject', description: '2학년 과목' },
  { id: 'operating-systems', label: '운영체제', group: 'subject', description: '3학년 과목' },
  { id: 'compiler', label: '컴파일러', group: 'subject', description: '3학년 과목' },
  { id: 'software-engineering', label: '소프트웨어공학', group: 'subject', description: '3학년 과목' },
  { id: 'machine-learning-course', label: '머신러닝', group: 'subject', description: '2학년 과목' },
  { id: 'information-security', label: '정보보호', group: 'subject', description: '4학년 과목' },
  { id: 'computer-graphics', label: '컴퓨터그래픽스', group: 'subject', description: '3학년 과목' },
  { id: 'virtual-reality', label: '가상현실', group: 'subject', description: '3학년 과목' },
  { id: 'deep-learning', label: '딥러닝', group: 'subject', description: '3학년 과목' },
  { id: 'big-data-analysis', label: '빅데이터분석', group: 'subject', description: '3학년 과목' },
  { id: 'mobile-programming', label: '모바일프로그래밍', group: 'subject', description: '4학년 과목' },
  { id: 'distributed-processing', label: '분산처리', group: 'subject', description: '4학년 과목' },
  { id: 'computer-vision', label: '컴퓨터비전', group: 'subject', description: '4학년 과목' },
  { id: 'data-mining', label: '데이터마이닝', group: 'subject', description: '4학년 과목' },
  { id: 'image-processing', label: '영상처리', group: 'subject', description: '4학년 과목' },
  { id: 'latest-ce-tech', label: '최신CE기술', group: 'subject', description: '4학년 과목' },

  // 핵심 개념 (Expanded Core Concepts)
  { id: 'variables', label: '변수와 자료형', group: 'core-concept' },
  { id: 'control-flow', label: '제어문', group: 'core-concept' },
  { id: 'functions', label: '함수와 스코프', group: 'core-concept' },
  { id: 'shell-script', label: '쉘 스크립트', group: 'core-concept' },
  { id: 'file-system', label: '파일 시스템', group: 'core-concept' },
  { id: 'permissions', label: '권한 관리', group: 'core-concept' },
  { id: 'stack-queue', label: '스택/큐', group: 'core-concept' },
  { id: 'tree-graph', label: '트리/그래프', group: 'core-concept' },
  { id: 'hash-table', label: '해시 테이블', group: 'core-concept' },
  { id: 'alu', label: 'ALU/연산장치', group: 'core-concept' },
  { id: 'cache-memory', label: '캐시 메모리', group: 'core-concept' },
  { id: 'instruction-set', label: '명령어 집합(ISA)', group: 'core-concept' },
  { id: 'big-o', label: '복잡도 분석(Big-O)', group: 'core-concept' },
  { id: 'dynamic-programming', label: '동적 계획법', group: 'core-concept' },
  { id: 'greedy', label: '탐욕 알고리즘', group: 'core-concept' },
  { id: 'git-flow', label: 'Git Flow', group: 'core-concept' },
  { id: 'open-source-license', label: '오픈소스 라이선스', group: 'core-concept' },
  { id: 'ci-cd', label: 'CI/CD 기초', group: 'core-concept' },
  { id: 'encapsulation', label: '캡슐화', group: 'core-concept' },
  { id: 'polymorphism', label: '다형성', group: 'core-concept' },
  { id: 'interface', label: '인터페이스 설계', group: 'core-concept' },
  { id: 'html-css', label: 'HTML/CSS', group: 'core-concept' },
  { id: 'dom-manipulation', label: 'DOM 조작', group: 'core-concept' },
  { id: 'async-await', label: '비동기 처리', group: 'core-concept' },
  { id: 'semantics', label: '의미론(Semantics)', group: 'core-concept' },
  { id: 'type-system', label: '타입 시스템', group: 'core-concept' },
  { id: 'lambda-calculus', label: '람다 계산법', group: 'core-concept' },
  { id: 'relational-model', label: '관계형 모델', group: 'core-concept' },
  { id: 'normalization', label: '정규화', group: 'core-concept' },
  { id: 'transaction', label: '트랜잭션(ACID)', group: 'core-concept' },
  { id: 'osi-7-layer', label: 'OSI 7계층', group: 'core-concept' },
  { id: 'tcp-udp', label: 'TCP/UDP', group: 'core-concept' },
  { id: 'routing', label: '라우팅/스위칭', group: 'core-concept' },
  { id: 'virtual-memory', label: '가상 메모리', group: 'core-concept' },
  { id: 'deadlock', label: '교착 상태', group: 'core-concept' },
  { id: 'scheduling', label: 'CPU 스케줄링', group: 'core-concept' },
  { id: 'lexical-analysis', label: '어휘 분석', group: 'core-concept' },
  { id: 'syntax-tree', label: '추상 구문 트리(AST)', group: 'core-concept' },
  { id: 'code-generation', label: '코드 생성', group: 'core-concept' },
  { id: 'agile', label: '애자일 방법론', group: 'core-concept' },
  { id: 'uml', label: 'UML 모델링', group: 'core-concept' },
  { id: 'unit-testing', label: '단위 테스트', group: 'core-concept' },
  { id: 'supervised-learning', label: '지도 학습', group: 'core-concept' },
  { id: 'regression', label: '회귀 분석', group: 'core-concept' },
  { id: 'decision-tree', label: '의사결정 나무', group: 'core-concept' },
  { id: 'pki', label: '공개키 암호화(PKI)', group: 'core-concept' },
  { id: 'firewall', label: '방화벽/IDS', group: 'core-concept' },
  { id: 'vulnerability', label: '취약점 분석', group: 'core-concept' },
  { id: 'rasterization', label: '래스터화', group: 'core-concept' },
  { id: 'shader', label: '셰이더(Shader)', group: 'core-concept' },
  { id: 'transformation', label: '기하 변환', group: 'core-concept' },
  { id: 'unity-unreal', label: '게임 엔진 기초', group: 'core-concept' },
  { id: 'immersion', label: '몰입형 인터페이스', group: 'core-concept' },
  { id: 'haptic', label: '햅틱 기술', group: 'core-concept' },
  { id: 'cnn', label: '합성곱 신경망(CNN)', group: 'core-concept' },
  { id: 'rnn-lstm', label: '순환 신경망(RNN)', group: 'core-concept' },
  { id: 'backpropagation', label: '역전파 알고리즘', group: 'core-concept' },
  { id: 'spark', label: 'Apache Spark', group: 'core-concept' },
  { id: 'nosql', label: 'NoSQL 데이터베이스', group: 'core-concept' },
  { id: 'data-lake', label: '데이터 레이크', group: 'core-concept' },
  { id: 'android-intent', label: '안드로이드 인텐트', group: 'core-concept' },
  { id: 'jetpack-compose', label: '컴포즈 UI', group: 'core-concept' },
  { id: 'mobile-lifecycle', label: '생명주기 관리', group: 'core-concept' },
  { id: 'rpc-grpc', label: 'RPC/gRPC', group: 'core-concept' },
  { id: 'consensus', label: '합의 알고리즘', group: 'core-concept' },
  { id: 'load-balancing', label: '로드 밸런싱', group: 'core-concept' },
  { id: 'yolo', label: 'YOLO/객체 탐지', group: 'core-concept' },
  { id: 'feature-extraction', label: '특징 추출', group: 'core-concept' },
  { id: 'stereo-vision', label: '스테레오 비전', group: 'core-concept' },
  { id: 'clustering', label: '군집화(Clustering)', group: 'core-concept' },
  { id: 'association-rule', label: '연관 규칙 분석', group: 'core-concept' },
  { id: 'anomaly-detection', label: '이상 탐지', group: 'core-concept' },
  { id: 'filtering', label: '공간 필터링', group: 'core-concept' },
  { id: 'morphology', label: '모폴로지 연산', group: 'core-concept' },
  { id: 'edge-detection', label: '에지 검출', group: 'core-concept' },
  { id: 'edge-computing', label: '에지 컴퓨팅', group: 'core-concept' },
  { id: 'quantum-computing', label: '양자 컴퓨팅 기초', group: 'core-concept' },
  { id: 'smart-contract', label: '스마트 컨트랙트', group: 'core-concept' },
];

export const MOCK_LINKS: Link[] = [
  // 1학년 과목별 3개씩 연결
  { source: 'python-programming', target: 'variables', value: 3 },
  { source: 'python-programming', target: 'control-flow', value: 3 },
  { source: 'python-programming', target: 'functions', value: 3 },
  { source: 'linux-system', target: 'shell-script', value: 3 },
  { source: 'linux-system', target: 'file-system', value: 3 },
  { source: 'linux-system', target: 'permissions', value: 3 },
  
  // 2학년 과목별 3개씩 연결
  { source: 'data-structures', target: 'stack-queue', value: 3 },
  { source: 'data-structures', target: 'tree-graph', value: 3 },
  { source: 'data-structures', target: 'hash-table', value: 3 },
  { source: 'computer-architecture', target: 'alu', value: 3 },
  { source: 'computer-architecture', target: 'cache-memory', value: 3 },
  { source: 'computer-architecture', target: 'instruction-set', value: 3 },
  { source: 'oss-development', target: 'git-flow', value: 3 },
  { source: 'oss-development', target: 'open-source-license', value: 3 },
  { source: 'oss-development', target: 'ci-cd', value: 2 },
  { source: 'oop', target: 'encapsulation', value: 3 },
  { source: 'oop', target: 'polymorphism', value: 3 },
  { source: 'oop', target: 'interface', value: 3 },
  { source: 'web-programming', target: 'html-css', value: 3 },
  { source: 'web-programming', target: 'dom-manipulation', value: 3 },
  { source: 'web-programming', target: 'async-await', value: 3 },
  { source: 'database', target: 'relational-model', value: 3 },
  { source: 'database', target: 'normalization', value: 3 },
  { source: 'database', target: 'transaction', value: 3 },
  { source: 'computer-networks', target: 'osi-7-layer', value: 3 },
  { source: 'computer-networks', target: 'tcp-udp', value: 3 },
  { source: 'computer-networks', target: 'routing', value: 3 },
  { source: 'machine-learning-course', target: 'supervised-learning', value: 3 },
  { source: 'machine-learning-course', target: 'regression', value: 3 },
  { source: 'machine-learning-course', target: 'decision-tree', value: 3 },

  // 3학년 과목별 3개씩 연결
  { source: 'algorithms', target: 'big-o', value: 3 },
  { source: 'algorithms', target: 'dynamic-programming', value: 3 },
  { source: 'algorithms', target: 'greedy', value: 3 },
  { source: 'operating-systems', target: 'virtual-memory', value: 3 },
  { source: 'operating-systems', target: 'deadlock', value: 3 },
  { source: 'operating-systems', target: 'scheduling', value: 3 },
  { source: 'compiler', target: 'lexical-analysis', value: 3 },
  { source: 'compiler', target: 'syntax-tree', value: 3 },
  { source: 'compiler', target: 'code-generation', value: 3 },
  { source: 'programming-languages', target: 'semantics', value: 3 },
  { source: 'programming-languages', target: 'type-system', value: 3 },
  { source: 'programming-languages', target: 'lambda-calculus', value: 2 },
  { source: 'software-engineering', target: 'agile', value: 3 },
  { source: 'software-engineering', target: 'uml', value: 3 },
  { source: 'software-engineering', target: 'unit-testing', value: 3 },
  { source: 'computer-graphics', target: 'rasterization', value: 3 },
  { source: 'computer-graphics', target: 'shader', value: 3 },
  { source: 'computer-graphics', target: 'transformation', value: 3 },
  { source: 'virtual-reality', target: 'unity-unreal', value: 3 },
  { source: 'virtual-reality', target: 'immersion', value: 3 },
  { source: 'virtual-reality', target: 'haptic', value: 2 },
  { source: 'deep-learning', target: 'cnn', value: 3 },
  { source: 'deep-learning', target: 'rnn-lstm', value: 3 },
  { source: 'deep-learning', target: 'backpropagation', value: 3 },
  { source: 'big-data-analysis', target: 'spark', value: 3 },
  { source: 'big-data-analysis', target: 'nosql', value: 3 },
  { source: 'big-data-analysis', target: 'data-lake', value: 2 },

  // 4학년 과목별 3개씩 연결
  { source: 'information-security', target: 'pki', value: 3 },
  { source: 'information-security', target: 'firewall', value: 3 },
  { source: 'information-security', target: 'vulnerability', value: 3 },
  { source: 'mobile-programming', target: 'android-intent', value: 3 },
  { source: 'mobile-programming', target: 'jetpack-compose', value: 3 },
  { source: 'mobile-programming', target: 'mobile-lifecycle', value: 3 },
  { source: 'distributed-processing', target: 'rpc-grpc', value: 3 },
  { source: 'distributed-processing', target: 'consensus', value: 3 },
  { source: 'distributed-processing', target: 'load-balancing', value: 3 },
  { source: 'computer-vision', target: 'yolo', value: 3 },
  { source: 'computer-vision', target: 'feature-extraction', value: 3 },
  { source: 'computer-vision', target: 'stereo-vision', value: 2 },
  { source: 'data-mining', target: 'clustering', value: 3 },
  { source: 'data-mining', target: 'association-rule', value: 3 },
  { source: 'data-mining', target: 'anomaly-detection', value: 2 },
  { source: '영상처리', target: 'filtering', value: 3 }, // 영상처리는 한글 ID 그대로 사용 가능성 체크 후 수정
  { source: 'image-processing', target: 'filtering', value: 3 },
  { source: 'image-processing', target: 'morphology', value: 3 },
  { source: 'image-processing', target: 'edge-detection', value: 3 },
  { source: 'latest-ce-tech', target: 'edge-computing', value: 3 },
  { source: 'latest-ce-tech', target: 'quantum-computing', value: 2 },
  { source: 'latest-ce-tech', target: 'smart-contract', value: 3 },

  // 개념 간 연결 (Hierarchy)
  { source: 'functions', target: 'lambda-calculus', value: 2 },
  { source: 'stack-queue', target: 'scheduling', value: 2 },
  { source: 'tree-graph', target: 'syntax-tree', value: 2 },
  { source: 'instruction-set', target: 'code-generation', value: 2 },
  { source: 'normalization', target: 'relational-model', value: 2 },
  { source: 'tcp-udp', target: 'rpc-grpc', value: 2 },
  { source: 'cnn', target: 'yolo', value: 2 },
  { source: 'supervised-learning', target: 'backpropagation', value: 2 },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'CS-101',
    title: 'Python프로그래밍',
    department: '컴퓨터공학과',
    concepts: ['variables', 'control-flow', 'functions'],
    prerequisites: [],
    score: 0.95
  },
  {
    id: 'CS-102',
    title: 'LinuxSystem',
    department: '컴퓨터공학과',
    concepts: ['shell-script', 'file-system', 'permissions'],
    prerequisites: [],
    score: 0.88
  },
  {
    id: 'CS-201',
    title: '데이터구조',
    department: '컴퓨터공학과',
    concepts: ['stack-queue', 'tree-graph', 'hash-table'],
    prerequisites: ['CS-101'],
    score: 0.92
  },
  {
    id: 'CS-202',
    title: '컴퓨터구조',
    department: '컴퓨터공학과',
    concepts: ['alu', 'cache-memory', 'instruction-set'],
    prerequisites: ['CS-102'],
    score: 0.85
  },
  {
    id: 'CS-301',
    title: '운영체제',
    department: '컴퓨터공학과',
    concepts: ['virtual-memory', 'deadlock', 'scheduling'],
    prerequisites: ['CS-201', 'CS-202'],
    score: 0.90
  },
  {
    id: 'CS-302',
    title: '알고리즘',
    department: '컴퓨터공학과',
    concepts: ['big-o', 'dynamic-programming', 'greedy'],
    prerequisites: ['CS-201'],
    score: 0.94
  },
  {
    id: 'CS-303',
    title: '딥러닝',
    department: '컴퓨터공학과',
    concepts: ['cnn', 'rnn-lstm', 'backpropagation'],
    prerequisites: ['CS-302'],
    score: 0.87
  },
  {
    id: 'CS-401',
    title: '정보보호',
    department: '컴퓨터공학과',
    concepts: ['pki', 'firewall', 'vulnerability'],
    prerequisites: ['CS-301'],
    score: 0.82
  }
];
