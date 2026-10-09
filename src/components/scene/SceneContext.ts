import { createContext, useContext } from 'react';

/** pending: 3D is loading · ready: canvas is rendering · fallback: static CSS visual. */
export type SceneStatus = 'pending' | 'ready' | 'fallback';

export const SceneStatusContext = createContext<SceneStatus>('pending');

export function useSceneStatus(): SceneStatus {
  return useContext(SceneStatusContext);
}
