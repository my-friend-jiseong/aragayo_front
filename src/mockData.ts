// Knowledge graph mock data (hackathon demo, frontend-only)
//
// Data model per docs/GRAPH_ARCHITECTURE.md:
//   - Two node types: Keyword and DataNode.
//   - Keyword has source 'wikipedia' | 'subject'. (과목도 키워드의 한 종류)
//   - Edges go DataNode → Keyword only (a blog post mentioning a concept).
//   - Keywords are indirectly connected via shared DataNodes.
//
// GAT 추론은 백엔드 부재로 수행하지 않는다. gatScore는 시연용 mock 값이다.

export type KeywordSource = 'wikipedia' | 'subject';
export type GradeLevel = '1' | '2' | '3' | '4';

export interface Keyword {
  id: string;
  label: string;
  source: KeywordSource;
  wikiUrl?: string;       // 위키 기반 키워드만 보유
  grade?: GradeLevel;     // 과목 기반 키워드만 보유
  gatScore: number;       // 0..1, mock attention 가중치
}

export interface DataNode {
  id: string;
  title: string;
  blogUrl: string;
}

export interface Edge {
  source: string; // DataNode id
  target: string; // Keyword id
}

const wikiUrl = (slug: string): string =>
  `https://ko.wikipedia.org/wiki/${encodeURIComponent(slug)}`;

