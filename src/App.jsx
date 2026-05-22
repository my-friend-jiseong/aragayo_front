import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import { MOCK_CONCEPTS, MOCK_LINKS } from './mockData';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [subjectA, setSubjectA] = useState('c-programming');
  const [subjectB, setSubjectB] = useState('ai');
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const containerRef = useRef(null);
  const fgRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // 줌 변경 핸들러
  const handleZoomChange = (e) => {
    const level = parseFloat(e.target.value);
    setZoomLevel(level);
    if (fgRef.current) {
      fgRef.current.zoom(level, 400);
    }
  };

  // 화면 크기 업데이트
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

  // 과목 선택 옵션
  const subjectOptions = useMemo(() => 
    MOCK_CONCEPTS.filter(c => c.group === 'subject'), 
  []);

  // 그래프 데이터 (불변 데이터 구조로 유지하여 충돌 방지)
  const graphData = useMemo(() => ({
    nodes: MOCK_CONCEPTS.map(c => ({ ...c, id: String(c.id) })),
    links: MOCK_LINKS.map(l => ({ source: String(l.source), target: String(l.target) }))
  }), []);

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem'}}>
          <div style={{width: '40px', height: '40px', borderRadius: '10px', background: '#2563eb', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '1.2rem'}}>D</div>
          <div>
            <h1 style={{fontSize: '1.1rem', fontWeight: '800'}}>동아대학교</h1>
            <p style={{fontSize: '0.7rem', color: '#64748b'}}>커리큘럼 헬퍼</p>
          </div>
        </div>
        
        <div style={{marginTop: 'auto', padding: '1rem', background: '#f8fafc', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid #e2e8f0', color: '#64748b'}}>
          과목을 선택하면 지식 지도가 실시간으로 강조됩니다.
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="search-controls">
            <select className="search-select" value={subjectA} onChange={(e) => setSubjectA(e.target.value)}>
              {subjectOptions.map(opt => <option key={`a-${opt.id}`} value={opt.id}>{opt.label}</option>)}
            </select>
            <span>→</span>
            <select className="search-select" value={subjectB} onChange={(e) => setSubjectB(e.target.value)}>
              {subjectOptions.map(opt => <option key={`b-${opt.id}`} value={opt.id}>{opt.label}</option>)}
            </select>
            <button className="btn-primary" onClick={() => fgRef.current?.zoomToFit(400, 100)}>화면 맞춤</button>
          </div>
          <div style={{fontSize: '0.7rem', color: '#94a3b8'}}>CONREC v1.6</div>
        </header>

        <div className="content-body">
          <div className="tabs">
            <div className={`tab ${activeTab === 'map' ? 'active' : ''}`} onClick={() => setActiveTab('map')}>📊 지식 지도</div>
            <div className={`tab ${activeTab === 'videos' ? 'active' : ''}`} onClick={() => setActiveTab('videos')}>📚 시스템 정보</div>
          </div>

          <div className="tab-panel" ref={containerRef} style={{ background: '#fff' }}>
            {activeTab === 'map' ? (
              <>
                <ForceGraph2D
                  ref={fgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  graphData={graphData}
                  nodeRelSize={1}
                  linkWidth={2}
                  linkColor={() => 'rgba(203, 213, 225, 0.6)'}
                  linkDirectionalArrowLength={7}
                  linkDirectionalArrowRelPos={1}
                  linkCurvature={0.25}
                  cooldownTicks={150} // 시뮬레이션 시간 충분히 확보
                  onEngineStop={() => {
                    const fg = fgRef.current;
                    if (fg) {
                      // 간격 대폭 확장 및 반발력 강화
                      fg.d3Force('charge').strength(-2500);
                      fg.d3Force('link').distance(400);
                    }
                  }}
                  nodeCanvasObject={(node, ctx, globalScale) => {
                    if (!node.x || !node.y) return;
                    
                    const isSelected = node.id === subjectA || node.id === subjectB;
                    const isSubject = node.group === 'subject';
                    const size = isSelected ? 18 : (isSubject ? 14 : 5);
                    const color = isSelected ? '#ef4444' : (isSubject ? '#2563eb' : '#94a3b8');

                    // 1. 선택 강조 후광
                    if (isSelected) {
                      ctx.beginPath();
                      ctx.arc(node.x, node.y, size + 5/globalScale, 0, 2 * Math.PI, false);
                      ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                      ctx.fill();
                    }

                    // 2. 노드 본체
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
                    ctx.fillStyle = color;
                    ctx.fill();
                    
                    // 3. 테두리
                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = (isSelected ? 3 : 1.5) / globalScale;
                    ctx.stroke();

                    // 4. 텍스트 라벨 (LOD 적용)
                    const isZoomedEnough = globalScale >= 2.0;
                    if (isZoomedEnough || isSelected) {
                      const fontSize = (isSelected ? 16 : 13) / globalScale;
                      ctx.font = `${isSelected ? '900' : 'bold'} ${fontSize}px 'Pretendard', sans-serif`;
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'top';
                      
                      const textWidth = ctx.measureText(node.label).width;
                      const bckgPadding = 2 / globalScale;
                      
                      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                      ctx.fillRect(node.x - textWidth/2 - bckgPadding, node.y + size + bckgPadding, textWidth + bckgPadding * 2, fontSize + bckgPadding);

                      ctx.fillStyle = isSelected ? '#ef4444' : '#1e293b';
                      ctx.fillText(node.label, node.x, node.y + size + bckgPadding * 2);
                    }
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
