import { PROJECTS } from '../data/projects';
import type { ProjectData } from '../types/project';

// Document Chunk interface
export interface DocChunk {
  id: string;
  projectId?: string;
  title: string;
  category: 'projects' | 'experience' | 'education' | 'certifications' | 'skills' | 'architecture';
  content: string;
  tags: string[];
  tech: string[];
}

// Static biographical and architecture texts
const STATIC_DOCS: Omit<DocChunk, 'id'>[] = [
  {
    title: 'Professional Experience & Milestones',
    category: 'experience',
    tags: ['experience', 'work', 'job', 'milestones', 'agile', 'sprints'],
    tech: ['React', 'TypeScript', 'Python', 'Docker', 'SQL', 'MongoDB'],
    content: `Sanjaikumar Kaleeswaran completed a B.Sc. in Software Systems (Integrated 5-Year Track) at Kongu Engineering College (2021-2025) with a CGPA of 8.05/10.
Key achievements:
- Developed and optimized enterprise React and Python web apps.
- Worked in Agile sprints, leading standups, participating in code reviews, and designing unit testing.
- Optimized database queries (MySQL and MongoDB), reducing retrieval times by 30%.
- Implemented bundle splitting and lazy-loading in Vite, saving 110KB on initial loads.`
  },
  {
    title: 'Academic Education & Standing',
    category: 'education',
    tags: ['education', 'college', 'kongu', 'bsc', 'systems', 'grades', 'gpa'],
    tech: ['Data Structures', 'DBMS', 'Operating Systems', 'Software Engineering', 'Networks'],
    content: `Degree: Bachelor of Science in Software Systems.
Institution: Kongu Engineering College, Erode, Tamil Nadu, India.
Duration: 2021 - 2025.
GPA: 8.05 / 10 (First Class Honors).
Learned foundations: Data Structures, Database Management Systems (DBMS), Operating Systems, Software Engineering, Networks, and Cloud Infrastructure.`
  },
  {
    title: 'Professional Certifications & Credentials',
    category: 'certifications',
    tags: ['certifications', 'aws', 'cloud', 'linux', 'networking', 'badges'],
    tech: ['AWS', 'Linux', 'TCP/IP', 'DNS'],
    content: `Credentials:
- AWS Cloud Practitioner Essentials (Study modules completed, preparing for exam).
- Linux Fundamentals (Udemy) - Command shell scripting, permissions, process management, and file systems.
- Computer Networking Basics (Udemy) - TCP/IP protocols, subnet routing tables, and DNS setups.`
  },
  {
    title: 'Technical Capability Stack Summary',
    category: 'skills',
    tags: ['skills', 'languages', 'react', 'typescript', 'python', 'fastapi', 'django', 'docker', 'mongodb', 'sql'],
    tech: ['React', 'TypeScript', 'Python', 'SQL', 'MongoDB', 'Docker', 'FastAPI', 'Django', 'Three.js'],
    content: `Technical Capabilities:
- Languages: JavaScript, TypeScript, Python, SQL.
- Frontend: React.js, TailwindCSS, HTML5, CSS3, Framer Motion, Three.js / WebGL.
- Backend: Python (FastAPI, Django), REST API design and integration.
- Databases: MongoDB (NoSQL), MySQL (Relational).
- DevOps: Docker, Docker Compose, Git, Linux admin, AWS practitioner concepts.`
  },
  {
    title: 'Local RAG Pipeline System Design',
    category: 'architecture',
    tags: ['rag', 'search', 'similarity', 'pipeline', 'embedding', 'jaccard', 'vector', 'hallucination', 'cosine'],
    tech: ['TypeScript', 'Vite', 'React'],
    content: `This portfolio runs a local client-side RAG (Retrieval-Augmented Generation) pipeline.
Workflow:
1. User enters query in the Neural Copilot.
2. Query is stripped of stop words and split into term tokens.
3. The AI Engine runs a real TF-IDF Vectorizer and calculates Cosine Similarity scores against all chunk vectors.
4. Top matching chunks are injected as prompt contexts.
5. The Answer Generator compiles the text. If the highest cosine score is below 0.12, the safeguard blocks hallucinations by warning the user of outside boundaries.`
  },
  {
    title: 'Portfolio Operating System Architecture',
    category: 'architecture',
    tags: ['architecture', 'design', 'state', 'theme', 'audio', 'threejs', 'canvas', 'hologram'],
    tech: ['React', 'Vite', 'TailwindCSS', 'Three.js', 'Framer Motion'],
    content: `Architecture details:
- Framework: React 19 + Vite (Single Page Application).
- Global State: OSContext managing global audio synthesizer cues, active workspace windows, themes, and notifications.
- 3D Visualizer: Three.js point-cloud digital twin canvas thread.
- Sound System: Web Audio API synthesizer generating custom frequencies, click oscillators, and stereo panning.`
  }
];