export const MOCK_KEYWORDS: Keyword[] = [
  // ── 과목 키워드 (1학년) ───────────────────────
  { id: 'python-programming', label: 'Python프로그래밍', source: 'subject', grade: '1', gatScore: 0.78 },
  { id: 'linux-system', label: 'LinuxSystem', source: 'subject', grade: '1', gatScore: 0.62 },

  // ── 과목 키워드 (2학년) ───────────────────────
  { id: 'data-structures', label: '데이터구조', source: 'subject', grade: '2', gatScore: 0.86 },
  { id: 'computer-architecture', label: '컴퓨터구조', source: 'subject', grade: '2', gatScore: 0.70 },
  { id: 'oss-development', label: 'OSS개발', source: 'subject', grade: '2', gatScore: 0.55 },
  { id: 'oop', label: '객체지향프로그래밍', source: 'subject', grade: '2', gatScore: 0.74 },
  { id: 'web-programming', label: '웹프로그래밍', source: 'subject', grade: '2', gatScore: 0.68 },
  { id: 'database', label: '데이터베이스', source: 'subject', grade: '2', gatScore: 0.80 },
  { id: 'computer-networks', label: '컴퓨터네트워크', source: 'subject', grade: '2', gatScore: 0.76 },
  { id: 'machine-learning-course', label: '머신러닝', source: 'subject', grade: '2', gatScore: 0.82 },

  // ── 과목 키워드 (3학년) ───────────────────────
  { id: 'algorithms', label: '알고리즘', source: 'subject', grade: '3', gatScore: 0.90 },
  { id: 'programming-languages', label: '프로그래밍언어론', source: 'subject', grade: '3', gatScore: 0.60 },
  { id: 'operating-systems', label: '운영체제', source: 'subject', grade: '3', gatScore: 0.84 },
  { id: 'compiler', label: '컴파일러', source: 'subject', grade: '3', gatScore: 0.66 },
  { id: 'software-engineering', label: '소프트웨어공학', source: 'subject', grade: '3', gatScore: 0.70 },
  { id: 'computer-graphics', label: '컴퓨터그래픽스', source: 'subject', grade: '3', gatScore: 0.60 },
  { id: 'virtual-reality', label: '가상현실', source: 'subject', grade: '3', gatScore: 0.50 },
  { id: 'deep-learning', label: '딥러닝', source: 'subject', grade: '3', gatScore: 0.88 },
  { id: 'big-data-analysis', label: '빅데이터분석', source: 'subject', grade: '3', gatScore: 0.74 },

  // ── 과목 키워드 (4학년) ───────────────────────
  { id: 'information-security', label: '정보보호', source: 'subject', grade: '4', gatScore: 0.70 },
  { id: 'mobile-programming', label: '모바일프로그래밍', source: 'subject', grade: '4', gatScore: 0.68 },
  { id: 'distributed-processing', label: '분산처리', source: 'subject', grade: '4', gatScore: 0.72 },
  { id: 'computer-vision', label: '컴퓨터비전', source: 'subject', grade: '4', gatScore: 0.78 },
  { id: 'data-mining', label: '데이터마이닝', source: 'subject', grade: '4', gatScore: 0.70 },
  { id: 'image-processing', label: '영상처리', source: 'subject', grade: '4', gatScore: 0.66 },
  { id: 'latest-ce-tech', label: '최신CE기술', source: 'subject', grade: '4', gatScore: 0.55 },

  // ── 위키 기반 키워드 ──────────────────────────
  { id: 'variables', label: '변수와 자료형', source: 'wikipedia', wikiUrl: wikiUrl('변수_(프로그래밍)'), gatScore: 0.72 },
  { id: 'control-flow', label: '제어문', source: 'wikipedia', wikiUrl: wikiUrl('제어문'), gatScore: 0.68 },
  { id: 'functions', label: '함수와 스코프', source: 'wikipedia', wikiUrl: wikiUrl('함수_(컴퓨터_과학)'), gatScore: 0.74 },
  { id: 'shell-script', label: '쉘 스크립트', source: 'wikipedia', wikiUrl: wikiUrl('셸_스크립트'), gatScore: 0.50 },
  { id: 'file-system', label: '파일 시스템', source: 'wikipedia', wikiUrl: wikiUrl('파일_시스템'), gatScore: 0.62 },
  { id: 'permissions', label: '권한 관리', source: 'wikipedia', wikiUrl: wikiUrl('파일_시스템_권한'), gatScore: 0.48 },
  { id: 'stack-queue', label: '스택/큐', source: 'wikipedia', wikiUrl: wikiUrl('스택_(자료_구조)'), gatScore: 0.78 },
  { id: 'tree-graph', label: '트리/그래프', source: 'wikipedia', wikiUrl: wikiUrl('트리_(그래프_이론)'), gatScore: 0.82 },
  { id: 'hash-table', label: '해시 테이블', source: 'wikipedia', wikiUrl: wikiUrl('해시_테이블'), gatScore: 0.70 },
  { id: 'alu', label: 'ALU/연산장치', source: 'wikipedia', wikiUrl: wikiUrl('산술논리연산장치'), gatScore: 0.60 },
  { id: 'cache-memory', label: '캐시 메모리', source: 'wikipedia', wikiUrl: wikiUrl('캐시_(컴퓨팅)'), gatScore: 0.66 },
  { id: 'instruction-set', label: '명령어 집합(ISA)', source: 'wikipedia', wikiUrl: wikiUrl('명령어_집합'), gatScore: 0.58 },
  { id: 'big-o', label: '복잡도 분석(Big-O)', source: 'wikipedia', wikiUrl: wikiUrl('점근_표기법'), gatScore: 0.88 },
  { id: 'dynamic-programming', label: '동적 계획법', source: 'wikipedia', wikiUrl: wikiUrl('동적_계획법'), gatScore: 0.84 },
  { id: 'greedy', label: '탐욕 알고리즘', source: 'wikipedia', wikiUrl: wikiUrl('탐욕_알고리즘'), gatScore: 0.76 },
  { id: 'git-flow', label: 'Git Flow', source: 'wikipedia', wikiUrl: wikiUrl('깃_(소프트웨어)'), gatScore: 0.50 },
  { id: 'open-source-license', label: '오픈소스 라이선스', source: 'wikipedia', wikiUrl: wikiUrl('오픈_소스_라이선스'), gatScore: 0.42 },
  { id: 'ci-cd', label: 'CI/CD 기초', source: 'wikipedia', wikiUrl: wikiUrl('지속적_통합'), gatScore: 0.60 },
  { id: 'encapsulation', label: '캡슐화', source: 'wikipedia', wikiUrl: wikiUrl('캡슐화_(컴퓨터_프로그래밍)'), gatScore: 0.66 },
  { id: 'polymorphism', label: '다형성', source: 'wikipedia', wikiUrl: wikiUrl('다형성_(컴퓨터_과학)'), gatScore: 0.68 },
  { id: 'interface', label: '인터페이스 설계', source: 'wikipedia', wikiUrl: wikiUrl('인터페이스_(컴퓨팅)'), gatScore: 0.60 },
  { id: 'html-css', label: 'HTML/CSS', source: 'wikipedia', wikiUrl: wikiUrl('HTML'), gatScore: 0.70 },
  { id: 'dom-manipulation', label: 'DOM 조작', source: 'wikipedia', wikiUrl: wikiUrl('문서_객체_모델'), gatScore: 0.62 },
  { id: 'async-await', label: '비동기 처리', source: 'wikipedia', wikiUrl: wikiUrl('비동기_입출력'), gatScore: 0.70 },
  { id: 'semantics', label: '의미론(Semantics)', source: 'wikipedia', wikiUrl: wikiUrl('의미론_(컴퓨터_과학)'), gatScore: 0.46 },
  { id: 'type-system', label: '타입 시스템', source: 'wikipedia', wikiUrl: wikiUrl('자료형'), gatScore: 0.60 },
  { id: 'lambda-calculus', label: '람다 계산법', source: 'wikipedia', wikiUrl: wikiUrl('람다_대수'), gatScore: 0.55 },
  { id: 'relational-model', label: '관계형 모델', source: 'wikipedia', wikiUrl: wikiUrl('관계형_데이터베이스'), gatScore: 0.74 },
  { id: 'normalization', label: '정규화', source: 'wikipedia', wikiUrl: wikiUrl('데이터베이스_정규화'), gatScore: 0.68 },
  { id: 'transaction', label: '트랜잭션(ACID)', source: 'wikipedia', wikiUrl: wikiUrl('데이터베이스_트랜잭션'), gatScore: 0.72 },
  { id: 'osi-7-layer', label: 'OSI 7계층', source: 'wikipedia', wikiUrl: wikiUrl('OSI_모형'), gatScore: 0.70 },
  { id: 'tcp-udp', label: 'TCP/UDP', source: 'wikipedia', wikiUrl: wikiUrl('전송_계층'), gatScore: 0.78 },
  { id: 'routing', label: '라우팅/스위칭', source: 'wikipedia', wikiUrl: wikiUrl('라우팅'), gatScore: 0.62 },
  { id: 'virtual-memory', label: '가상 메모리', source: 'wikipedia', wikiUrl: wikiUrl('가상_기억_장치'), gatScore: 0.74 },
  { id: 'deadlock', label: '교착 상태', source: 'wikipedia', wikiUrl: wikiUrl('교착_상태'), gatScore: 0.66 },
  { id: 'scheduling', label: 'CPU 스케줄링', source: 'wikipedia', wikiUrl: wikiUrl('스케줄링_(컴퓨팅)'), gatScore: 0.70 },
  { id: 'lexical-analysis', label: '어휘 분석', source: 'wikipedia', wikiUrl: wikiUrl('어휘_분석'), gatScore: 0.50 },
  { id: 'syntax-tree', label: '추상 구문 트리(AST)', source: 'wikipedia', wikiUrl: wikiUrl('추상_구문_트리'), gatScore: 0.62 },
  { id: 'code-generation', label: '코드 생성', source: 'wikipedia', wikiUrl: wikiUrl('코드_생성_(컴파일러)'), gatScore: 0.48 },
  { id: 'agile', label: '애자일 방법론', source: 'wikipedia', wikiUrl: wikiUrl('애자일_소프트웨어_개발'), gatScore: 0.66 },
  { id: 'uml', label: 'UML 모델링', source: 'wikipedia', wikiUrl: wikiUrl('통합_모델링_언어'), gatScore: 0.54 },
  { id: 'unit-testing', label: '단위 테스트', source: 'wikipedia', wikiUrl: wikiUrl('단위_테스트'), gatScore: 0.70 },
  { id: 'supervised-learning', label: '지도 학습', source: 'wikipedia', wikiUrl: wikiUrl('지도_학습'), gatScore: 0.84 },
  { id: 'regression', label: '회귀 분석', source: 'wikipedia', wikiUrl: wikiUrl('회귀_분석'), gatScore: 0.72 },
  { id: 'decision-tree', label: '의사결정 나무', source: 'wikipedia', wikiUrl: wikiUrl('결정_트리_학습법'), gatScore: 0.68 },
  { id: 'pki', label: '공개키 암호화(PKI)', source: 'wikipedia', wikiUrl: wikiUrl('공개_키_기반_구조'), gatScore: 0.60 },
  { id: 'firewall', label: '방화벽/IDS', source: 'wikipedia', wikiUrl: wikiUrl('방화벽_(전산)'), gatScore: 0.50 },
  { id: 'vulnerability', label: '취약점 분석', source: 'wikipedia', wikiUrl: wikiUrl('취약점'), gatScore: 0.62 },
  { id: 'rasterization', label: '래스터화', source: 'wikipedia', wikiUrl: wikiUrl('래스터_그래픽스'), gatScore: 0.48 },
  { id: 'shader', label: '셰이더(Shader)', source: 'wikipedia', wikiUrl: wikiUrl('셰이더'), gatScore: 0.50 },
  { id: 'transformation', label: '기하 변환', source: 'wikipedia', wikiUrl: wikiUrl('기하변환'), gatScore: 0.46 },
  { id: 'unity-unreal', label: '게임 엔진 기초', source: 'wikipedia', wikiUrl: wikiUrl('게임_엔진'), gatScore: 0.42 },
  { id: 'immersion', label: '몰입형 인터페이스', source: 'wikipedia', wikiUrl: wikiUrl('가상_현실'), gatScore: 0.36 },
  { id: 'haptic', label: '햅틱 기술', source: 'wikipedia', wikiUrl: wikiUrl('햅틱'), gatScore: 0.34 },
  { id: 'cnn', label: '합성곱 신경망(CNN)', source: 'wikipedia', wikiUrl: wikiUrl('합성곱_신경망'), gatScore: 0.92 },
  { id: 'rnn-lstm', label: '순환 신경망(RNN)', source: 'wikipedia', wikiUrl: wikiUrl('순환_신경망'), gatScore: 0.74 },
  { id: 'backpropagation', label: '역전파 알고리즘', source: 'wikipedia', wikiUrl: wikiUrl('역전파'), gatScore: 0.82 },
  { id: 'spark', label: 'Apache Spark', source: 'wikipedia', wikiUrl: wikiUrl('아파치_스파크'), gatScore: 0.60 },
  { id: 'nosql', label: 'NoSQL 데이터베이스', source: 'wikipedia', wikiUrl: wikiUrl('NoSQL'), gatScore: 0.66 },
  { id: 'data-lake', label: '데이터 레이크', source: 'wikipedia', wikiUrl: wikiUrl('데이터_레이크'), gatScore: 0.50 },
  { id: 'android-intent', label: '안드로이드 인텐트', source: 'wikipedia', wikiUrl: wikiUrl('인텐트'), gatScore: 0.46 },
  { id: 'jetpack-compose', label: '컴포즈 UI', source: 'wikipedia', wikiUrl: wikiUrl('젯팩_컴포즈'), gatScore: 0.50 },
  { id: 'mobile-lifecycle', label: '생명주기 관리', source: 'wikipedia', wikiUrl: wikiUrl('액티비티_(안드로이드)'), gatScore: 0.42 },
  { id: 'rpc-grpc', label: 'RPC/gRPC', source: 'wikipedia', wikiUrl: wikiUrl('원격_프로시저_호출'), gatScore: 0.60 },
  { id: 'consensus', label: '합의 알고리즘', source: 'wikipedia', wikiUrl: wikiUrl('합의_(컴퓨터_과학)'), gatScore: 0.62 },
  { id: 'load-balancing', label: '로드 밸런싱', source: 'wikipedia', wikiUrl: wikiUrl('부하_분산'), gatScore: 0.56 },
  { id: 'yolo', label: 'YOLO/객체 탐지', source: 'wikipedia', wikiUrl: wikiUrl('객체_탐지'), gatScore: 0.70 },
  { id: 'feature-extraction', label: '특징 추출', source: 'wikipedia', wikiUrl: wikiUrl('특징_추출'), gatScore: 0.60 },
  { id: 'stereo-vision', label: '스테레오 비전', source: 'wikipedia', wikiUrl: wikiUrl('입체시'), gatScore: 0.42 },
  { id: 'clustering', label: '군집화(Clustering)', source: 'wikipedia', wikiUrl: wikiUrl('군집화'), gatScore: 0.70 },
  { id: 'association-rule', label: '연관 규칙 분석', source: 'wikipedia', wikiUrl: wikiUrl('연관_규칙_학습'), gatScore: 0.54 },
  { id: 'anomaly-detection', label: '이상 탐지', source: 'wikipedia', wikiUrl: wikiUrl('이상_탐지'), gatScore: 0.58 },
  { id: 'filtering', label: '공간 필터링', source: 'wikipedia', wikiUrl: wikiUrl('이미지_필터'), gatScore: 0.50 },
  { id: 'morphology', label: '모폴로지 연산', source: 'wikipedia', wikiUrl: wikiUrl('수학적_형태학'), gatScore: 0.40 },
  { id: 'edge-detection', label: '에지 검출', source: 'wikipedia', wikiUrl: wikiUrl('경계_검출'), gatScore: 0.54 },
  { id: 'edge-computing', label: '에지 컴퓨팅', source: 'wikipedia', wikiUrl: wikiUrl('에지_컴퓨팅'), gatScore: 0.60 },
  { id: 'quantum-computing', label: '양자 컴퓨팅 기초', source: 'wikipedia', wikiUrl: wikiUrl('양자_컴퓨터'), gatScore: 0.66 },
  { id: 'smart-contract', label: '스마트 컨트랙트', source: 'wikipedia', wikiUrl: wikiUrl('스마트_계약'), gatScore: 0.58 },
];

