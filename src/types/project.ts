export interface ArchNode {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Database' | 'AI' | 'Authentication' | 'API Gateway' | 'Cache' | 'Storage' | 'Deployment' | 'Monitoring' | 'Optimization';
  purpose: string;
  tech: string;
  reason: string;
  tradeoffs: string;
  performance: string;
  security: string;
  scale: string;
}

export interface ProjectFile {
  name: string;
  path: string;
  language: string;
  purpose: string;
  logic: string;
  tradeoffs: string;
  code: string;
}

export interface ProjectData {
  id: string; // matches slug
  slug: string;
  title: string;
  displayPriority?: number;
  description: string;
  shortDescription: string;
  status: 'Production' | 'Completed' | 'Beta' | 'Alpha' | 'Active';
  tech: string[]; // same as technologies
  technologies: string[];
  categories: string[];
  category: string; // main category
  tags: string[];
  github: string;
  demo?: string;
  deployment?: string;
  screenshots?: string[];
  coverImage?: string;
  
  // Architecture and System diagram data
  architecture: ArchNode[];
  
  // Tech specifications
  database?: string;
  authentication?: string;
  apis?: string[];
  aiFeatures?: string[];
  deploymentStack?: string[];
  
  // Performance and Stats
  metrics: {
    value: number;
    label: string;
    throughput?: string;
    latency?: string;
    errorRate?: string;
    requestFlow?: {
      from: string;
      to: string;
      label: string;
      type: 'request' | 'response' | 'auth' | 'db' | 'ai' | 'deploy';
    }[];
  };
  
  // Timeline and Role
  timeline: {
    start: string;
    end: string;
    duration: string;
    milestones: string[];
  };
  role: string;
  duration: string;
  
  // STAR Method / Documentation content
  challenges: string; // Situation/Task/Challenge
  solutions: string; // Action/Solution
  lessons: string; // Results/Lessons
  futureWork: string;
  readmeSummary: string;
  aiSummary: string;
  
  // Mock files for Code Explorer
  files: ProjectFile[];
}