// Generate Doc Chunks from projects list
export const generateChunks = (): DocChunk[] => {
  const chunks: DocChunk[] = [];
  
  // Add static documents first
  STATIC_DOCS.forEach((d, i) => {
    chunks.push({
      id: `static-${d.category}-${i}`,
      ...d
    });
  });
  
  // Chunk projects dynamically
  PROJECTS.forEach((p) => {
    // Chunk 1: Overview
    chunks.push({
      id: `proj-${p.id}-overview`,
      projectId: p.id,
      title: `${p.title} - Overview`,
      category: 'projects',
      tags: [...p.tags, 'overview', 'description'],
      tech: p.tech,
      content: `Project Name: ${p.title}\nRole: ${p.role}\nDuration: ${p.duration}\nStatus: ${p.status}\nDescription: ${p.description}\nShort Description: ${p.shortDescription}\nMain Tech Stack: ${p.tech.join(', ')}\nDatabase: ${p.database || 'None'}\nAuthentication: ${p.authentication || 'None'}\nDeployment: ${p.deployment || 'None'}\nReadme Summary: ${p.readmeSummary || ''}\nAI Summary: ${p.aiSummary || ''}`
    });
    
    // Chunk 2: STAR specs (challenges & solutions)
    chunks.push({
      id: `proj-${p.id}-specs`,
      projectId: p.id,
      title: `${p.title} - Engineering Challenge & Solution`,
      category: 'projects',
      tags: [...p.tags, 'star', 'challenge', 'solution', 'lessons', 'outcome'],
      tech: p.tech,
      content: `Project: ${p.title}\nTechnical Challenge (STAR): ${p.challenges || ''}\nImplemented Solution (STAR): ${p.solutions || ''}\nLessons & Outcomes (STAR): ${p.lessons || ''}\nFuture Improvements: ${p.futureWork || ''}`
    });

    // Chunk 3: Architecture & System components
    if (p.architecture && Array.isArray(p.architecture)) {
      p.architecture.forEach((node) => {
        chunks.push({
          id: `proj-${p.id}-arch-${node.id}`,
          projectId: p.id,
          title: `${p.title} - Architecture Component: ${node.name}`,
          category: 'architecture',
          tags: [...p.tags, 'architecture', node.role.toLowerCase(), node.name.toLowerCase()],
          tech: [node.tech, ...p.tech],
          content: `Project Component: ${node.name}\nRole: ${node.role} in project ${p.title}\nPurpose: ${node.purpose}\nTechnology: ${node.tech}\nWhy Chosen: ${node.reason}\nTrade-offs Considered: ${node.tradeoffs}\nPerformance Optimization: ${node.performance}\nSecurity Measures: ${node.security}\nScaling Strategy: ${node.scale}`
        });
      });
    }
  });

  return chunks;
};

// Stop words for vector tokenizer
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent', 'as', 'at', 
  'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'cant', 'cannot', 'could', 
  'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing', 'dont', 'down', 'during', 'each', 'few', 'for', 'from', 
  'further', 'had', 'hadnt', 'has', 'hasnt', 'have', 'havent', 'having', 'he', 'hed', 'hell', 'hes', 'her', 'here', 
  'heres', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'hows', 'i', 'id', 'ill', 'im', 'ive', 'if', 'in', 
  'into', 'is', 'isnt', 'it', 'its', 'itself', 'lets', 'me', 'more', 'most', 'mustnt', 'my', 'myself', 'no', 'nor', 
  'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 
  'same', 'shant', 'she', 'shed', 'shell', 'shes', 'should', 'shouldnt', 'so', 'some', 'such', 'than', 'that', 
  'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'theres', 'these', 'they', 'theyd', 
  'theyll', 'theyre', 'theyve', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 
  'wasnt', 'we', 'wed', 'well', 'were', 'weve', 'werent', 'what', 'whats', 'when', 'whens', 'where', 'wheres', 
  'which', 'while', 'who', 'whos', 'whom', 'why', 'whys', 'with', 'wont', 'would', 'wouldnt', 'you', 'youd', 
  'youll', 'youre', 'youve', 'your', 'yours', 'yourself', 'yourselves'
]);