// ─────────────────────────────────────────────────────────────
// 데이터 노드(블로그 글) 생성 — 키워드 수의 2~3배 분량을 만들기 위해
// 과목별 다중 블로그 + 크로스컷팅 블로그를 템플릿/스펙으로 정의해 자동 생성한다.
// ─────────────────────────────────────────────────────────────

// 과목 → 그 과목의 핵심 개념 키워드 3개 매핑
const SUBJECT_CONCEPTS_MAP: Record<string, [string, string, string]> = {
  'python-programming': ['variables', 'control-flow', 'functions'],
  'linux-system': ['shell-script', 'file-system', 'permissions'],
  'data-structures': ['stack-queue', 'tree-graph', 'hash-table'],
  'computer-architecture': ['alu', 'cache-memory', 'instruction-set'],
  'oss-development': ['git-flow', 'open-source-license', 'ci-cd'],
  'oop': ['encapsulation', 'polymorphism', 'interface'],
  'web-programming': ['html-css', 'dom-manipulation', 'async-await'],
  'database': ['relational-model', 'normalization', 'transaction'],
  'computer-networks': ['osi-7-layer', 'tcp-udp', 'routing'],
  'machine-learning-course': ['supervised-learning', 'regression', 'decision-tree'],
  'algorithms': ['big-o', 'dynamic-programming', 'greedy'],
  'programming-languages': ['semantics', 'type-system', 'lambda-calculus'],
  'operating-systems': ['virtual-memory', 'deadlock', 'scheduling'],
  'compiler': ['lexical-analysis', 'syntax-tree', 'code-generation'],
  'software-engineering': ['agile', 'uml', 'unit-testing'],
  'computer-graphics': ['rasterization', 'shader', 'transformation'],
  'virtual-reality': ['unity-unreal', 'immersion', 'haptic'],
  'deep-learning': ['cnn', 'rnn-lstm', 'backpropagation'],
  'big-data-analysis': ['spark', 'nosql', 'data-lake'],
  'information-security': ['pki', 'firewall', 'vulnerability'],
  'mobile-programming': ['android-intent', 'jetpack-compose', 'mobile-lifecycle'],
  'distributed-processing': ['rpc-grpc', 'consensus', 'load-balancing'],
  'computer-vision': ['yolo', 'feature-extraction', 'stereo-vision'],
  'data-mining': ['clustering', 'association-rule', 'anomaly-detection'],
  'image-processing': ['filtering', 'morphology', 'edge-detection'],
  'latest-ce-tech': ['edge-computing', 'quantum-computing', 'smart-contract'],
};

