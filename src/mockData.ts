export interface Concept {
  id: string;
  label: string;
  group: 'subject' | 'core-concept' | 'sub-node';
  description?: string;
  url?: string;
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
  // Keyword: subject group (26 subjects)
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

  // Keyword: core-concept (Granular & Expanded)
  { id: 'syntax', label: '구문론', group: 'core-concept' },
  { id: 'data-types', label: '자료형/변수', group: 'core-concept' },
  { id: 'shell-commands', label: '쉘 명령어', group: 'core-concept' },
  { id: 'kernel-struct', label: '커널 구조', group: 'core-concept' },
  { id: 'linked-list', label: '연결 리스트', group: 'core-concept' },
  { id: 'trees', label: '트리 구조', group: 'core-concept' },
  { id: 'cpu-pipelining', label: 'CPU 파이프라이닝', group: 'core-concept' },
  { id: 'memory-hierarchy', label: '메모리 계층', group: 'core-concept' },
  { id: 'time-complexity', label: '시간 복잡도', group: 'core-concept' },
  { id: 'dynamic-prog', label: '동적 계획법', group: 'core-concept' },
  { id: 'git-versioning', label: '버전 관리(Git)', group: 'core-concept' },
  { id: 'open-source-lic', label: 'OSS 라이선스', group: 'core-concept' },
  { id: 'inheritance', label: '상속/다형성', group: 'core-concept' },
  { id: 'design-patterns', label: '디자인 패턴', group: 'core-concept' },
  { id: 'rest-api', label: 'REST API', group: 'core-concept' },
  { id: 'dom-control', label: 'DOM 제어', group: 'core-concept' },
  { id: 'lambda-calc', label: '람다 계산법', group: 'core-concept' },
  { id: 'semantics', label: '의미론', group: 'core-concept' },
  { id: 'relational-model', label: '관계형 모델', group: 'core-concept' },
  { id: 'sql-query', label: 'SQL 질의', group: 'core-concept' },
  { id: 'tcp-ip', label: 'TCP/IP 프로토콜', group: 'core-concept' },
  { id: 'http-https', label: 'HTTP/HTTPS', group: 'core-concept' },
  { id: 'process-mgmt', label: '프로세스 관리', group: 'core-concept' },
  { id: 'virtual-memory', label: '가상 메모리', group: 'core-concept' },
  { id: 'lexical-analysis', label: '어휘 분석', group: 'core-concept' },
  { id: 'parsing', label: '파싱(Parsing)', group: 'core-concept' },
  { id: 'agile-method', label: '애자일 방법론', group: 'core-concept' },
  { id: 'unit-testing', label: '단위 테스트', group: 'core-concept' },
  { id: 'gradient-descent', label: '경사 하강법', group: 'core-concept' },
  { id: 'feature-eng', label: '특징 추출', group: 'core-concept' },
  { id: 'encryption', label: '암호화 알고리즘', group: 'core-concept' },
  { id: 'network-sec', label: '네트워크 보안', group: 'core-concept' },
  { id: 'rendering-pipeline', label: '렌더링 파이프라인', group: 'core-concept' },
  { id: '3d-transformation', label: '3D 변환', group: 'core-concept' },
  { id: 'immersion', label: '몰입형 기술', group: 'core-concept' },
  { id: 'tracking', label: '모션 트래킹', group: 'core-concept' },
  { id: 'backpropagation', label: '역전파', group: 'core-concept' },
  { id: 'cnn-rnn', label: 'CNN/RNN', group: 'core-concept' },
  { id: 'hadoop-spark', label: '하둡/스파크', group: 'core-concept' },
  { id: 'nosql-data', label: 'NoSQL 데이터', group: 'core-concept' },
  { id: 'android-sdk', label: '안드로이드 SDK', group: 'core-concept' },
  { id: 'mobile-lifecycle', label: '앱 생명주기', group: 'core-concept' },
  { id: 'consensus-algo', label: '합의 알고리즘', group: 'core-concept' },
  { id: 'fault-tolerance', label: '결함 허용', group: 'core-concept' },
  { id: 'yolo-detection', label: 'YOLO 탐지', group: 'core-concept' },
  { id: 'image-filter', label: '영상 필터링', group: 'core-concept' },
  { id: 'edge-computing', label: '에지 컴퓨팅', group: 'core-concept' },
  { id: 'quantum-info', label: '양자 정보', group: 'core-concept' },

  // Sub-nodes (Detailed Multi-Keyword Bridges)
  { id: 'res-py-syntax', label: 'Python 문법과 기초', group: 'sub-node', url: 'https://tistory.com/py-syntax' },
  { id: 'res-linux-kernel', label: 'Linux 커널과 쉘의 이해', group: 'sub-node', url: 'https://tistory.com/linux-kernel' },
  { id: 'res-ds-basic', label: '선형/비선형 자료구조 가이드', group: 'sub-node', url: 'https://blog.naver.com/ds-guide' },
  { id: 'res-arch-core', label: 'CPU 아키텍처와 메모리 계층', group: 'sub-node', url: 'https://tistory.com/cpu-arch' },
  { id: 'res-algo-efficiency', label: '알고리즘 효율성과 동적 계획법', group: 'sub-node', url: 'https://blog.naver.com/algo-eff' },
  { id: 'res-oss-collaboration', label: 'OSS 협업과 Git 사용법', group: 'sub-node', url: 'https://tistory.com/oss-git' },
  { id: 'res-oop-design', label: 'OOP 설계 원칙과 디자인 패턴', group: 'sub-node', url: 'https://blog.naver.com/oop-design' },
  { id: 'res-web-fullstack', label: '웹 프론트엔드와 REST API', group: 'sub-node', url: 'https://tistory.com/web-fullstack' },
  { id: 'res-pl-theory', label: '언어론의 구문과 의미론', group: 'sub-node', url: 'https://blog.naver.com/pl-theory' },
  { id: 'res-db-relational', label: '관계형 DB와 SQL 실무', group: 'sub-node', url: 'https://tistory.com/db-relational' },
  { id: 'res-network-protocols', label: '네트워크 프로토콜과 HTTP', group: 'sub-node', url: 'https://blog.naver.com/net-proto' },
  { id: 'res-os-internals', label: 'OS 프로세스와 가상 메모리', group: 'sub-node', url: 'https://tistory.com/os-internals' },
  { id: 'res-compiler-process', label: '컴파일러 분석과 파싱', group: 'sub-node', url: 'https://blog.naver.com/compiler-proc' },
  { id: 'res-se-lifecycle', label: '소프트웨어 생명주기와 테스트', group: 'sub-node', url: 'https://tistory.com/se-lifecycle' },
  { id: 'res-ml-foundation', label: '머신러닝 기초와 특징 추출', group: 'sub-node', url: 'https://blog.naver.com/ml-found' },
  { id: 'res-security-base', label: '정보보호와 암호화 통신', group: 'sub-node', url: 'https://tistory.com/sec-base' },
  { id: 'res-graphics-render', label: '그래픽스 렌더링과 변환', group: 'sub-node', url: 'https://blog.naver.com/cg-render' },
  { id: 'res-vr-tracking', label: 'VR 시스템과 모션 트래킹', group: 'sub-node', url: 'https://tistory.com/vr-tracking' },
  { id: 'res-dl-deep', label: '신경망과 역전파 알고리즘', group: 'sub-node', url: 'https://blog.naver.com/dl-deep' },
  { id: 'res-bigdata-nosql', label: '빅데이터 플랫폼과 NoSQL', group: 'sub-node', url: 'https://tistory.com/bigdata-nosql' },
  { id: 'res-mobile-dev-kit', label: '안드로이드 개발과 생명주기', group: 'sub-node', url: 'https://blog.naver.com/mobile-dev' },
  { id: 'res-dist-consensus', label: '분산 시스템과 합의 알고리즘', group: 'sub-node', url: 'https://tistory.com/dist-consensus' },
  { id: 'res-cv-vision', label: '컴퓨터 비전과 YOLO 탐지', group: 'sub-node', url: 'https://blog.naver.com/cv-vision' },
  { id: 'res-dm-analysis', label: '데이터 마이닝과 통계 분석', group: 'sub-node', url: 'https://tistory.com/dm-analysis' },
  { id: 'res-img-filter', label: '영상 처리와 필터링 기술', group: 'sub-node', url: 'https://blog.naver.com/img-filter' },
  { id: 'res-latest-future', label: '에지 컴퓨팅과 양자 기술', group: 'sub-node', url: 'https://tistory.com/latest-future' },
];