// Helper to tokenize and clean text
export const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s\+\#\-]/g, ' ') // keep +, # for C++, C#, F#
    .split(/\s+/)
    .filter(word => word.length > 1 && !STOP_WORDS.has(word));
};

// Compute Term Frequencies (TF)
const getTF = (tokens: string[]): Record<string, number> => {
  const tf: Record<string, number> = {};
  if (tokens.length === 0) return tf;
  
  tokens.forEach((token) => {
    tf[token] = (tf[token] || 0) + 1;
  });
  
  for (const token in tf) {
    tf[token] = tf[token] / tokens.length;
  }
  
  return tf;
};

// Global index cache for vectors
let cachedChunks: DocChunk[] = [];
let cachedVocabulary: string[] = [];
let cachedIDF: Record<string, number> = {};
let cachedChunkVectors: { chunk: DocChunk; vector: Record<string, number>; magnitude: number }[] = [];

// Initialize vector store
export const initializeVectorStore = () => {
  if (cachedChunkVectors.length > 0) return;
  
  cachedChunks = generateChunks();
  const chunkTokensList = cachedChunks.map(c => tokenize(c.title + ' ' + c.content + ' ' + c.tags.join(' ') + ' ' + c.tech.join(' ')));
  
  const vocabSet = new Set<string>();
  chunkTokensList.forEach(tokens => tokens.forEach(t => vocabSet.add(t)));
  cachedVocabulary = Array.from(vocabSet);
  
  const df: Record<string, number> = {};
  cachedVocabulary.forEach(t => df[t] = 0);
  
  chunkTokensList.forEach((tokens) => {
    const uniqueTokensInDoc = new Set(tokens);
    uniqueTokensInDoc.forEach(t => {
      if (t in df) df[t]++;
    });
  });
  
  const N = cachedChunks.length;
  cachedVocabulary.forEach((t) => {
    cachedIDF[t] = Math.log((1 + N) / (1 + df[t])) + 1;
  });
  
  cachedChunkVectors = cachedChunks.map((chunk, idx) => {
    const tokens = chunkTokensList[idx];
    const tf = getTF(tokens);
    const vector: Record<string, number> = {};
    let sumSq = 0;
    
    for (const term in tf) {
      const tfidf = tf[term] * (cachedIDF[term] || 1);
      vector[term] = tfidf;
      sumSq += tfidf * tfidf;
    }
    
    return {
      chunk,
      vector,
      magnitude: Math.sqrt(sumSq)
    };
  });
};

export interface VectorSearchResult {
  chunk: DocChunk;
  score: number;
}

// Cosine Similarity search function
export const semanticSearch = (query: string): VectorSearchResult[] => {
  initializeVectorStore();
  
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];
  
  const queryTF = getTF(queryTokens);
  const queryVector: Record<string, number> = {};
  let querySumSq = 0;
  
  for (const term in queryTF) {
    if (cachedVocabulary.includes(term)) {
      const tfidf = queryTF[term] * (cachedIDF[term] || 1);
      queryVector[term] = tfidf;
      querySumSq += tfidf * tfidf;
    }
  }
  
  const queryMagnitude = Math.sqrt(querySumSq);
  if (queryMagnitude === 0) return [];
  
  const results: VectorSearchResult[] = cachedChunkVectors.map((cv) => {
    let dotProduct = 0;
    for (const term in queryVector) {
      if (term in cv.vector) {
        dotProduct += queryVector[term] * cv.vector[term];
      }
    }
    
    let score = 0;
    if (cv.magnitude > 0) {
      score = dotProduct / (queryMagnitude * cv.magnitude);
    }
    
    // Boost matching tags / technology metadata terms
    let metaBoost = 0;
    queryTokens.forEach((token) => {
      if (cv.chunk.tags.some(t => t.toLowerCase() === token) || cv.chunk.tech.some(t => t.toLowerCase() === token)) {
        metaBoost += 0.25;
      }
      if (cv.chunk.title.toLowerCase().includes(token)) {
        metaBoost += 0.15;
      }
    });
    
    score += metaBoost;
    
    return {
      chunk: cv.chunk,
      score
    };
  });
  
  return results
    .filter(r => r.score > 0.08)
    .sort((a, b) => b.score - a.score);
};