// 과목별 블로그 템플릿 (한 과목당 8개의 블로그를 생성).
// keywordIndices: 0=과목 키워드, 1=concept1, 2=concept2, 3=concept3
type SubjectBlogTemplate = {
  idSuffix: string;
  titlePattern: string;
  keywordIndices: number[];
};

const SUBJECT_BLOG_TEMPLATES: SubjectBlogTemplate[] = [
  { idSuffix: 'intro', titlePattern: '{S}이란 무엇인가', keywordIndices: [0, 1, 2, 3] },
  { idSuffix: 'beginner', titlePattern: '초보자를 위한 {S}: {C1} 입문', keywordIndices: [0, 1] },
  { idSuffix: 'core', titlePattern: '{S} 핵심 정리 — {C2}', keywordIndices: [0, 2] },
  { idSuffix: 'deep', titlePattern: '{C3} 완전 정복', keywordIndices: [0, 3] },
  { idSuffix: 'practice', titlePattern: '{S} 실전 — {C1}과 {C2}', keywordIndices: [0, 1, 2] },
  { idSuffix: 'master', titlePattern: '{S}, {C2}와 {C3}로 마스터하기', keywordIndices: [0, 2, 3] },
  { idSuffix: 'compare', titlePattern: '{C1} vs {C3} — {S} 관점에서', keywordIndices: [0, 1, 3] },
  { idSuffix: 'review', titlePattern: '한 시간 만에 끝내는 {S}', keywordIndices: [0, 1, 2, 3] },
];