export const MOCK_LINKS: Link[] = [
  // 모든 Subject는 최소 2개 이상의 Core Concept와 Sub-node를 사이에 두고 연결됩니다.
  
  // 1학년
  { source: 'res-py-syntax', target: 'python-programming', value: 3 },
  { source: 'res-py-syntax', target: 'syntax', value: 2 },
  { source: 'res-py-syntax', target: 'data-types', value: 2 },

  { source: 'res-linux-kernel', target: 'linux-system', value: 3 },
  { source: 'res-linux-kernel', target: 'shell-commands', value: 2 },
  { source: 'res-linux-kernel', target: 'kernel-struct', value: 2 },

  // 2학년
  { source: 'res-ds-basic', target: 'data-structures', value: 3 },
  { source: 'res-ds-basic', target: 'linked-list', value: 2 },
  { source: 'res-ds-basic', target: 'trees', value: 2 },

  { source: 'res-arch-core', target: 'computer-architecture', value: 3 },
  { source: 'res-arch-core', target: 'cpu-pipelining', value: 2 },
  { source: 'res-arch-core', target: 'memory-hierarchy', value: 2 },

  { source: 'res-oss-collaboration', target: 'oss-development', value: 3 },
  { source: 'res-oss-collaboration', target: 'git-versioning', value: 2 },
  { source: 'res-oss-collaboration', target: 'open-source-lic', value: 2 },

  { source: 'res-oop-design', target: 'oop', value: 3 },
  { source: 'res-oop-design', target: 'inheritance', value: 2 },
  { source: 'res-oop-design', target: 'design-patterns', value: 2 },

  { source: 'res-web-fullstack', target: 'web-programming', value: 3 },
  { source: 'res-web-fullstack', target: 'dom-control', value: 2 },
  { source: 'res-web-fullstack', target: 'rest-api', value: 2 },

  { source: 'res-db-relational', target: 'database', value: 3 },
  { source: 'res-db-relational', target: 'relational-model', value: 2 },
  { source: 'res-db-relational', target: 'sql-query', value: 2 },

  { source: 'res-network-protocols', target: 'computer-networks', value: 3 },
  { source: 'res-network-protocols', target: 'tcp-ip', value: 2 },
  { source: 'res-network-protocols', target: 'http-https', value: 2 },

  { source: 'res-ml-foundation', target: '머신러닝', value: 3 },
  { source: 'res-ml-foundation', target: 'machine-learning-course', value: 3 },
  { source: 'res-ml-foundation', target: 'gradient-descent', value: 2 },
  { source: 'res-ml-foundation', target: 'feature-eng', value: 2 },

  // 3학년
  { source: 'res-algo-efficiency', target: 'algorithms', value: 3 },
  { source: 'res-algo-efficiency', target: 'time-complexity', value: 2 },
  { source: 'res-algo-efficiency', target: 'dynamic-prog', value: 2 },

  { source: 'res-os-internals', target: 'operating-systems', value: 3 },
  { source: 'res-os-internals', target: 'process-mgmt', value: 2 },
  { source: 'res-os-internals', target: 'virtual-memory', value: 2 },

  { source: 'res-pl-theory', target: 'programming-languages', value: 3 },
  { source: 'res-pl-theory', target: 'semantics', value: 2 },
  { source: 'res-pl-theory', target: 'lambda-calc', value: 2 },

  { source: 'res-compiler-process', target: 'compiler', value: 3 },
  { source: 'res-compiler-process', target: 'lexical-analysis', value: 2 },
  { source: 'res-compiler-process', target: 'parsing', value: 2 },

  { source: 'res-se-lifecycle', target: 'software-engineering', value: 3 },
  { source: 'res-se-lifecycle', target: 'agile-method', value: 2 },
  { source: 'res-se-lifecycle', target: 'unit-testing', value: 2 },

  { source: 'res-graphics-render', target: 'computer-graphics', value: 3 },
  { source: 'res-graphics-render', target: 'rendering-pipeline', value: 2 },
  { source: 'res-graphics-render', target: '3d-transformation', value: 2 },

  { source: 'res-vr-tracking', target: 'virtual-reality', value: 3 },
  { source: 'res-vr-tracking', target: 'immersion', value: 2 },
  { source: 'res-vr-tracking', target: 'tracking', value: 2 },

  { source: 'res-dl-deep', target: '딥러닝', value: 3 },
  { source: 'res-dl-deep', target: 'deep-learning', value: 3 },
  { source: 'res-dl-deep', target: 'backpropagation', value: 2 },
  { source: 'res-dl-deep', target: 'cnn-rnn', value: 2 },

  { source: 'res-bigdata-nosql', target: 'big-data-analysis', value: 3 },
  { source: 'res-bigdata-nosql', target: 'hadoop-spark', value: 2 },
  { source: 'res-bigdata-nosql', target: 'nosql-data', value: 2 },

  // 4학년
  { source: 'res-security-base', target: 'information-security', value: 3 },
  { source: 'res-security-base', target: 'encryption', value: 2 },
  { source: 'res-security-base', target: 'network-sec', value: 2 },

  { source: 'res-mobile-dev-kit', target: 'mobile-programming', value: 3 },
  { source: 'res-mobile-dev-kit', target: 'android-sdk', value: 2 },
  { source: 'res-mobile-dev-kit', target: 'mobile-lifecycle', value: 2 },

  { source: 'res-dist-consensus', target: 'distributed-processing', value: 3 },
  { source: 'res-dist-consensus', target: 'consensus-algo', value: 2 },
  { source: 'res-dist-consensus', target: 'fault-tolerance', value: 2 },

  { source: 'res-cv-vision', target: 'computer-vision', value: 3 },
  { source: 'res-cv-vision', target: 'yolo-detection', value: 2 },
  { source: 'res-cv-vision', target: 'feature-eng', value: 2 },

  { source: 'res-dm-analysis', target: 'data-mining', value: 3 },
  { source: 'res-dm-analysis', target: 'nosql-data', value: 2 },
  { source: 'res-dm-analysis', target: 'gradient-descent', value: 2 },

  { source: 'res-img-filter', target: 'image-processing', value: 3 },
  { source: 'res-img-filter', target: 'image-filter', value: 2 },
  { source: 'res-img-filter', target: 'parsing', value: 2 },

  { source: 'res-latest-future', target: 'latest-ce-tech', value: 3 },
  { source: 'res-latest-future', target: 'edge-computing', value: 2 },
  { source: 'res-latest-future', target: 'quantum-info', value: 2 },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'CS-101',
    title: 'Python프로그래밍',
    department: '컴퓨터공학과',
    concepts: ['syntax', 'data-types'],
    prerequisites: [],
    score: 0.95
  }
];