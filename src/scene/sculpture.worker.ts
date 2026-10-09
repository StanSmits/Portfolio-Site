/// <reference lib="webworker" />
import { buildGrainData, buildSculptureData } from './shapes';

export interface SculptureRequest {
  segments: number;
  rings: number;
  grainSize: number;
}

self.onmessage = (event: MessageEvent<SculptureRequest>) => {
  const { segments, rings, grainSize } = event.data;
  const data = buildSculptureData(segments, rings);
  const grain = grainSize > 0 ? buildGrainData(grainSize) : null;
  const transfer: Transferable[] = [data.index.buffer, data.uv.buffer];
  for (const array of [...data.positions, ...data.normals]) transfer.push(array.buffer);
  if (grain) transfer.push(grain.buffer);
  (self as unknown as DedicatedWorkerGlobalScope).postMessage({ data, grain }, transfer);
};