// 크로스컷팅 블로그 — 서로 다른 과목 영역의 키워드를 함께 다루어 그래프 결합도를 높인다.
const CROSS_CUTTING_BLOG_SPECS: Array<{
  id: string;
  title: string;
  keywordIds: string[];
}> = [
  // 함수형 — Python ↔ 프로그래밍언어론
  { id: 'blog-cc-fn-lambda-1', title: '함수 스코프에서 람다 계산법까지', keywordIds: ['functions', 'lambda-calculus'] },
  { id: 'blog-cc-fn-lambda-2', title: '람다로 이해하는 함수형 프로그래밍', keywordIds: ['functions', 'lambda-calculus', 'type-system'] },
  { id: 'blog-cc-fn-types', title: '함수와 타입 시스템의 만남', keywordIds: ['functions', 'type-system'] },

  // 자료구조 ↔ 운영체제
  { id: 'blog-cc-queue-sched-1', title: '큐로 이해하는 CPU 스케줄링', keywordIds: ['stack-queue', 'scheduling'] },
  { id: 'blog-cc-queue-sched-2', title: '운영체제 큐 자료구조 설계', keywordIds: ['stack-queue', 'scheduling', 'data-structures'] },
  { id: 'blog-cc-tree-deadlock', title: '교착 상태 탐지를 위한 그래프 분석', keywordIds: ['tree-graph', 'deadlock'] },

  // 자료구조 ↔ 컴파일러
  { id: 'blog-cc-tree-ast-1', title: '트리 구조로 본 추상 구문 트리(AST)', keywordIds: ['tree-graph', 'syntax-tree'] },
  { id: 'blog-cc-tree-ast-2', title: 'AST와 트리 순회 알고리즘', keywordIds: ['tree-graph', 'syntax-tree', 'lexical-analysis'] },

  // 컴퓨터구조 ↔ 컴파일러
  { id: 'blog-cc-isa-codegen-1', title: 'ISA와 컴파일러의 코드 생성', keywordIds: ['instruction-set', 'code-generation'] },
  { id: 'blog-cc-isa-codegen-2', title: '명령어 집합으로 보는 코드 생성', keywordIds: ['instruction-set', 'code-generation', 'compiler'] },

  // 네트워크 ↔ 분산
  { id: 'blog-cc-tcp-rpc-1', title: 'TCP에서 gRPC로 — 네트워크와 분산', keywordIds: ['tcp-udp', 'rpc-grpc'] },
  { id: 'blog-cc-tcp-rpc-2', title: 'RPC 위의 분산 합의 알고리즘', keywordIds: ['rpc-grpc', 'consensus', 'tcp-udp'] },
  { id: 'blog-cc-osi-route', title: 'OSI 7계층과 라우팅 프로토콜', keywordIds: ['osi-7-layer', 'routing'] },

  // 머신러닝 ↔ 딥러닝
  { id: 'blog-cc-supervised-bp-1', title: '지도 학습과 역전파의 수학', keywordIds: ['supervised-learning', 'backpropagation'] },
  { id: 'blog-cc-supervised-bp-2', title: '역전파로 학습되는 신경망', keywordIds: ['supervised-learning', 'backpropagation', 'cnn'] },
  { id: 'blog-cc-regression-bp', title: '회귀 분석에서 신경망 학습으로', keywordIds: ['regression', 'backpropagation'] },

  // 딥러닝 ↔ 컴퓨터비전
  { id: 'blog-cc-cnn-yolo-1', title: 'CNN으로 만드는 객체 탐지(YOLO)', keywordIds: ['cnn', 'yolo'] },
  { id: 'blog-cc-cnn-yolo-2', title: 'YOLO 아키텍처와 CNN 백본', keywordIds: ['cnn', 'yolo', 'feature-extraction'] },
  { id: 'blog-cc-feature-edge', title: '특징 추출과 에지 검출', keywordIds: ['feature-extraction', 'edge-detection'] },

  // Linux ↔ OSS
  { id: 'blog-cc-shell-ci-1', title: '쉘 스크립트로 CI/CD 자동화', keywordIds: ['shell-script', 'ci-cd'] },
  { id: 'blog-cc-shell-ci-2', title: 'Git 훅과 쉘 스크립트', keywordIds: ['shell-script', 'git-flow'] },

  // 웹 ↔ 모바일
  { id: 'blog-cc-declarative-ui-1', title: 'HTML/CSS와 컴포즈 — 선언형 UI', keywordIds: ['html-css', 'jetpack-compose'] },
  { id: 'blog-cc-declarative-ui-2', title: 'DOM과 컴포즈의 렌더링 모델', keywordIds: ['dom-manipulation', 'jetpack-compose'] },

  // 데이터베이스 ↔ 빅데이터
  { id: 'blog-cc-sql-nosql-1', title: '관계형과 NoSQL — 데이터 모델 비교', keywordIds: ['relational-model', 'nosql'] },
  { id: 'blog-cc-sql-nosql-2', title: '정규화 vs 비정규화 — NoSQL 선택', keywordIds: ['normalization', 'nosql'] },
  { id: 'blog-cc-tx-spark', title: '트랜잭션과 Spark의 일관성', keywordIds: ['transaction', 'spark'] },

  // 운영체제 ↔ 정보보호
  { id: 'blog-cc-memory-vuln-1', title: '가상 메모리와 메모리 취약점', keywordIds: ['virtual-memory', 'vulnerability'] },
  { id: 'blog-cc-memory-vuln-2', title: '메모리 보호와 권한 관리', keywordIds: ['virtual-memory', 'permissions'] },

  // 네트워크 ↔ 정보보호
  { id: 'blog-cc-osi-firewall', title: 'OSI 7계층과 방화벽 정책', keywordIds: ['osi-7-layer', 'firewall'] },
  { id: 'blog-cc-pki-tcp', title: 'TLS 위의 공개키 암호화(PKI)', keywordIds: ['pki', 'tcp-udp'] },

  // 데이터마이닝 ↔ 빅데이터
  { id: 'blog-cc-cluster-lake', title: '데이터 레이크에서 군집화하기', keywordIds: ['clustering', 'data-lake'] },
  { id: 'blog-cc-assoc-spark', title: 'Spark로 연관 규칙 분석', keywordIds: ['association-rule', 'spark'] },

  // 최신기술 ↔ 데이터베이스
  { id: 'blog-cc-blockchain-tx', title: '스마트 컨트랙트와 트랜잭션', keywordIds: ['smart-contract', 'transaction'] },
  { id: 'blog-cc-edge-routing', title: '에지 컴퓨팅 환경의 라우팅', keywordIds: ['edge-computing', 'routing'] },

  // OOP ↔ 소프트웨어공학
  { id: 'blog-cc-encap-uml', title: '캡슐화 설계와 UML 표현', keywordIds: ['encapsulation', 'uml'] },
  { id: 'blog-cc-interface-agile', title: '인터페이스 설계와 애자일', keywordIds: ['interface', 'agile'] },
  { id: 'blog-cc-poly-test', title: '다형성과 단위 테스트 전략', keywordIds: ['polymorphism', 'unit-testing'] },

  // 알고리즘 ↔ 머신러닝
  { id: 'blog-cc-bigo-decision', title: 'Big-O로 분석하는 의사결정 나무', keywordIds: ['big-o', 'decision-tree'] },
  { id: 'blog-cc-dp-regression', title: '동적 계획법과 회귀 분석', keywordIds: ['dynamic-programming', 'regression'] },
  { id: 'blog-cc-greedy-anomaly', title: '탐욕 알고리즘으로 이상 탐지', keywordIds: ['greedy', 'anomaly-detection'] },

  // 그래픽스 ↔ VR
  { id: 'blog-cc-shader-engine', title: '셰이더와 게임 엔진 기초', keywordIds: ['shader', 'unity-unreal'] },
  { id: 'blog-cc-transform-immersion', title: '기하 변환과 몰입형 인터페이스', keywordIds: ['transformation', 'immersion'] },

  // 영상처리 ↔ 컴퓨터비전
  { id: 'blog-cc-filter-feature', title: '공간 필터와 특징 추출', keywordIds: ['filtering', 'feature-extraction'] },
  { id: 'blog-cc-morph-stereo', title: '모폴로지 연산과 스테레오 비전', keywordIds: ['morphology', 'stereo-vision'] },

  // 분산 ↔ 운영체제
  { id: 'blog-cc-loadbalance-sched', title: '로드 밸런싱과 CPU 스케줄링', keywordIds: ['load-balancing', 'scheduling'] },
  { id: 'blog-cc-consensus-deadlock', title: '합의 알고리즘과 분산 교착', keywordIds: ['consensus', 'deadlock'] },

  // 모바일 ↔ 정보보호
  { id: 'blog-cc-intent-vuln', title: '안드로이드 인텐트와 권한 취약점', keywordIds: ['android-intent', 'vulnerability'] },
  { id: 'blog-cc-lifecycle-perm', title: '생명주기와 권한 모델', keywordIds: ['mobile-lifecycle', 'permissions'] },
];

