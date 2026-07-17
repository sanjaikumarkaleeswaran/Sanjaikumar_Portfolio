export interface KnowledgeDoc {
  id: string;
  title: string;
  category: 'projects' | 'experience' | 'education' | 'certifications' | 'skills' | 'architecture';
  tags: string[];
  content: string;
}

export const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: 'mindwave',
    title: 'MindWave - Personal AI Life OS',
    category: 'projects',
    tags: ['mindwave', 'ai', 'mongodb', 'python', 'fastapi', 'nosql', 'life os', 'productivity'],
    content: `## MindWave - Personal AI Life OS

### Overview
MindWave is a self-hosted, context-aware personal life operating system that integrates personal calendars, tasks, journals, and notes with dynamic AI agents.

### Problem
Recruiters and users struggle to organize notes and derive insights from daily logs, leading to fragmented context and wasted search time.

### Solution
Developed a unified dashboard where logs are automatically tagged and ingested into a local document index, enabling an AI helper to retrieve relevant context.

### Architecture
* Decoupled frontend using a dashboard UI.
* Python FastAPI REST endpoints.
* MongoDB database for flexible JSON logs.
* Custom local embedding model for search.

### Tech Stack
* **Frontend**: React, TailwindCSS.
* **Backend**: Python, FastAPI, Uvicorn.
* **Database**: MongoDB (NoSQL) for unstructured documents.
* **AI Stack**: Sentence-Transformers for embeddings, Local LLM API wrapper.

### Challenges & Lessons
* **Challenge**: Memory leaks during local embedding processing.
* **Solution**: Offloaded model loading to a singleton background worker.
* **Trade-off**: Chose MongoDB over SQL because schema design frequently evolved with new calendar fields.
`
  },
  {
    id: 'nova',
    title: 'Nova - AI RFP Automator',
    category: 'projects',
    tags: ['nova', 'rfp', 'typescript', 'react', 'tailwind', 'workflow', 'qa testing', 'agile'],
    content: `## Nova - AI RFP Automator

### Overview
Nova is an enterprise-grade AI automation system designed to parse Request for Proposal (RFP) sheets and draft automated answers based on matching company docs.

### Problem
Drafting RFPs takes weeks, costing business teams massive labor hours.

### Solution
Created a clean dashboard with validation checks, a custom progress engine, and dynamic document matching queues.

### Architecture
* Modular React components with strict TypeScript types.
* Redux state management.
* Dynamic document parser node.
* Mock data sandbox for developer QA testing.

### Tech Stack
* **Frontend**: React, TypeScript, TailwindCSS.
* **Agile**: Jira sprints, strict code reviews, and manual unit tests.

### Challenges & Lessons
* **Challenge**: Dynamic form inputs caused nested rerender bottlenecks.
* **Solution**: Implemented debounced React input references, cutting rerenders by 65%.
`
  },
  {
    id: 'aquarium',
    title: 'Aquarium Commerce - Dockerized E-Commerce',
    category: 'projects',
    tags: ['aquarium', 'docker', 'sql', 'mysql', 'python', 'django', 'ecommerce'],
    content: `## Aquarium Commerce - Dockerized E-Commerce

### Overview
Aquarium Commerce is a high-volume, secure full-stack retail store specializing in aquatic equipment and livestock, optimized for high load.

### Problem
Slow SQL queries and configuration drifts across local/production environments slowed down deployment.

### Solution
Containerized the full application stack using Docker and optimized database indices for high-frequency filters.

### Architecture
* Docker Compose containing app, DB, and cache nodes.
* Django backend providing stable object-relational mapping.
* Relational SQL indexes on active catalog IDs.

### Tech Stack
* **Backend**: Python, Django REST Framework.
* **Containerization**: Docker, Docker Compose.
* **Database**: MySQL with indexing optimizations.

### Challenges & Lessons
* **Challenge**: Query load spiked under catalog searches.
* **Solution**: Added composite indexes on \`(category_id, is_active, price)\`, speeding up reads by ~30%.
`
  },
  {
    id: 'studentranking',
    title: 'Student Ranking Application',
    category: 'projects',
    tags: ['student', 'ranking', 'sql', 'mysql', 'python', 'django', 'sorting'],
    content: `## Student Ranking Application

### Overview
A role-based academic grade sorting engine and metrics visualization tool designed for universities to assess cohort progress.

### Problem
Grading records are vulnerable to unauthorized changes, and sorting massive classes is computationally heavy.

### Solution
Built a secured, role-based backend with linear sorting algorithms to handle performance indexes.

### Tech Stack
* **Backend**: Python, Django.
* **Database**: MySQL.

### Key Decisions
* Chose MySQL to enforce foreign key constraints, preventing orphan grade records.
`
  },
  {
    id: 'flashcard',
    title: 'Smart Flashcard Generator',
    category: 'projects',
    tags: ['flashcard', 'generator', 'pdf', 'spaced-repetition', 'ai', 'openai', 'learning', 'typescript', 'mongodb'],
    content: `## Smart Flashcard Generator
    
### Overview
An AI-driven EdTech platform that automatically digests uploaded PDFs, extracts key learning concepts, compiles flashcards and notes, and schedules user reviews using spaced repetition algorithms.

### Tech Stack
* **Frontend**: React, TypeScript, TailwindCSS.
* **Backend**: Node.js, Express, TypeScript, OpenAI API.
* **Database**: MongoDB.
`
  },
  {
    id: 'imagecaptioning',
    title: 'AI Image Captioning System',
    category: 'projects',
    tags: ['imagecaptioning', 'python', 'tensorflow', 'cnn', 'lstm', 'ai', 'vision'],
    content: `## AI Image Captioning System
    
### Overview
A deep learning computer vision pipeline designed to generate text descriptions for visual contents, utilizing vision encoders and sequence decoders.

### Tech Stack
* **Framework**: TensorFlow, Keras.
* **Neural Layers**: CNN MobileNetV2 feature extractor, LSTM language text predictor.
`
  },
  {
    id: 'experience',
    title: 'Professional Experience & Milestones',
    category: 'experience',
    tags: ['experience', 'work', 'job', 'milestones', 'agile', 'sprints'],
    content: `## Professional Experience & Milestones

### Overview
Sanjaikumar completed a B.Sc. in Software Systems (Integrated 5-Year Track) at Kongu Engineering College (2021-2025).

### Milestones
* **Full-Stack Projects**: Engineered robust Python APIs, Docker containers, and React frontends.
* **Agile Collaboration**: Worked in team environments, participating in standups and unit testing.
* **Optimization Focus**: Profiling SQL queries, caching, and cutting React bundle sizes.
`
  },
  {
    id: 'education',
    title: 'Academic Education & Standing',
    category: 'education',
    tags: ['education', 'college', 'kongu', 'bsc', 'systems', 'grades', 'gpa'],
    content: `## Academic Education & Standing

### Details
* **Degree**: Bachelor of Science in Software Systems.
* **Institution**: Kongu Engineering College, Erode, Tamil Nadu, India.
* **Duration**: 2021 - 2025.
* **GPA**: 8.05 / 10 (First Class Honors).
* **Skills Learned**: Data Structures, Database Management Systems (DBMS), Operating Systems, Software Engineering, Networks, and Cloud Infrastructure.
`
  },
  {
    id: 'certifications',
    title: 'Professional Certifications & Badges',
    category: 'certifications',
    tags: ['certifications', 'aws', 'cloud', 'linux', 'networking', 'badges'],
    content: `## Professional Certifications & Badges

### Credentials
* **AWS Cloud Practitioner Essentials** (In progress - study modules completed).
* **Linux Fundamentals** (Udemy) - Command shell scripting, permissions, and file systems.
* **Computer Networking Basics** (Udemy) - TCP/IP protocols, routing tables, and DNS setups.
`
  },
  {
    id: 'skills',
    title: 'Technology capability Stack',
    category: 'skills',
    tags: ['skills', 'languages', 'react', 'typescript', 'python', 'fastapi', 'django', 'docker', 'mongodb', 'sql'],
    content: `## Technical Capability Stack

### Summary
* **Languages**: JavaScript, TypeScript, Python, SQL.
* **Frontend**: React.js, TailwindCSS, HTML5, CSS3, Framer Motion, Three.js.
* **Backend**: Python (FastAPI, Django), REST API Design.
* **Databases**: MongoDB (NoSQL), MySQL (Relational).
* **DevOps**: Docker, Git, Linux admin, AWS Practitioner concepts.
`
  },
  {
    id: 'rag_pipeline',
    title: 'RAG Pipeline System Design',
    category: 'architecture',
    tags: ['rag', 'search', 'similarity', 'pipeline', 'embedding', 'jaccard', 'vector', 'hallucination'],
    content: `## Local RAG Pipeline System Design

### Architecture Overview
This portfolio operates a local RAG (Retrieval-Augmented Generation) pipeline entirely client-side.

### Workflow
1. **User Question**: Input query entered into AI Copilot.
2. **Tokenizer**: Query is stripped of stop words and split into keyword tokens.
3. **Similarity Search**: Executes Jaccard Similarity and Keyword Density matches against document indexes.
4. **Context Construction**: Selected top-scoring Markdown pages are merged into the LLM prompt context.
5. **Safe Response Streamer**: Streams text chunk by chunk. If the similarity score is below 0.1, the engine triggers a "No Knowledge Match" alert to prevent hallucinations.
`
  },
  {
    id: 'portfolio_architecture',
    title: 'Portfolio Architecture Specifications',
    category: 'architecture',
    tags: ['architecture', 'design', 'state', 'theme', 'audio', 'threejs', 'canvas', 'hologram'],
    content: `## Portfolio Operating System Architecture

### Specifications
* **Framework**: React + Vite (Single Page Application).
* **State Manager**: \`OSContext\` managing global audio parameters,active workspace windows, and theme states.
* **Graphics**: Three.js point-cloud head digital twin in a canvas thread.
* **Audio**: Web Audio procedural synthesizer triggering custom oscillators and panning nodes.
`
  }
];

