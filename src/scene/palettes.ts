import type { Theme } from '../theme/theme';

/** Scene colours and light levels per theme. Hex values mirror the CSS tokens in index.css. */
export interface ScenePalette {
  background: string;
  stone: string;
  structured: string;
  roughness: number;
  panel: string;
  grid: string;
  gridOpacity: number;
  shadow: string;
  shadowOpacity: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  key: string;
  keyIntensity: number;
  rim: string;
  rimIntensity: number;
  envIntensity: number;
  fogNear: number;
  fogFar: number;
}

export const PALETTES: Record<Theme, ScenePalette> = {
  light: {
    background: '#F4F0E8',
    stone: '#B9AB96',
    structured: '#D9D0C2',
    roughness: 0.7,
    panel: '#C6BDAF',
    grid: '#3A342B',
    gridOpacity: 0.1,
    shadow: '#3B3022',
    shadowOpacity: 0.3,
    hemiSky: '#FFF7EC',
    hemiGround: '#9C907E',
    hemiIntensity: 1.05,
    key: '#FFEAD0',
    keyIntensity: 1.7,
    rim: '#FFFFFF',
    rimIntensity: 0.9,
    envIntensity: 0.32,
    fogNear: 6,
    fogFar: 19,
  },
  dark: {
    background: '#141412',
    stone: '#78726A',
    structured: '#A29B90',
    roughness: 0.5,
    panel: '#24231F',
    grid: '#F4F0E8',
    gridOpacity: 0.07,
    shadow: '#000000',
    shadowOpacity: 0.55,
    hemiSky: '#3E3934',
    hemiGround: '#0B0B0A',
    hemiIntensity: 0.4,
    key: '#FFDDBA',
    keyIntensity: 1.45,
    rim: '#F2D2AE',
    rimIntensity: 3.6,
    envIntensity: 0.14,
    fogNear: 6,
    fogFar: 18,
  },
};
