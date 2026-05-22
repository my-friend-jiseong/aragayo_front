import { useState, useMemo, useRef, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { forceCollide } from 'd3-force';
import { MOCK_KEYWORDS, MOCK_DATA_NODES, MOCK_EDGES } from './mockData';
import { computeMultiSourcePathHighlight } from './pathSearch';
import logoUrl from './assets/logo.png';
import './App.css';

const HIGH_GAT_THRESHOLD = 0.8;

const KEYWORD_LABEL_BY_ID = (() => {
  const m = new Map();
  MOCK_KEYWORDS.forEach(k => m.set(k.id, k.label));
  return m;
})();

// 학습 상태 색상 (P2 명세 §2.3)
const STATUS_COLORS = {
  completed: '#10b981',   // 초록
  'in-progress': '#f97316', // 주황
  planned: '#a855f7',     // 보라 (subject blue와 구분되도록)
};
const STATUS_ICONS = {
  completed: '✓',
  'in-progress': '↻',
  planned: '★',
};
const STATUS_LABELS = {
  completed: '학습 완료',
  'in-progress': '학습 중',
  planned: '학습 예정',
};

function App() {
  const [activeTab, setActiveTab] = useState('map');
  // 목표 키워드 입력 텍스트. 학습 경로는 "학습 완료" 마킹된 모든 키워드 → 이 목표로 향함.
  const [inputTarget, setInputTarget] = useState(KEYWORD_LABEL_BY_ID.get('algorithms') ?? '');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedGrades, setSelectedGrades] = useState(['1', '2', '3', '4']);
  const [showOnlySelected, setShowOnlySelected] = useState(false);

  // 입력 텍스트 → 목표 키워드 id 유도. 매칭 없으면 null.
  const targetId = useMemo(
    () => MOCK_KEYWORDS.find(k => k.label === inputTarget)?.id ?? null,
    [inputTarget]
  );

  // P2: 학습 상태 마킹. 세션 메모리(state)에만 보관. (FEATURE_NODE_STATUS.md §2.4)
  const [nodeStatusMap, setNodeStatusMap] = useState({});

  // 학습 완료 키워드 = 경로 탐색의 시작점들
  const completedSourceIds = useMemo(
    () => Object.keys(nodeStatusMap).filter(id => nodeStatusMap[id] === 'completed'),
    [nodeStatusMap]
  );

  // 완료 시작점들 → 목표로 향하는 경로 합집합
  const pathData = useMemo(() => {
    if (!targetId || completedSourceIds.length === 0) {
      return { paths: [], keywords: new Set(), dataNodes: new Set(), edges: new Set() };
    }
    return computeMultiSourcePathHighlight(completedSourceIds, targetId, MOCK_EDGES, 4);
  }, [completedSourceIds, targetId]);

  const hasPath = pathData.paths.length > 0;
  // 안내 배너 분기: 목표만 있고 완료 노드가 없는 초기 상태 / 완료가 있어도 경로 없는 상태
  const noCompletedYet = !!targetId && completedSourceIds.length === 0;
  const showNoPath = !!targetId && completedSourceIds.length > 0 && pathData.paths.length === 0;
  const setStatus = (id, status) => {
    setNodeStatusMap(prev => {
      const next = { ...prev };
      if (!status) delete next[id];
      else next[id] = status;
      return next;
    });
  };

  // P2: 노드 클릭 시 열리는 상세 사이드 패널의 대상 키워드 id
  const [panelNodeId, setPanelNodeId] = useState(null);
  const panelKeyword = useMemo(
    () => (panelNodeId ? MOCK_KEYWORDS.find(k => k.id === panelNodeId) ?? null : null),
    [panelNodeId]
  );

  // P3: 내 커리큘럼 (FEATURE_MY_CURRICULUM.md)
  //  - 저장 단위: 목표 키워드 + 저장 시점 완료 키워드 스냅샷 + 이름 + 메모 + 생성시각
  //  - 세션 메모리 (새로고침 시 초기화)
  const [curriculumStore, setCurriculumStore] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveMemo, setSaveMemo] = useState('');

  // 저장 가능 조건: 목표가 유효 + 완료 노드 ≥1 + 경로 ≥1
  const canSaveCurriculum = !!targetId && completedSourceIds.length > 0 && hasPath;

  const saveCurriculum = () => {
    if (!canSaveCurriculum || !saveName.trim()) return;
    const entry = {
      id: `cur-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      name: saveName.trim(),
      memo: saveMemo.trim() || undefined,
      target: targetId,
      completedSnapshot: completedSourceIds.slice(), // 저장 시점 완료 키워드 ID 배열
      createdAt: new Date().toISOString(),
    };
    setCurriculumStore(prev => [...prev, entry]);
    setShowSaveModal(false);
    setSaveName('');
    setSaveMemo('');
  };

  const loadCurriculum = (entry) => {
    // 목표 입력 복원
    const tLabel = KEYWORD_LABEL_BY_ID.get(entry.target);
    if (tLabel) setInputTarget(tLabel);
    // 완료 스냅샷의 키워드들을 completed로 마킹 (기존 다른 상태는 보존)
    if (Array.isArray(entry.completedSnapshot)) {
      setNodeStatusMap(prev => {
        const next = { ...prev };
        for (const id of entry.completedSnapshot) {
          next[id] = 'completed';
        }
        return next;
      });
    }
  };

  const deleteCurriculum = (id) => {
    setCurriculumStore(prev => prev.filter(e => e.id !== id));
  };

  const openSaveModal = () => {
    if (!canSaveCurriculum) return;
    const tLabel = KEYWORD_LABEL_BY_ID.get(targetId) ?? '';
    setSaveName(`${tLabel} 학습 경로`);
    setSaveMemo('');
    setShowSaveModal(true);
  };
  
  const containerRef = useRef(null);
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 학년 토글 핸들러
  const toggleGrade = (grade) => {
    setSelectedGrades(prev => 
      prev.includes(grade) ? prev.filter(g => g !== grade) : [...prev, grade]
    );
  };

  // 줌 변경 핸들러
  const handleZoomChange = (e) => {
    const level = parseFloat(e.target.value);
    setZoomLevel(level);
    if (fgRef.current) {
      fgRef.current.zoom(level, 400);
    }
  };

  // 필터링된 그래프 데이터.
  // docs/GRAPH_ARCHITECTURE.md §2.1에 따라 키워드/데이터 노드 두 타입을 모두 렌더링하고,
  // 간선은 데이터 노드 → 키워드 단방향으로만 둔다. 키워드 간 직접 간선은 만들지 않는다.
  // 목표 키워드 + 완료 시작점이 showOnlySelected 모드의 seed가 된다. 일반 보기에서는 영향 없음.
  const selectionKey = showOnlySelected
    ? `${targetId ?? ''}|${completedSourceIds.join(',')}`
    : 'all';
  const graphData = useMemo(() => {
    try {
      // 1) 가시 키워드 집합 결정
      let visibleKeywordIds;
      if (showOnlySelected) {
        // 목표 + 완료 시작점들 + 그들을 만지는 데이터 노드를 통해 닿는 키워드들
        const seeds = [targetId, ...completedSourceIds].filter(Boolean);
        visibleKeywordIds = new Set(seeds);
        const dataTouchingSelected = new Set();
        MOCK_EDGES.forEach(e => {
          if (visibleKeywordIds.has(e.target)) dataTouchingSelected.add(e.source);
        });
        MOCK_EDGES.forEach(e => {
          if (dataTouchingSelected.has(e.source)) visibleKeywordIds.add(e.target);
        });
      } else if (selectedGrades.length === 4) {
        // 전체 보기: 모든 키워드 가시
        visibleKeywordIds = new Set(MOCK_KEYWORDS.map(k => k.id));
      } else {
        // 학년 필터: 해당 학년 과목 + 그 과목을 만지는 데이터 노드를 통해 닿는 위키 키워드
        const seedSubjects = new Set(
          MOCK_KEYWORDS
            .filter(k => k.source === 'subject' && k.grade && selectedGrades.includes(k.grade))
            .map(k => k.id)
        );
        const dataTouchingSeed = new Set();
        MOCK_EDGES.forEach(e => {
          if (seedSubjects.has(e.target)) dataTouchingSeed.add(e.source);
        });
        visibleKeywordIds = new Set(seedSubjects);
        MOCK_EDGES.forEach(e => {
          if (dataTouchingSeed.has(e.source)) visibleKeywordIds.add(e.target);
        });
      }

      // 2) 가시 데이터 노드: 가시 키워드를 2개 이상 만지는 데이터 노드만 표시
      //    (1개만 만지면 단순히 그 키워드를 가리키는 외톨이라 시각화 가치가 낮고,
      //     2개 이상이어야 키워드 간 "간접 연결" 구조 의미가 살아남)
      const dataTouchCount = new Map();
      MOCK_EDGES.forEach(e => {
        if (visibleKeywordIds.has(e.target)) {
          dataTouchCount.set(e.source, (dataTouchCount.get(e.source) ?? 0) + 1);
        }
      });
      const visibleDataNodeIds = new Set();
      for (const [d, count] of dataTouchCount) {
        if (count >= 2) visibleDataNodeIds.add(d);
      }

      // 3) 노드/간선 구성
      // 라벨 z-order: 과목 > 위키 > 데이터. ForceGraph2D는 배열 순서대로 그리므로
      // 뒤에 올수록 위에 그려진다 → [데이터, 위키, 과목] 순으로 배치.
      const subjectNodes = MOCK_KEYWORDS
        .filter(k => visibleKeywordIds.has(k.id) && k.source === 'subject')
        .map(k => ({ ...k, id: String(k.id), nodeType: 'keyword' }));

      const wikiNodes = MOCK_KEYWORDS
        .filter(k => visibleKeywordIds.has(k.id) && k.source === 'wikipedia')
        .map(k => ({ ...k, id: String(k.id), nodeType: 'keyword' }));

      const dataNodes = MOCK_DATA_NODES
        .filter(d => visibleDataNodeIds.has(d.id))
        .map(d => ({ ...d, id: String(d.id), nodeType: 'dataNode', label: d.title }));

      const filteredEdges = MOCK_EDGES
        .filter(e => visibleDataNodeIds.has(e.source) && visibleKeywordIds.has(e.target))
        .map(e => ({ source: String(e.source), target: String(e.target) }));

      return {
        nodes: [...dataNodes, ...wikiNodes, ...subjectNodes],
        links: filteredEdges,
      };
    } catch (err) {
      console.error('Error calculating graph data:', err);
      return { nodes: [], links: [] };
    }
    // selectionKey가 targetId/completedSourceIds 의존성을 showOnlySelected=true일 때만 반영함
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGrades, showOnlySelected, selectionKey]);

  // 화면 크기 업데이트 및 초기 줌 설정
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 데이터 변경 시 그래프 중심 맞춤 및 엔진 설정
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;

    // 노드 수 + 데이터 노드 비중을 함께 고려해 force 파라미터를 분기한다.
    // 키워드는 크게, 데이터 노드는 작게 그리므로 충돌 반경도 노드 타입별로 다르게 둔다.
    const nodeCount = graphData.nodes.length;
    const isSparse = nodeCount <= 20;

    const chargeStrength = isSparse ? -350 : -110;
    const linkDistance = isSparse ? 70 : 38;
    const centerStrength = isSparse ? 0.2 : 0.4;

    fg.d3Force('charge').strength(chargeStrength);
    fg.d3Force('link').distance(linkDistance).strength(0.6);
    fg.d3Force('center').strength(centerStrength);
    fg.d3Force(
      'collide',
      forceCollide(node => (node.nodeType === 'dataNode' ? 10 : 20)).strength(0.85)
    );

    // reheat — 새 파라미터를 즉시 반영하기 위해 시뮬레이션 재가열
    fg.d3ReheatSimulation();

    const t = setTimeout(() => {
      fgRef.current?.zoomToFit(400, 80);
    }, 200);
    return () => clearTimeout(t);
  }, [graphData]);

  return (
    <div className="app-container">
      {showSaveModal && (
        <div
          onClick={() => setShowSaveModal(false)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#fff', padding: '1.75rem', borderRadius: '16px',
              width: '420px', maxWidth: '90vw',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.2)',
            }}
          >
            <h2 style={{fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--color-text)'}}>커리큘럼 저장</h2>
            <p style={{fontSize: '0.8rem', color: 'var(--color-text-sub)', marginBottom: '1.25rem'}}>
              목표 <b>{KEYWORD_LABEL_BY_ID.get(targetId)}</b>, 현재 완료 노드 {completedSourceIds.length}개의 스냅샷을 저장합니다.
            </p>
            <label style={{display: 'block', marginBottom: '0.85rem'}}>
              <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px'}}>이름</div>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="예: 알고리즘 수강 준비"
                autoFocus
                style={{
                  width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem',
                  border: '1.5px solid var(--color-line)', borderRadius: 'var(--radius-md)', outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </label>
            <label style={{display: 'block', marginBottom: '1.25rem'}}>
              <div style={{fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '4px'}}>메모 (선택)</div>
              <textarea
                value={saveMemo}
                onChange={(e) => setSaveMemo(e.target.value)}
                placeholder="이 경로에 대한 메모"
                rows={3}
                style={{
                  width: '100%', padding: '0.6rem 0.8rem', fontSize: '0.85rem',
                  border: '1.5px solid var(--color-line)', borderRadius: 'var(--radius-md)', outline: 'none',
                  resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
                }}
              />
            </label>
            <div style={{display: 'flex', gap: '8px', justifyContent: 'flex-end'}}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-line)', background: '#fff',
                  fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-sub)', cursor: 'pointer',
                }}
              >취소</button>
              <button
                onClick={saveCurriculum}
                disabled={!saveName.trim()}
                style={{
                  padding: '0.55rem 1.1rem', borderRadius: 'var(--radius-md)',
                  border: 'none', background: 'var(--color-main)', color: '#fff',
                  fontSize: '0.85rem', fontWeight: 700,
                  cursor: saveName.trim() ? 'pointer' : 'not-allowed',
                  opacity: saveName.trim() ? 1 : 0.5,
                }}
              >저장</button>
            </div>
          </div>
        </div>
      )}

      <aside className="sidebar">
        <img src={logoUrl} alt="알아가요" className="sidebar-logo" />

        {/* <div className="filter-section" style={{marginBottom: '2rem'}}>
          <h3 style={{fontSize: '0.85rem', fontWeight: '700', color: '#1e293b', marginBottom: '1rem'}}>학년별 필터</h3>
          <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
            {['1', '2', '3', '4'].map(grade => (
              <label key={grade} style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={selectedGrades.includes(grade)} 
                  onChange={() => toggleGrade(grade)}
                  disabled={showOnlySelected}
                />
                {grade}학년 과목
              </label>
            ))}
          </div>
        </div> */}

        {/* <div className="filter-section" style={{marginBottom: '2rem', padding: '1rem', background: '#eff6ff', borderRadius: '12px', border: '1px solid #bfdbfe'}}>
          <label style={{display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', cursor: 'pointer', fontWeight: '600', color: '#1d4ed8'}}>
            <input 
              type="checkbox" 
              checked={showOnlySelected} 
              onChange={(e) => setShowOnlySelected(e.target.checked)} 
            />
            선택한 과목만 보기
          </label>
        </div> */}
        
        <div className="filter-section" style={{flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column'}}>
          <h3 className="t-sub" style={{marginBottom: '0.75rem'}}>내 커리큘럼</h3>
          {curriculumStore.length === 0 ? (
            <div style={{
              padding: '0.85rem', background: 'var(--color-base)', borderRadius: 'var(--radius-md)',
              fontSize: '0.75rem', color: 'var(--color-text-sub)', border: '1px dashed var(--color-line)',
              lineHeight: 1.5,
            }}>
              저장된 커리큘럼이 없습니다. 목표 키워드 선택 + 완료 마킹된 노드가 있을 때 <b>"+ 커리큘럼 저장"</b>으로 보관할 수 있습니다.
            </div>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1}}>
              {curriculumStore.map(entry => {
                const tLabel = KEYWORD_LABEL_BY_ID.get(entry.target) ?? entry.target;
                const snapshotCount = Array.isArray(entry.completedSnapshot) ? entry.completedSnapshot.length : 0;
                return (
                  <div
                    key={entry.id}
                    style={{
                      padding: '0.65rem 0.75rem', background: '#fff',
                      border: '1px solid var(--color-line)', borderRadius: 'var(--radius-md)',
                      display: 'flex', flexDirection: 'column', gap: '4px',
                    }}
                  >
                    <div style={{display: 'flex', justifyContent: 'space-between', gap: '6px', alignItems: 'flex-start'}}>
                      <button
                        onClick={() => loadCurriculum(entry)}
                        style={{
                          background: 'transparent', border: 'none', padding: 0,
                          fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text)',
                          textAlign: 'left', cursor: 'pointer', flex: 1,
                        }}
                        title="클릭하여 이 커리큘럼 불러오기 (목표와 완료 스냅샷 복원)"
                      >{entry.name}</button>
                      <button
                        onClick={() => deleteCurriculum(entry.id)}
                        style={{
                          background: 'transparent', border: 'none', padding: 0,
                          color: 'var(--color-text-sub)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1,
                        }}
                        title="삭제"
                        aria-label="삭제"
                      >×</button>
                    </div>
                    <div style={{fontSize: '0.7rem', color: 'var(--color-text-sub)'}}>
                      🎯 {tLabel} · 완료 {snapshotCount}개
                    </div>
                    {entry.memo && (
                      <div style={{
                        fontSize: '0.7rem', color: 'var(--color-text-sub)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {entry.memo}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="search-controls">
            <span style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text-sub)'}}>목표</span>
            <input
              type="text"
              className="search-select"
              list="kw-list"
              value={inputTarget}
              onChange={(e) => setInputTarget(e.target.value)}
              placeholder="목표 키워드 검색..."
              style={{ minWidth: '220px' }}
            />
            <datalist id="kw-list">
              {MOCK_KEYWORDS.map(k => (
                <option key={k.id} value={k.label}>{k.source === 'subject' ? '과목' : '위키'}</option>
              ))}
            </datalist>
            <button className="btn-point" onClick={() => fgRef.current?.zoomToFit(400, 100)}>화면 맞춤</button>
            <button
              className="btn-primary"
              onClick={openSaveModal}
              disabled={!canSaveCurriculum}
              style={{
                opacity: canSaveCurriculum ? 1 : 0.4,
                cursor: canSaveCurriculum ? 'pointer' : 'not-allowed',
              }}
              title={
                canSaveCurriculum
                  ? '현재 목표와 완료 스냅샷을 내 커리큘럼에 저장'
                  : '목표 키워드와 완료 마킹된 노드, 경로가 모두 있어야 저장 가능합니다'
              }
            >
              + 커리큘럼 저장
            </button>
          </div>
          <div style={{fontSize: '0.7rem', color: 'var(--color-text-sub)'}}>CONREC v1.6</div>
        </header>

        <div className="content-body">
          <div className="tabs">
            <div className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>지식 지도</div>
            {/* <div className={`tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>📚 시스템 정보</div> */}
          </div>

          <div className="tab-panel" ref={containerRef} style={{ background: '#fff', position: 'relative' }}>
            {activeTab === 'map' && (showNoPath || noCompletedYet) && (
              <div style={{
                position: 'absolute',
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: noCompletedYet ? 'var(--color-main-soft)' : '#fef3c7',
                color: noCompletedYet ? 'var(--color-main-hover)' : '#92400e',
                padding: '0.75rem 1.5rem',
                borderRadius: 'var(--radius-lg)',
                border: `1px solid ${noCompletedYet ? 'var(--color-main)' : '#fcd34d'}`,
                fontSize: '0.85rem',
                fontWeight: '600',
                zIndex: 10,
                boxShadow: 'var(--shadow-card)',
                pointerEvents: 'none',
                maxWidth: '90%',
                textAlign: 'center',
              }}>
                {noCompletedYet
                  ? '키워드를 "학습 완료"로 마킹하면 그 노드에서 목표까지의 경로가 표시됩니다.'
                  : '학습 완료된 노드 중에서 이 목표로 가는 경로가 없습니다.'}
              </div>
            )}
            {activeTab === 'map' ? (
              <>
                <ForceGraph2D
                  ref={fgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  graphData={graphData}
                  nodeRelSize={6}
                  nodeVal={(node) => {
                    // 라이브러리가 화살표/충돌 보정 시 사용하는 노드 반경 값.
                    // 실제 렌더링 크기와 일치시켜야 화살표가 노드에 가려지지 않는다.
                    // (반경 = nodeRelSize * sqrt(nodeVal) → nodeVal = (size/nodeRelSize)^2)
                    if (node.nodeType === 'dataNode') return Math.pow(7 / 6, 2);
                    const isTarget = node.id === targetId;
                    if (isTarget) return Math.pow(24 / 6, 2);
                    const isSubject = node.source === 'subject';
                    const gat = typeof node.gatScore === 'number' ? node.gatScore : 0.5;
                    const sizeMul = 0.7 + 0.6 * gat;
                    const rendered = (isSubject ? 16 : 10) * sizeMul;
                    return Math.pow(rendered / 6, 2);
                  }}
                  linkWidth={(link) => {
                    const s = typeof link.source === 'object' ? link.source.id : link.source;
                    const t = typeof link.target === 'object' ? link.target.id : link.target;
                    if (!hasPath) return 1.5;
                    return pathData.edges.has(`${s}|${t}`) ? 2.6 : 0.7;
                  }}
                  linkColor={(link) => {
                    const s = typeof link.source === 'object' ? link.source.id : link.source;
                    const t = typeof link.target === 'object' ? link.target.id : link.target;
                    if (!hasPath) return 'rgba(148, 163, 184, 0.55)';
                    return pathData.edges.has(`${s}|${t}`)
                      ? 'rgba(239, 68, 68, 0.78)'
                      : 'rgba(203, 213, 225, 0.1)';
                  }}
                  linkDirectionalArrowLength={(link) => {
                    const s = typeof link.source === 'object' ? link.source.id : link.source;
                    const t = typeof link.target === 'object' ? link.target.id : link.target;
                    if (!hasPath) return 8;
                    return pathData.edges.has(`${s}|${t}`) ? 11 : 4;
                  }}
                  linkDirectionalArrowRelPos={1}
                  linkDirectionalArrowColor={(link) => {
                    const s = typeof link.source === 'object' ? link.source.id : link.source;
                    const t = typeof link.target === 'object' ? link.target.id : link.target;
                    if (!hasPath) return 'rgba(71, 85, 105, 0.9)';
                    return pathData.edges.has(`${s}|${t}`)
                      ? 'rgba(220, 38, 38, 1)'
                      : 'rgba(100, 116, 139, 0.2)';
                  }}
                  linkCurvature={0.1}
                  cooldownTicks={400}
                  d3VelocityDecay={0.35}
                  warmupTicks={60}
                  onNodeClick={(node) => {
                    if (node.nodeType === 'keyword') setPanelNodeId(node.id);
                  }}
                  onBackgroundClick={() => setPanelNodeId(null)}
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    if (!node.x || !node.y) return;

                    // 경로 강조: 경로 위 노드는 정상 표시, 그 외는 dim 처리.
                    const isOnPathKw = hasPath && pathData.keywords.has(node.id);
                    const isOnPathDn = hasPath && pathData.dataNodes.has(node.id);
                    const isTarget = node.id === targetId;
                    const isPanelOpen = node.id === panelNodeId;
                    const status = node.nodeType === 'keyword' ? nodeStatusMap[node.id] : null;
                    const shouldDim = hasPath && !isOnPathKw && !isOnPathDn && !isTarget;
                    // P2 §2.5: 경로 위 완료 키워드는 추가 약화 (목표 제외)
                    const completedOnPath =
                      hasPath && status === 'completed' && !isTarget && (isOnPathKw || isOnPathDn);
                    const prevAlpha = ctx.globalAlpha;
                    if (shouldDim) ctx.globalAlpha = 0.15;
                    else if (completedOnPath) ctx.globalAlpha = 0.4;

                    // ── 데이터 노드: 다이아몬드 ─────────────────────
                    if (node.nodeType === 'dataNode') {
                      const ds = 7;
                      ctx.beginPath();
                      ctx.moveTo(node.x, node.y - ds);
                      ctx.lineTo(node.x + ds, node.y);
                      ctx.lineTo(node.x, node.y + ds);
                      ctx.lineTo(node.x - ds, node.y);
                      ctx.closePath();
                      ctx.fillStyle = 'rgba(226, 232, 240, 0.95)';
                      ctx.fill();
                      ctx.strokeStyle = 'rgba(71, 85, 105, 0.75)';
                      ctx.lineWidth = 1.2 / globalScale;
                      ctx.stroke();

                      // 블로그 타이틀: 줌인 시에만
                      if (globalScale >= 1.5) {
                        const title = node.title || '';
                        if (title) {
                          const fontSize = 9 / globalScale;
                          ctx.font = `500 ${fontSize}px 'Pretendard', sans-serif`;
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'top';

                          const textWidth = ctx.measureText(title).width;
                          const pad = 1.5 / globalScale;

                          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                          ctx.fillRect(
                            node.x - textWidth/2 - pad,
                            node.y + ds + pad,
                            textWidth + pad * 2,
                            fontSize + pad
                          );

                          ctx.fillStyle = 'rgba(51, 65, 85, 0.95)';
                          ctx.fillText(title, node.x, node.y + ds + pad * 2);
                        }
                      }
                      ctx.globalAlpha = prevAlpha;
                      return;
                    }

                    // ── 키워드 노드: 원 + GAT 가중치 기반 크기 ─────
                    const isSubject = node.source === 'subject';
                    const gat = typeof node.gatScore === 'number' ? node.gatScore : 0.5;
                    // GAT 가중치 → 크기 배수 (0.7x ~ 1.3x). 목표는 고정 크기.
                    const sizeMul = 0.7 + 0.6 * gat;
                    const baseSize = isSubject ? 16 : 10;
                    const size = isTarget ? 24 : baseSize * sizeMul;
                    // 색상 우선순위: 목표(red) > 상태(green/orange/violet) > 기본(blue/gray)
                    let color;
                    if (isTarget) color = '#ef4444';
                    else if (status) color = STATUS_COLORS[status];
                    else color = isSubject ? '#2563eb' : '#94a3b8';

                    // 후광: 목표 키워드 또는 경로 위 고-GAT 키워드 (>= 0.8)
                    const showHalo = isTarget || (isOnPathKw && gat >= HIGH_GAT_THRESHOLD);
                    if (showHalo) {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, size + 6/globalScale, 0, 2 * Math.PI, false);
                      ctx.fillStyle = isTarget
                        ? 'rgba(239, 68, 68, 0.15)'
                        : 'rgba(37, 99, 235, 0.18)';
                      ctx.fill();
                    }

                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();

                    // 사이드 패널이 열린 노드는 청록 테두리로 표시
                    ctx.strokeStyle = isPanelOpen ? '#0ea5e9' : '#ffffff';
                    ctx.lineWidth = (isTarget ? 3 : isPanelOpen ? 2.5 : 1.5) / globalScale;
                    ctx.stroke();

                    // 학습 상태 아이콘 (마킹된 키워드에 한해)
                    if (status) {
                      ctx.fillStyle = '#ffffff';
                      ctx.font = `bold ${size * 0.95}px sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText(STATUS_ICONS[status], node.x, node.y);
                    }

                    const isZoomedEnough = globalScale >= 0.8;
                    if (isZoomedEnough || isTarget) {
                      const fontSize = (isTarget ? 18 : 14) / globalScale;
                      ctx.font = `${isTarget ? '800' : '600'} ${fontSize}px 'Pretendard', sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'top';

                      const labelText = node.label;
                      const textWidth = ctx.measureText(labelText).width;
                      const bckgPadding = 2 / globalScale;

                      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                      ctx.fillRect(
                        node.x - textWidth/2 - bckgPadding,
                        node.y + size + bckgPadding,
                        textWidth + bckgPadding * 2,
                        fontSize + bckgPadding
                      );

                      ctx.fillStyle = isTarget ? '#ef4444' : '#1e293b';
                      ctx.fillText(labelText, node.x, node.y + size + bckgPadding * 2);
                    }

                    ctx.globalAlpha = prevAlpha;
                  }}
                />
                <div className="zoom-control-overlay">
                  <label>화면 배율</label>
                  <select className="search-select" value={zoomLevel} onChange={handleZoomChange}>
                    <option value="0.5">50%</option>
                    <option value="0.8">80%</option>
                    <option value="1">100%</option>
                    <option value="1.2">120%</option>
                    <option value="1.5">150%</option>
                    <option value="2">200%</option>
                  </select>
                </div>

                {panelKeyword && (
                  <aside style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '320px',
                    height: '100%',
                    background: '#fff',
                    boxShadow: '-4px 0 16px rgba(15, 23, 42, 0.08)',
                    padding: '1.5rem',
                    overflowY: 'auto',
                    zIndex: 20,
                    borderLeft: '1px solid var(--color-line)',
                  }}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem'}}>
                      <div>
                        <div style={{fontSize: '0.7rem', color: 'var(--color-text-sub)', fontWeight: 600, marginBottom: '0.25rem'}}>
                          {panelKeyword.source === 'subject'
                            ? `${panelKeyword.grade}학년 과목 키워드`
                            : '위키 키워드'}
                        </div>
                        <h3 style={{fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-text)'}}>{panelKeyword.label}</h3>
                      </div>
                      <button
                        onClick={() => setPanelNodeId(null)}
                        style={{
                          background: 'transparent', border: 'none', cursor: 'pointer',
                          fontSize: '1.4rem', color: 'var(--color-text-sub)', lineHeight: 1,
                        }}
                        aria-label="닫기"
                      >×</button>
                    </div>

                    {panelKeyword.wikiUrl && (
                      <a
                        href={panelKeyword.wikiUrl}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          display: 'inline-block', fontSize: '0.8rem', color: 'var(--color-main)',
                          marginBottom: '1.5rem', textDecoration: 'underline',
                        }}
                      >
                        위키피디아 문서 보기 →
                      </a>
                    )}

                    <div style={{borderTop: '1px solid var(--color-line)', paddingTop: '1rem', marginTop: '0.5rem'}}>
                      <h4 style={{fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem'}}>학습 상태</h4>
                      <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                        {['completed', 'in-progress', 'planned'].map(s => {
                          const active = nodeStatusMap[panelKeyword.id] === s;
                          return (
                            <button
                              key={s}
                              onClick={() => setStatus(panelKeyword.id, s)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '0.6rem 0.85rem',
                                border: `1.5px solid ${active ? STATUS_COLORS[s] : 'var(--color-line)'}`,
                                background: active ? STATUS_COLORS[s] : '#fff',
                                color: active ? '#fff' : 'var(--color-text)',
                                borderRadius: 'var(--radius-md)',
                                fontWeight: active ? 700 : 500,
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                textAlign: 'left',
                              }}
                            >
                              <span style={{
                                display: 'inline-flex', width: '20px', height: '20px',
                                borderRadius: '50%',
                                background: active ? 'rgba(255,255,255,0.25)' : STATUS_COLORS[s],
                                color: '#fff', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 800, fontSize: '0.9rem',
                              }}>{STATUS_ICONS[s]}</span>
                              {STATUS_LABELS[s]}
                            </button>
                          );
                        })}
                        {nodeStatusMap[panelKeyword.id] && (
                          <button
                            onClick={() => setStatus(panelKeyword.id, null)}
                            style={{
                              padding: '0.5rem 0.85rem',
                              border: '1px dashed var(--color-line)',
                              background: '#fff', color: 'var(--color-text-sub)',
                              borderRadius: 'var(--radius-md)', fontSize: '0.8rem',
                              cursor: 'pointer',
                            }}
                          >상태 해제</button>
                        )}
                      </div>
                    </div>
                  </aside>
                )}
              </>
            ) : (
              <div style={{padding: '3rem', textAlign: 'center', color: '#1e293b'}}>
                <div style={{fontSize: '3rem', marginBottom: '1.5rem'}}>ℹ️</div>
                <h2 style={{fontWeight: '800', marginBottom: '1rem'}}>CONREC System</h2>
                <p style={{color: '#64748b', lineHeight: '1.6', maxWidth: '500px', margin: '0 auto'}}>
                  동아대학교 컴퓨터공학과 전공 로드맵 분석 시스템입니다.
                </p>
                <div style={{marginTop: '3rem', display: 'flex', justifyContent: 'center', gap: '2rem'}}>
                  <div style={{padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', width: '180px'}}>
                    <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>📚</div>
                    <div style={{fontSize: '1.2rem', fontWeight: '800'}}>8개 과목</div>
                  </div>
                  <div style={{padding: '1.5rem', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', width: '180px'}}>
                    <div style={{fontSize: '1.5rem', marginBottom: '0.5rem'}}>🔗</div>
                    <div style={{fontSize: '1.2rem', fontWeight: '800'}}>12개 개념</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