// Tokenizer & Jaccard similarity search engine
export const searchKnowledge = (query: string): { doc: KnowledgeDoc; score: number }[] => {
  const cleanQuery = query.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "");
  const queryTokens = cleanQuery.split(/\s+/).filter(t => t.length > 2);
  
  if (queryTokens.length === 0) return [];

  const results = KNOWLEDGE_BASE.map((doc) => {
    let score = 0;
    
    // Tag matches (Highest weight)
    doc.tags.forEach((tag) => {
      if (cleanQuery.includes(tag)) {
        score += 3.5;
      }
    });

    // Title match
    const titleTokens = doc.title.toLowerCase().split(/\s+/);
    titleTokens.forEach((token) => {
      if (queryTokens.includes(token)) {
        score += 2.0;
      }
    });

    // Content Jaccard matches
    const docTokens = doc.content.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    let intersection = 0;
    queryTokens.forEach((token) => {
      if (docTokens.includes(token)) {
        intersection += 1;
      }
    });
    
    if (intersection > 0) {
      const jaccard = intersection / (queryTokens.length + Array.from(new Set(docTokens)).length - intersection);
      score += jaccard * 5.0; // scale Jaccard weight
    }

    return { doc, score };
  });

  // Filter out zero/negligible matches, and sort by descending score
  return results
    .filter(r => r.score > 0.1)
    .sort((a, b) => b.score - a.score);
};
