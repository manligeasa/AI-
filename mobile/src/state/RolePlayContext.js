import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { loadData, saveData } from '../storage/localStore';
import data from '../data/roleplay/scenarios.json';

/**
 * 상황극 게임 상태. 서버 없이 Context API + useReducer로 앱 안에서만 관리한다.
 * - 진행 중인 상태(몇 번째 문제, 고른 답, 점수)는 메모리에만 둔다.
 * - 최고 점수만 휴대폰 안 JSON 파일에 남긴다.
 */
const RolePlayContext = createContext(null);

const SCENARIOS = data.scenarios;

const initialState = {
  index: 0, // 지금 보고 있는 상황 번호
  selected: null, // 고른 선택지 번호 (아직 안 골랐으면 null)
  score: 0, // 맞힌 개수
  finished: false,
  bestScore: 0,
};

function reducer(state, action) {
  switch (action.type) {
    case 'select': {
      if (state.selected !== null) return state; // 한 문제에 한 번만 고를 수 있다
      const correct = SCENARIOS[state.index].choices[action.choice].correct;
      return { ...state, selected: action.choice, score: state.score + (correct ? 1 : 0) };
    }
    case 'next': {
      if (state.index === SCENARIOS.length - 1) {
        return { ...state, finished: true, bestScore: Math.max(state.bestScore, state.score) };
      }
      return { ...state, index: state.index + 1, selected: null };
    }
    case 'restart':
      return { ...initialState, bestScore: state.bestScore };
    case 'loadBest':
      return { ...state, bestScore: action.bestScore };
    default:
      return state;
  }
}

export function RolePlayProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 처음 열 때 저장된 최고 점수를 불러온다
  useEffect(() => {
    loadData().then((d) => dispatch({ type: 'loadBest', bestScore: d.rolePlay?.bestScore ?? 0 }));
  }, []);

  // 게임이 끝나면 최고 점수를 JSON 파일에 저장한다
  useEffect(() => {
    if (!state.finished) return;
    loadData()
      .then((d) => {
        if (state.bestScore > (d.rolePlay?.bestScore ?? 0)) {
          return saveData({ ...d, rolePlay: { ...d.rolePlay, bestScore: state.bestScore } });
        }
      })
      .catch(() => {});
  }, [state.finished, state.bestScore]);

  const select = useCallback((choice) => dispatch({ type: 'select', choice }), []);
  const next = useCallback(() => dispatch({ type: 'next' }), []);
  const restart = useCallback(() => dispatch({ type: 'restart' }), []);

  const value = useMemo(() => {
    const scenario = SCENARIOS[state.index];
    return {
      ...state,
      title: data.title,
      total: SCENARIOS.length,
      scenario,
      answered: state.selected !== null,
      isCorrect: state.selected !== null && scenario.choices[state.selected].correct,
      select,
      next,
      restart,
    };
  }, [state, select, next, restart]);

  return <RolePlayContext.Provider value={value}>{children}</RolePlayContext.Provider>;
}

/** 상황극 상태를 꺼내 쓰는 훅. RolePlayProvider 안에서만 쓸 수 있다. */
export function useRolePlay() {
  const ctx = useContext(RolePlayContext);
  if (!ctx) throw new Error('useRolePlay는 RolePlayProvider 안에서 써야 해요.');
  return ctx;
}
