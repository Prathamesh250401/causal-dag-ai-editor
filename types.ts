
export interface Node {
  name: string;
  type: 'Spend' | 'Baseline' | 'KPI' | 'Contextual' | string;
  metadata: string; // JSON string
}

export interface Edge {
  sourceNode: Node;
  targetNode: Node;
  weight: number;
  type: 'Potential (Direct)' | 'Forbidden' | string;
}

export interface DagData {
  generationStatus: string;
  nodes: Node[];
  edges: Edge[];
}

export interface DagResponse {
  data: DagData;
  success: boolean;
  errors: any[];
}

export interface ChatMessage {
    id: number;
    sender: 'user' | 'ai' | 'system';
    text: string;
    prompt?: string;
}