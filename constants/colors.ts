import { WineType } from '../types';

export const Colors = {
  primary: '#722F37',
  primaryDark: '#4A1C23',
  primaryLight: '#A0535C',
  gold: '#C9A96E',
  goldDark: '#A07840',
  cream: '#FAF7F2',
  parchment: '#F5F0E8',
  text: '#2C1810',
  textSecondary: '#6B4C3B',
  textMuted: '#9E7B6D',
  border: '#DDD0C4',
  white: '#FFFFFF',
  shadow: 'rgba(44, 24, 16, 0.12)',

  redWine: '#722F37',
  whiteWine: '#A07840',
  sparklingWine: '#2980B9',
  roseWine: '#C0607A',

  regionMarker: '#7B2D8B',
  wineryMarker: '#B8860B',
  userWineMarker: '#722F37',
};

export const wineTypeColor: Record<WineType, string> = {
  red: Colors.redWine,
  white: Colors.whiteWine,
  sparkling: Colors.sparklingWine,
  rose: Colors.roseWine,
};