// ── 자동 생성 ────────────────────────────────────────────────
function buildAllBlogs(): { dataNodes: DataNode[]; edges: Edge[] } {
  const dataNodes: DataNode[] = [];
  const edges: Edge[] = [];
  const keywordById = new Map(MOCK_KEYWORDS.map(k => [k.id, k]));

  // 1) 과목별 템플릿 블로그 생성
  for (const [subjectId, conceptIds] of Object.entries(SUBJECT_CONCEPTS_MAP)) {
    const subjectKw = keywordById.get(subjectId);
    if (!subjectKw) continue;
    const conceptKws = conceptIds.map(cid => keywordById.get(cid));
    if (conceptKws.some(c => !c)) continue;

    const labels = [
      subjectKw.label,
      conceptKws[0]!.label,
      conceptKws[1]!.label,
      conceptKws[2]!.label,
    ];
    const ids = [subjectId, ...conceptIds];

    for (const tpl of SUBJECT_BLOG_TEMPLATES) {
      const blogId = `blog-${subjectId}-${tpl.idSuffix}`;
      const title = tpl.titlePattern
        .replace('{S}', labels[0])
        .replace('{C1}', labels[1])
        .replace('{C2}', labels[2])
        .replace('{C3}', labels[3]);

      dataNodes.push({
        id: blogId,
        title,
        blogUrl: `https://example.blog/${subjectId}/${tpl.idSuffix}`,
      });

      for (const idx of tpl.keywordIndices) {
        edges.push({ source: blogId, target: ids[idx] });
      }
    }
  }

  // 2) 크로스컷팅 블로그 추가
  for (const spec of CROSS_CUTTING_BLOG_SPECS) {
    dataNodes.push({
      id: spec.id,
      title: spec.title,
      blogUrl: `https://example.blog/cross/${spec.id.replace('blog-cc-', '')}`,
    });
    for (const kwId of spec.keywordIds) {
      edges.push({ source: spec.id, target: kwId });
    }
  }

  return { dataNodes, edges };
}

