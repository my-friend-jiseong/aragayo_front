// 키워드 사이의 경로 탐색.
// docs/FEATURE_PATH_VISUALIZATION.md §2.3~2.4 규약:
//   - 무방향 처리 (방향성 의미 없음)
//   - 학습 완료 시작점들 → 목표 경로 중 점수 기준 Top-K만 강조 (추천)
//   - 경로는 키워드만 강조, 데이터 노드는 흐리게
//
// 그래프는 이분 그래프(키워드 ↔ 데이터 노드). 한 "키워드 hop"은
// K → D → K 의 두 간선을 거치는 단위로 본다.

const PATH_LIMIT = 100;   // 탐색 안전 한도
const DEFAULT_MAX_HOPS = 4; // 최대 키워드 hop 수

function buildBipartiteAdjacency(edges) {
  const kwToData = new Map();
  const dataToKw = new Map();
  for (const e of edges) {
    if (!kwToData.has(e.target)) kwToData.set(e.target, new Set());
    kwToData.get(e.target).add(e.source);
    if (!dataToKw.has(e.source)) dataToKw.set(e.source, new Set());
    dataToKw.get(e.source).add(e.target);
  }
  return { kwToData, dataToKw };
}

/**
 * 두 키워드(start, end) 사이의 모든 단순 경로를 반환.
 * 각 경로는 [K, D, K, D, ..., K] 형태로 노드 ID가 번갈아 나온다.
 * @param {string} start - 시작 키워드 id
 * @param {string} end - 종점 키워드 id
 * @param {Array<{source: string, target: string}>} edges - DataNode → Keyword 간선
 * @param {number} maxHops - 최대 키워드 hop 수 (기본 3)
 * @returns {Array<Array<string>>} 경로 목록
 */
export function findKeywordPaths(start, end, edges, maxHops = DEFAULT_MAX_HOPS) {
  if (!start || !end || start === end) return [];

  const { kwToData, dataToKw } = buildBipartiteAdjacency(edges);
  if (!kwToData.has(start) || !kwToData.has(end)) return [];

  const paths = [];
  const visited = new Set([start]);
  const currentPath = [start];

  function dfs(current, hops) {
    if (paths.length >= PATH_LIMIT) return;
    if (current === end && currentPath.length > 1) {
      paths.push([...currentPath]);
      return;
    }
    if (hops >= maxHops) return;

    const dataNeighbors = kwToData.get(current);
    if (!dataNeighbors) return;

    for (const dn of dataNeighbors) {
      if (visited.has(dn)) continue;
      const kwNeighbors = dataToKw.get(dn);
      if (!kwNeighbors) continue;
      for (const nk of kwNeighbors) {
        if (visited.has(nk)) continue;
        visited.add(dn);
        visited.add(nk);
        currentPath.push(dn, nk);
        dfs(nk, hops + 1);
        currentPath.pop();
        currentPath.pop();
        visited.delete(dn);
        visited.delete(nk);
        if (paths.length >= PATH_LIMIT) return;
      }
    }
  }

  dfs(start, 0);
  return paths;
}

/**
 * 경로 목록에서 강조 대상 노드/간선 집합을 추출한다.
 * @param {Array<Array<string>>} paths
 * @returns {{ keywords: Set<string>, dataNodes: Set<string>, edges: Set<string> }}
 *          edges는 'dataId|keywordId' 형식의 키 집합.
 */
export function pathHighlightSets(paths) {
  const keywords = new Set();
  const dataNodes = new Set();
  const edges = new Set();

  for (const path of paths) {
    for (let i = 0; i < path.length; i++) {
      if (i % 2 === 0) keywords.add(path[i]);
      else dataNodes.add(path[i]);
    }
    // 인접 쌍 (i, i+1): 짝수→홀수면 K→D, 홀수→짝수면 D→K
    for (let i = 0; i < path.length - 1; i++) {
      const a = path[i];
      const b = path[i + 1];
      const isAEven = i % 2 === 0;
      const dn = isAEven ? b : a;
      const kw = isAEven ? a : b;
      edges.add(`${dn}|${kw}`);
    }
  }

  return { keywords, dataNodes, edges };
}

/**
 * 편의 함수: 두 키워드 사이의 경로와 강조 집합을 한 번에 산출.
 */
export function computePathHighlight(start, end, edges, maxHops = DEFAULT_MAX_HOPS) {
  const paths = findKeywordPaths(start, end, edges, maxHops);
  const sets = pathHighlightSets(paths);
  return { paths, ...sets };
}

/**
 * 다중 시작점 → 단일 목표 경로 강조.
 * 학습 완료된 모든 키워드 각각에서 목표까지의 경로를 모은 뒤,
 * options.topK / options.scoreFn이 주어지면 점수 내림차순(동률시 짧은 경로 우선)으로
 * 상위 K개만 강조한다. 주어지지 않으면 모은 경로 전부.
 *
 * @param {Iterable<string>} sources - 시작 키워드 id들 (학습 완료 노드)
 * @param {string} target - 목표 키워드 id
 * @param {Array<{source: string, target: string}>} edges
 * @param {number} maxHops
 * @param {{ topK?: number, scoreFn?: (path: string[]) => number }} [options]
 * @returns {{ paths: string[][], keywords: Set<string>, dataNodes: Set<string>, edges: Set<string> }}
 */
export function computeMultiSourcePathHighlight(
  sources,
  target,
  edges,
  maxHops = DEFAULT_MAX_HOPS,
  options = {}
) {
  const empty = { paths: [], keywords: new Set(), dataNodes: new Set(), edges: new Set() };
  if (!target) return empty;

  const sourceArr = [...sources].filter(s => s && s !== target);
  if (sourceArr.length === 0) return empty;

  // 시작점 각각에서 목표까지의 경로를 모은다. 합산 안전 한도는 PATH_LIMIT * 2.
  const allPaths = [];
  const aggregateLimit = PATH_LIMIT * 2;
  for (const src of sourceArr) {
    const paths = findKeywordPaths(src, target, edges, maxHops);
    for (const p of paths) {
      allPaths.push(p);
      if (allPaths.length >= aggregateLimit) break;
    }
    if (allPaths.length >= aggregateLimit) break;
  }

  // Top-K 필터: 점수 내림차순, 동률시 짧은 경로 우선
  let selected = allPaths;
  const { topK, scoreFn } = options;
  if (typeof topK === 'number' && topK > 0 && typeof scoreFn === 'function') {
    const scored = allPaths.map(p => ({ path: p, score: scoreFn(p) }));
    scored.sort((a, b) => b.score - a.score || a.path.length - b.path.length);
    selected = scored.slice(0, topK).map(s => s.path);
  }

  const sets = pathHighlightSets(selected);
  return { paths: selected, ...sets };
}
