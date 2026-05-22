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
  // subject group (from subject.txt)
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

  // 핵심 개념 (Intermediate Nodes)
  { id: 'syntax', label: '구문(Syntax)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/구문_분석' },
  { id: 'kernel', label: '커널(Kernel)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/커널_(컴퓨팅)' },
  { id: 'linked-list', label: '연결 리스트', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/연결_리스트' },
  { id: 'sorting', label: '정렬 알고리즘', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/정렬_알고리즘' },
  { id: 'cpu', label: 'CPU 아키텍처', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/중앙_처리_장치' },
  { id: 'git', label: 'Git/버전 관리', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/깃_(소프트웨어)' },
  { id: 'inheritance', label: '상속/다형성', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/상속_(객체_지향_프로그래밍)' },
  { id: 'http', label: 'HTTP/네트워크 프로토콜', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/HTTP' },
  { id: 'sql', label: 'SQL/질의어', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/SQL' },
  { id: 'process', label: '프로세스/스레드', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/프로세스' },
  { id: 'parsing', label: '파싱(Parsing)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/구문_분석' },
  { id: 'design-pattern', label: '디자인 패턴', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/소프트웨어_디자인_패턴' },
  { id: 'neural-network', label: '인공신경망', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/인공_신경망' },
  { id: 'encryption', label: '암호화', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/암호화' },
  { id: 'rendering', label: '렌더링', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/렌더링' },
  { id: 'hadoop', label: '분산 데이터(Hadoop)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/아파치_하둡' },
  { id: 'android', label: '모바일 OS(Android)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/안드로이드_(운영_체제)' },
  { id: 'blockchain', label: '블록체인', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/블록체인' },
  { id: 'object-detection', label: '객체 탐지', group: 'core-concept', wikiUrl: 'https://en.wikipedia.org/wiki/Object_detection' },
];

export const MOCK_LINKS: Link[] = [
  // 1학년
  { source: 'python-programming', target: 'syntax', value: 3 },
  { source: 'linux-system', target: 'kernel', value: 3 },
  // 2학년
  { source: 'data-structures', target: 'linked-list', value: 3 },
  { source: 'computer-architecture', target: 'cpu', value: 3 },
  { source: 'oss-development', target: 'git', value: 3 },
  { source: 'oop', target: 'inheritance', value: 3 },
  { source: 'web-programming', target: 'http', value: 3 },
  { source: 'database', target: 'sql', value: 3 },
  { source: 'computer-networks', target: 'http', value: 2 },
  { source: 'machine-learning-course', target: 'neural-network', value: 2 },
  // 3학년
  { source: 'algorithms', target: 'sorting', value: 3 },
  { source: 'operating-systems', target: 'process', value: 3 },
  { source: 'operating-systems', target: 'kernel', value: 2 },
  { source: 'compiler', target: 'parsing', value: 3 },
  { source: 'programming-languages', target: 'parsing', value: 2 },
  { source: 'software-engineering', target: 'design-pattern', value: 3 },
  { source: 'deep-learning', target: 'neural-network', value: 3 },
  { source: 'computer-graphics', target: 'rendering', value: 3 },
  { source: 'virtual-reality', target: 'rendering', value: 2 },
  { source: 'big-data-analysis', target: 'hadoop', value: 3 },
  // 4학년
  { source: 'information-security', target: 'encryption', value: 3 },
  { source: 'mobile-programming', target: 'android', value: 3 },
  { source: 'distributed-processing', target: 'process', value: 2 },
  { source: 'latest-ce-tech', target: 'blockchain', value: 3 },
  { source: 'computer-vision', target: 'object-detection', value: 3 },
  { source: 'image-processing', target: 'object-detection', value: 2 },
  
  // 개념 간 연결
  { source: 'syntax', target: 'parsing', value: 2 },
  { source: 'linked-list', target: 'sorting', value: 2 },
  { source: 'cpu', target: 'process', value: 2 },
  { source: 'inheritance', target: 'design-pattern', value: 2 },
  { source: 'neural-network', target: 'object-detection', value: 2 },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'CS-101',
    title: 'Python프로그래밍',
    department: '컴퓨터공학과',
    concepts: ['syntax'],
    prerequisites: [],
    score: 0.95
  },
  {
    id: 'CS-102',
    title: 'LinuxSystem',
    department: '컴퓨터공학과',
    concepts: ['kernel'],
    prerequisites: [],
    score: 0.88
  },
  {
    id: 'CS-201',
    title: '데이터구조',
    department: '컴퓨터공학과',
    concepts: ['linked-list'],
    prerequisites: ['CS-101'],
    score: 0.92
  },
  {
    id: 'CS-202',
    title: '컴퓨터구조',
    department: '컴퓨터공학과',
    concepts: ['cpu'],
    prerequisites: ['CS-102'],
    score: 0.85
  },
  {
    id: 'CS-301',
    title: '운영체제',
    department: '컴퓨터공학과',
    concepts: ['process', 'kernel'],
    prerequisites: ['CS-201', 'CS-202'],
    score: 0.90
  },
  {
    id: 'CS-302',
    title: '알고리즘',
    department: '컴퓨터공학과',
    concepts: ['sorting'],
    prerequisites: ['CS-201'],
    score: 0.94
  },
  {
    id: 'CS-303',
    title: '딥러닝',
    department: '컴퓨터공학과',
    concepts: ['neural-network'],
    prerequisites: ['CS-302'],
    score: 0.87
  },
  {
    id: 'CS-401',
    title: '정보보호',
    department: '컴퓨터공학과',
    concepts: ['encryption'],
    prerequisites: ['CS-301'],
    score: 0.82
  }
];
