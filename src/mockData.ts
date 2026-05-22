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

  // 위키피디아 기반 핵심 개념 (Intermediate Nodes)
  { id: 'pointer', label: '포인터', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/포인터_(프로그래밍)' },
  { id: 'memory-management', label: '메모리 관리', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/메모리_관리' },
  { id: 'linked-list', label: '연결 리스트', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/연결_리스트' },
  { id: 'stack-queue', label: '스택/큐', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/스택' },
  { id: 'sorting', label: '정렬 알고리즘', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/정렬_알고리즘' },
  { id: 'process-thread', label: '프로세스/스레드', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/프로세스' },
  { id: 'deadlock', label: '교착 상태(Deadlock)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/교착_상태' },
  { id: 'virtual-memory', label: '가상 메모리', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/가상_메모리' },
  { id: 'sql', label: 'SQL query', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/SQL' },
  { id: 'tcp-ip', label: 'TCP/IP', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/인터넷_프로토콜_집합' },
  { id: 'machine-learning', label: '머신러닝', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/기계_학습' },
  { id: 'neural-net', label: '신경망(NN)', group: 'core-concept', wikiUrl: 'https://ko.wikipedia.org/wiki/인공_신경망' },
];

export const MOCK_LINKS: Link[] = [
  { source: 'python-programming', target: 'pointer', value: 3 },
  { source: 'pointer', target: 'memory-management', value: 2 },
  { source: 'memory-management', target: 'data-structures', value: 3 },
  { source: 'data-structures', target: 'linked-list', value: 2 },
  { source: 'linked-list', target: 'stack-queue', value: 2 },
  { source: 'stack-queue', target: 'algorithms', value: 3 },
  { source: 'algorithms', target: 'sorting', value: 3 },
  { source: 'sorting', target: 'machine-learning-course', value: 2 },
  { source: 'python-programming', target: 'computer-architecture', value: 2 },
  { source: 'computer-architecture', target: 'process-thread', value: 3 },
  { source: 'process-thread', target: 'operating-systems', value: 3 },
  { source: 'operating-systems', target: 'deadlock', value: 2 },
  { source: 'operating-systems', target: 'virtual-memory', value: 3 },
  { source: 'virtual-memory', target: 'computer-architecture', value: 2 },
  { source: 'data-structures', target: 'database', value: 3 },
  { source: 'database', target: 'sql', value: 3 },
  { source: 'computer-networks', target: 'tcp-ip', value: 3 },
  { source: 'tcp-ip', target: 'operating-systems', value: 2 },
  { source: 'machine-learning-course', target: 'machine-learning', value: 3 },
  { source: 'machine-learning', target: 'neural-net', value: 3 },
  { source: 'software-engineering', target: 'algorithms', value: 2 },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'DONG-A-101',
    title: 'Python프로그래밍 및 실습',
    department: '컴퓨터공학과',
    concepts: ['pointer', 'memory-management'],
    prerequisites: [],
    score: 0.98
  },
  {
    id: 'DONG-A-201',
    title: '데이터구조',
    department: '컴퓨터공학과',
    concepts: ['linked-list', 'stack-queue', 'memory-management'],
    prerequisites: ['DONG-A-101'],
    score: 0.95
  },
  {
    id: 'DONG-A-202',
    title: '운영체제',
    department: '컴퓨터공학과',
    concepts: ['process-thread', 'deadlock', 'virtual-memory'],
    prerequisites: ['DONG-A-201', 'DONG-A-203'],
    score: 0.92
  },
  {
    id: 'DONG-A-203',
    title: '컴퓨터구조',
    department: '컴퓨터공학과',
    concepts: ['process-thread', 'virtual-memory'],
    prerequisites: ['DONG-A-101'],
    score: 0.88
  },
  {
    id: 'DONG-A-301',
    title: '알고리즘',
    department: '컴퓨터공학과',
    concepts: ['sorting', 'linked-list'],
    prerequisites: ['DONG-A-201'],
    score: 0.94
  },
  {
    id: 'DONG-A-302',
    title: '데이터베이스',
    department: '컴퓨터공학과',
    concepts: ['sql', 'data-structures'],
    prerequisites: ['DONG-A-201'],
    score: 0.91
  },
  {
    id: 'DONG-A-401',
    title: '머신러닝',
    department: '컴퓨터공학과',
    concepts: ['machine-learning', 'neural-net', 'algorithms'],
    prerequisites: ['DONG-A-301'],
    score: 0.85
  }
];