const { dataNodes: __dataNodes, edges: __edges } = buildAllBlogs();

export const MOCK_DATA_NODES: DataNode[] = __dataNodes;
export const MOCK_EDGES: Edge[] = __edges;

/**
 * 키워드-키워드 인접 관계를 유도한다.
 * 두 키워드가 적어도 하나의 데이터 노드를 공유하면 무방향 연결로 본다.
 * (시각화에는 직접 사용하지 않는다 — 구조 정의상 키워드 간 직접 간선은 없음.)
 * P1 경로 탐색 등 그래프 알고리즘 단계에서만 사용한다.
 */
export function deriveKeywordLinks(
  edges: Edge[] = MOCK_EDGES
): Array<{ source: string; target: string }> {
  const dataToKeywords = new Map<string, string[]>();
  for (const e of edges) {
    const arr = dataToKeywords.get(e.source) ?? [];
    arr.push(e.target);
    dataToKeywords.set(e.source, arr);
  }

  const seen = new Set<string>();
  const links: Array<{ source: string; target: string }> = [];
  for (const kws of dataToKeywords.values()) {
    for (let i = 0; i < kws.length; i++) {
      for (let j = i + 1; j < kws.length; j++) {
        const [a, b] = kws[i] < kws[j] ? [kws[i], kws[j]] : [kws[j], kws[i]];
        const key = `${a}|${b}`;
        if (seen.has(key)) continue;
        seen.add(key);
        links.push({ source: a, target: b });
      }
    }
  }
  return links;
}