// Dynamic Q&A answer compiler
export const compileAnswer = (query: string): string => {
  const cleanQuery = query.toLowerCase().trim();
  initializeVectorStore();

  let answer = '';
  const sources = new Set<string>();
  const relatedProjects = new Set<string>();
  const suggestedQuestions = [
    'Explain MindWave AI Life OS',
    'Which projects use Docker?',
    'Show all AI projects',
    'Explain your RAG pipeline architecture'
  ];

  // 1. DYNAMIC ROUTING RULES

  // Comparison query logic: "compare X and Y"
  if (cleanQuery.includes('compare') || cleanQuery.includes('versus') || cleanQuery.includes(' vs ')) {
    const foundProjs: ProjectData[] = [];
    PROJECTS.forEach(p => {
      if (cleanQuery.includes(p.id) || cleanQuery.includes(p.slug) || cleanQuery.includes(p.title.toLowerCase().split(' ')[0])) {
        foundProjs.push(p);
      }
    });

    if (foundProjs.length >= 2) {
      const p1 = foundProjs[0];
      const p2 = foundProjs[1];
      answer = `### ⚖️ Technical Comparison: **${p1.title}** vs **${p2.title}**\n\n`;
      answer += `| Metric / Feature | **${p1.title}** | **${p2.title}** |\n`;
      answer += `| --- | --- | --- |\n`;
      answer += `| **Category** | ${p1.category} | ${p2.category} |\n`;
      answer += `| **Status** | ${p1.status} | ${p2.status} |\n`;
      answer += `| **Tech Stack** | ${p1.tech.slice(0, 4).join(', ')} | ${p2.tech.slice(0, 4).join(', ')} |\n`;
      answer += `| **Database** | ${p1.database || 'None'} | ${p2.database || 'None'} |\n`;
      answer += `| **Authentication** | ${p1.authentication || 'None'} | ${p2.authentication || 'None'} |\n`;
      answer += `| **Latency / Perf** | ${p1.metrics?.latency || 'N/A'} | ${p2.metrics?.latency || 'N/A'} |\n`;
      answer += `| **Throughput** | ${p1.metrics?.throughput || 'N/A'} | ${p2.metrics?.throughput || 'N/A'} |\n\n`;
      answer += `#### **Key Architecture Differences:**\n`;
      answer += `- **${p1.title}**: ${p1.shortDescription}\n`;
      answer += `- **${p2.title}**: ${p2.shortDescription}\n`;

      sources.add(`${p1.title} System Specs`);
      sources.add(`${p2.title} System Specs`);
      relatedProjects.add(p1.id);
      relatedProjects.add(p2.id);
    } else {
      answer = `To compare projects, please specify two valid project names. Supported projects: ${PROJECTS.map(p => p.title).join(', ')}.`;
    }
  }

  // Similar projects query: "similar to X"
  else if (cleanQuery.includes('similar to') || cleanQuery.includes('projects like')) {
    const targetProj = PROJECTS.find(p => cleanQuery.includes(p.id) || cleanQuery.includes(p.slug) || cleanQuery.includes(p.title.toLowerCase().split(' ')[0]));
    if (targetProj) {
      // Find similar projects
      const similar = PROJECTS.filter(p => p.id !== targetProj.id)
        .map(p => {
          const intersection = p.tech.filter(t => targetProj.tech.includes(t)).length;
          return { p, score: intersection };
        })
        .sort((a, b) => b.score - a.score);

      answer = `### 🔍 Projects similar to **${targetProj.title}**:\n\n`;
      similar.forEach(item => {
        answer += `- **${item.p.title}** (Shared Technologies: ${item.p.tech.filter(t => targetProj.tech.includes(t)).join(', ') || 'None'})\n  *AI Summary:* ${item.p.aiSummary}\n`;
        relatedProjects.add(item.p.id);
      });
      sources.add(`${targetProj.title} Tech Stack Index`);
    } else {
      answer = `Please specify which project you're asking about. Supported projects: ${PROJECTS.map(p => p.title).join(', ')}.`;
    }
  }

  // Show scalable projects
  else if (cleanQuery.includes('scalable') || cleanQuery.includes('scalability') || cleanQuery.includes('throughput')) {
    const scalable = PROJECTS.filter(p => {
      const value = p.metrics?.value || 0;
      return value > 90 || (p.metrics?.throughput && parseInt(p.metrics.throughput) > 250);
    });

    answer = `### ⚡ Scalable Architecture Index\n\nThe following projects incorporate scaling mechanisms (e.g. pagination, database indexing, horizontal scaling, asynchronous background loops):\n\n`;
    scalable.forEach(p => {
      answer += `- **${p.title}** (Throughput: **${p.metrics?.throughput || 'N/A'}**, Latency: **${p.metrics?.latency || 'N/A'}**)\n`;
      const deployNode = p.architecture?.find(a => a.role === 'Deployment' || a.role === 'Database');
      if (deployNode) {
        answer += `  *Scaling Method:* ${deployNode.purpose} utilizing ${deployNode.tech} (${deployNode.scale}).\n`;
      }
      relatedProjects.add(p.id);
    });
    sources.add('Project System Metrics Registry');
  }

  // Show Docker projects
  else if (cleanQuery.includes('docker') || cleanQuery.includes('container')) {
    const dockerProjs = PROJECTS.filter(p => 
      p.tech.some(t => t.toLowerCase() === 'docker') || 
      p.tags.some(t => t.toLowerCase() === 'docker') ||
      p.deploymentStack?.some(t => t.toLowerCase().includes('docker'))
    );
    answer = `### 🐳 Containerized (Docker) Projects\n\nThe following projects utilize **Docker & Docker Compose** for absolute environmental configuration parity and sandboxed microservice isolation:\n\n`;
    dockerProjs.forEach(p => {
      answer += `- **${p.title}**\n  *Docker Purpose:* ${p.architecture.find(a => a.name.toLowerCase().includes('docker'))?.purpose || 'Containerized deployment infrastructure.'}\n`;
      relatedProjects.add(p.id);
    });
    sources.add('Vite Dynamic Project Registry');
  }

  // Show AI projects / RAG
  else if (cleanQuery.includes('ai projects') || cleanQuery.includes('show ai') || cleanQuery.includes('rag') || cleanQuery.includes('vector')) {
    const aiProjs = PROJECTS.filter(p => 
      p.tech.some(t => ['sentence-transformers', 'ai', 'ml'].includes(t.toLowerCase())) ||
      (p.aiFeatures && p.aiFeatures.length > 0)
    );
    answer = `### 🤖 Artificial Intelligence & Semantic Memory Projects\n\nThese projects deploy AI/ML nodes, embedding pipelines, or local vector search engines:\n\n`;
    aiProjs.forEach(p => {
      answer += `- **${p.title}**\n  *AI Features:* ${p.aiFeatures?.join(', ') || 'Local text sentence embedding similarity search'}\n  *AI Summary:* ${p.aiSummary}\n`;
      relatedProjects.add(p.id);
    });
    sources.add('AI Knowledge Base Index');
    sources.add('Mindwave Engine documentation');
  }

  // Database questions
  else if (cleanQuery.includes('mongodb') || cleanQuery.includes('nosql')) {
    const mongoProjs = PROJECTS.filter(p => p.database?.toLowerCase().includes('mongodb'));
    answer = `### 🍃 MongoDB / NoSQL Databases\n\n`;
    if (mongoProjs.length > 0) {
      mongoProjs.forEach(p => {
        answer += `- **${p.title}**\n  *Database Config:* ${p.database}\n  *Reason for Selection:* ${p.architecture.find(a => a.role === 'Database')?.reason || 'Flexible data models'}\n`;
        relatedProjects.add(p.id);
      });
    } else {
      answer = `No active projects are currently using MongoDB in the registered database layer.`;
    }
    sources.add('Project Tech Stack Registry');
  }

  // Authentication questions
  else if (cleanQuery.includes('auth') || cleanQuery.includes('authentication') || cleanQuery.includes('jwt')) {
    const authProjs = PROJECTS.filter(p => p.authentication && p.authentication !== 'None');
    answer = `### 🔒 Security and Authentication Protocols\n\nHere are the projects carrying security/authentication guards:\n\n`;
    authProjs.forEach(p => {
      answer += `- **${p.title}**: Utilizes **${p.authentication}**\n  *Implementation:* ${p.architecture.find(a => a.name.toLowerCase().includes('logic') || a.role === 'Backend')?.security || 'Access token scopes'}\n`;
      relatedProjects.add(p.id);
    });
    sources.add('Project Security Headers Schema');
  }

  // Deployment questions
  else if (cleanQuery.includes('deployment') || cleanQuery.includes('deploy')) {
    answer = `### ☁️ Multi-Cloud & Deployment Strategies\n\nSanjaikumar uses various modern deployment strategies depending on the scale and dynamic needs of the projects:\n\n`;
    PROJECTS.forEach(p => {
      answer += `- **${p.title}**\n  *Environment:* ${p.deployment || 'Local Host'}\n  *Deployment Stack:* ${p.deploymentStack?.join(' + ') || 'N/A'}\n`;
      relatedProjects.add(p.id);
    });
    sources.add('Cloud Deployment Registry');
  }

  // Check for specific project query e.g. "Explain MindWave" or "Nova"
  else {
    const matchProj = PROJECTS.find(p => cleanQuery.includes(p.id) || cleanQuery.includes(p.slug) || cleanQuery.includes(p.title.toLowerCase().replace('ai', '').trim()));
    if (matchProj) {
      answer = `### **${matchProj.title}** (${matchProj.category})\n\n`;
      answer += `* **Status:** ${matchProj.status}\n`;
      answer += `* **Role:** ${matchProj.role} (${matchProj.duration})\n\n`;
      answer += `#### **Core Problem & Challenge:**\n${matchProj.challenges}\n\n`;
      answer += `#### **Implemented Engineering Solution:**\n${matchProj.solutions}\n\n`;
      answer += `#### **Key Outcome & Lessons:**\n${matchProj.lessons}\n\n`;
      answer += `#### **Future Scope:**\n${matchProj.futureWork || 'Upgrade capabilities'}`;

      sources.add(`${matchProj.title} CASE STUDY (STAR)`);
      sources.add(`${matchProj.title} System Architecture Graph`);
      relatedProjects.add(matchProj.id);
    }
  }

  // 2. FALL BACK TO SEMANTIC VECTOR SEARCH
  if (!answer) {
    const matches = semanticSearch(query);
    if (matches.length > 0) {
      const topMatch = matches[0];
      answer = `### **SearchResult: ${topMatch.chunk.title}**\n\n`;
      answer += topMatch.chunk.content;
      
      sources.add(topMatch.chunk.title);
      if (topMatch.chunk.projectId) {
        relatedProjects.add(topMatch.chunk.projectId);
      }

      // Add second matching context if relevant
      if (matches.length > 1 && matches[1].score > 0.25) {
        answer += `\n\n---\n\n#### **Related Context: ${matches[1].chunk.title}**\n${matches[1].chunk.content}`;
        sources.add(matches[1].chunk.title);
        if (matches[1].chunk.projectId) {
          relatedProjects.add(matches[1].chunk.projectId);
        }
      }
    }
  }

  // 3. ANTIMEMBER Hallucination Safeguard
  if (!answer) {
    answer = `⚠️ [SYSTEM SAFEGUARD: REQUEST OUTSIDE KNOWLEDGEBASE BOUNDARY]
    
No authenticated portfolio records match query "${query}". To prevent hallucinations and enforce strict professional credentials, the neural assistant is restricted from generating off-spec details.`;
  }

  // 4. RICH RESPONSE COMPOSITION
  const sourcesList = Array.from(sources);
  const relatedList = Array.from(relatedProjects)
    .map(id => PROJECTS.find(p => p.id === id)?.title)
    .filter(Boolean) as string[];

  let finalOutput = answer;

  if (sourcesList.length > 0) {
    finalOutput += `\n\n📚 **Sources:**\n` + sourcesList.map(s => `- *${s}*`).join('\n');
  }

  if (relatedList.length > 0) {
    finalOutput += `\n\n🔗 **Related Projects:**\n` + relatedList.map(pName => `- **${pName}**`).join('\n');
  }

  finalOutput += `\n\n💡 **Suggested Questions:**\n` + suggestedQuestions.map(q => `- *"${q}"*`).join('\n');

  return finalOutput;
};
