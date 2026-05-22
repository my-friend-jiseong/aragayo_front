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
  // 동아대학교 컴퓨터공학과 주요 과목 (Nodes)
  { id: 'c-programming', label: 'C프로그래밍', group: 'subject', description: '컴퓨터공학의 기초가 되는 프로그래밍 언어', wikiUrl: 'https://ko.wikipedia.org/wiki/C_(프로그래밍_언어)' },
  { id: 'data-structures', label: '자료구조', group: 'subject', description: '데이터를 효율적으로 저장하고 관리하는 방법', wikiUrl: 'https://ko.wikipedia.org/wiki/자료_구조' },
  { id: 'algorithms', label: '알고리즘 분석', group: 'subject', description: '문제 해결을 위한 절차와 효율성 분석 방법론', wikiUrl: 'https://ko.wikipedia.org/wiki/알고리즘' },
  { id: 'operating-systems', label: '운영체제', group: 'subject', description: '컴퓨터 하드웨어와 소프트웨어 자원 관리 시스템', wikiUrl: 'https://ko.wikipedia.org/wiki/운영_체제' },
  { id: 'computer-architecture', label: '컴퓨터구조', group: 'subject', description: '컴퓨터 시스템의 설계 및 하드웨어 구성', wikiUrl: 'https://ko.wikipedia.org/wiki/컴퓨터_구조' },
  { id: 'database', label: '데이터베이스', group: 'subject', description: '데이터의 체계적인 저장, 관리 및 검색 시스템', wikiUrl: 'https://ko.wikipedia.org/wiki/데이터베이스' },
  { id: 'network', label: '컴퓨터네트워크', group: 'subject', description: '데이터 통신 프로토콜과 네트워크 아키텍처', wikiUrl: 'https://ko.wikipedia.org/wiki/컴퓨터_네트워크' },
  { id: 'ai', label: '인공지능', group: 'subject', description: '머신러닝 및 지능형 시스템 구현 기법', wikiUrl: 'https://ko.wikipedia.org/wiki/인공지능' },
  { id: 'software-engineering', label: '소프트웨어공학', group: 'subject', description: '체계적인 소프트웨어 개발 및 관리 방법론', wikiUrl: 'https://ko.wikipedia.org/wiki/소프트웨어_공학' },

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
  { source: 'c-programming', target: 'pointer', value: 3 },
  { source: 'pointer', target: 'memory-management', value: 2 },
  { source: 'memory-management', target: 'data-structures', value: 3 },
  { source: 'data-structures', target: 'linked-list', value: 2 },
  { source: 'linked-list', target: 'stack-queue', value: 2 },
  { source: 'stack-queue', target: 'algorithms', value: 3 },
  { source: 'algorithms', target: 'sorting', value: 3 },
  { source: 'sorting', target: 'ai', value: 2 },
  { source: 'c-programming', target: 'computer-architecture', value: 2 },
  { source: 'computer-architecture', target: 'process-thread', value: 3 },
  { source: 'process-thread', target: 'operating-systems', value: 3 },
  { source: 'operating-systems', target: 'deadlock', value: 2 },
  { source: 'operating-systems', target: 'virtual-memory', value: 3 },
  { source: 'virtual-memory', target: 'computer-architecture', value: 2 },
  { source: 'data-structures', target: 'database', value: 3 },
  { source: 'database', target: 'sql', value: 3 },
  { source: 'network', target: 'tcp-ip', value: 3 },
  { source: 'tcp-ip', target: 'operating-systems', value: 2 },
  { source: 'ai', target: 'machine-learning', value: 3 },
  { source: 'machine-learning', target: 'neural-net', value: 3 },
  { source: 'software-engineering', target: 'algorithms', value: 2 },
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'DONG-A-101',
    title: 'C프로그래밍 및 실습',
    department: '컴퓨터공학과',
    concepts: ['pointer', 'memory-management'],
    prerequisites: [],
    score: 0.98
  },
  {
    id: 'DONG-A-201',
    title: '자료구조',
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
    title: '알고리즘분석',
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
    title: '인공지능',
    department: '컴퓨터공학과',
    concepts: ['machine-learning', 'neural-net', 'algorithms'],
    prerequisites: ['DONG-A-301'],
    score: 0.85
  }
];
