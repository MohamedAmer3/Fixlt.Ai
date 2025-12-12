import React from 'react';

export interface FixItResponse {
  technicalAnalysis: string;
  openScadCode: string;
  threeJsCode: string;
}

export enum AppState {
  IDLE = 'IDLE',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface PanelProps {
  className?: string;
  children: React.ReactNode;
  title: string;
}