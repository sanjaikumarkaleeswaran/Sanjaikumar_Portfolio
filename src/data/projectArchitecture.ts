export interface ArchNode {
  id: string;
  name: string;
  role: 'Frontend' | 'Backend' | 'Database' | 'AI' | 'Authentication' | 'Deployment' | 'Optimization';
  purpose: string;
  tech: string;
  reason: string;
  tradeoffs: string;
  performance: string;
  security: string;
  scale: string;
}

export const PROJECT_ARCHITECTURES: Record<string, ArchNode[]> = {
  nova: [
    {
      id: 'nova-fe',
      name: 'React Client',
      role: 'Frontend',
      purpose: 'Serve responsive UI elements and workflow grids to business managers.',
      tech: 'React, TypeScript, TailwindCSS',
      reason: 'Standardizes component-level modularity and prevents styling drifts.',
      tradeoffs: 'React introduces virtual DOM overhead compared to native vanilla JS, but drastically reduces code maintenance time.',
      performance: 'Uses React.memo on high-density grids to prevent unneeded column repaints.',
      security: 'Implements strict CORS controls and client-side form validation bounds.',
      scale: 'Leverages static S3 hosting with CloudFront CDN replication.'
    },
    {
      id: 'nova-workflow',
      name: 'RFP Parser Engine',
      role: 'Backend',
      purpose: 'Reads request spreadsheet documents and drafts structural answers.',
      tech: 'FastAPI (Python)',
      reason: 'FastAPI matches Node.js performance speeds and includes native OpenAPI swagger support.',
      tradeoffs: 'Python is slower than Go/Rust, but Python has superior document parsing and regex libraries.',
      performance: 'Uses asynchronous tasks to handle file ingestion pipelines without blocking threads.',
      security: 'Sanitizes inputs to prevent spreadsheet injection attacks.',
      scale: 'Stateless design permits horizontal scaling via Kubernetes pods.'
    },
    {
      id: 'nova-qa',
      name: 'QA Mock Sandbox',
      role: 'Optimization',
      purpose: 'Simulates API responses during agile QA testing sessions.',
      tech: 'Custom Mock API Engine',
      reason: 'Prevents dependency on active backends during regression sweeps.',
      tradeoffs: 'Mock layers require separate data maintenance whenever schemas update.',
      performance: 'Instantly returns static schema mock states in < 5ms.',
      security: 'Excludes all real-world client database references.',
      scale: 'Self-contained code structures require zero server scaling.'
    }
  ],
  mindwave: [
    {
      id: 'mw-fe',
      name: 'React OS Interface',
      role: 'Frontend',
      purpose: 'Provide a context-aware calendar and workspace grid.',
      tech: 'React, Framer Motion, TailwindCSS',
      reason: 'Dynamic layouts require fine-grained animation control and responsive grid rendering.',
      tradeoffs: 'Heavier initial bundle size than simple SSR frameworks.',
      performance: 'Bundled with lazy-loaded components and strict route-splitting.',
      security: 'Escapes user-supplied content to block cross-site scripting (XSS).',
      scale: 'Can be deployed as a static progressive web app (PWA) with client caching.'
    },
    {
      id: 'mw-api',
      name: 'FastAPI Backend',
      role: 'Backend',
      purpose: 'Manages note indices, logs, and external API requests.',
      tech: 'Python FastAPI',
      reason: 'Allows integration with Python-centric AI/ML libraries while keeping REST handlers fast.',
      tradeoffs: 'Synchronous third-party SDK calls can block loops if not wrapped in async threads.',
      performance: 'Utilizes asynchronous event loops and Gunicorn workers.',
      security: 'Secures routes with JSON Web Token (JWT) verification filters.',
      scale: 'Decoupled architecture scales independently from database layers.'
    },
    {
      id: 'mw-db',
      name: 'MongoDB Document DB',
      role: 'Database',
      purpose: 'Persists unstructured daily notes, logs, and agent logs.',
      tech: 'MongoDB Atlas (NoSQL)',
      reason: 'Permits highly flexible log schemas that change depending on integration types.',
      tradeoffs: 'Does not support rigid relational transactions easily compared to PostgreSQL.',
      performance: 'Custom indexes applied on active journal timestamp fields.',
      security: 'Configured with SSL-only connections and strict role accesses.',
      scale: 'Supports easy horizontal scaling via database replica set sharding.'
    },
    {
      id: 'mw-ai',
      name: 'AI Embedding Engine',
      role: 'AI',
      purpose: 'Embeds raw log paragraphs to build searchable semantic vector tables.',
      tech: 'Sentence-Transformers (HuggingFace)',
      reason: 'Maintains privacy by performing vector calculations locally without calling external APIs.',
      tradeoffs: 'Slightly higher CPU usage during heavy batch imports.',
      performance: 'Embeddings are cached locally to minimize redundant GPU calculations.',
      security: 'Fully isolated execution context; user logs never leave the container.',
      scale: 'Can be containerized as a standalone microservice scaled independently.'
    }
  ],
  aquarium: [
    {
      id: 'aq-backend',
      name: 'Django Retail Core',
      role: 'Backend',
      purpose: 'Handles product catalogues, payment gateways, and checkout states.',
      tech: 'Python Django, DRF',
      reason: 'Django offers built-in administrative tools and reliable ORM layers.',
      tradeoffs: 'Opinionated MVC framework creates setup overhead for minor CRUD operations.',
      performance: 'Leverages Django select_related queries to prevent N+1 query loops.',
      security: 'Built-in protection against SQL injection and CSRF attacks.',
      scale: 'Scales horizontally behind Nginx load balancers.'
    },
    {
      id: 'aq-db',
      name: 'MySQL Index Stack',
      role: 'Database',
      purpose: 'Saves active catalog inventories and transaction records.',
      tech: 'MySQL Database',
      reason: 'Ensures strict transaction boundaries (ACID) during checkout tasks.',
      tradeoffs: 'Schema changes require structural migrations, unlike NoSQL.',
      performance: 'Applied composite index on catalog search fields, reducing query load by ~30%.',
      security: 'Database is hidden behind a private subnet inside container network.',
      scale: 'Scales vertically or via primary-replica read replicas.'
    },
    {
      id: 'aq-docker',
      name: 'Docker Compose Orchestrator',
      role: 'Deployment',
      purpose: 'Guarantees uniform environment parameters across developer and production nodes.',
      tech: 'Docker, Docker Compose',
      reason: 'Eliminates configuration mismatches and simplifies deployment setups.',
      tradeoffs: 'Adds a container virtualization abstraction layer.',
      performance: 'Negligible virtual IO overhead; provides fast image builds.',
      security: 'Runs containers as non-root users inside isolated networks.',
      scale: 'Images can deploy directly to AWS ECS/EKS clusters.'
    }
  ],
  studentranking: [
    {
      id: 'sr-logic',
      name: 'Sorting Array Logic',
      role: 'Backend',
      purpose: 'Runs linear academic sorting algorithms across student grade indexes.',
      tech: 'Python, Django REST',
      reason: 'Simplifies mathematical analytics arrays using built-in matrix capabilities.',
      tradeoffs: 'Sorting big datasets in-memory can hit memory bounds; pagination is required.',
      performance: 'Uses index pagination to sort and serve dataset blocks in O(N log N).',
      security: 'Restricts index edits to verified admin roles.',
      scale: 'Scales backend containers to match exam season request peaks.'
    },
    {
      id: 'sr-db',
      name: 'MySQL Registry',
      role: 'Database',
      purpose: 'Stores student accounts, profiles, and score records.',
      tech: 'MySQL Relational DB',
      reason: 'Strict relationships prevent orphaned scores.',
      tradeoffs: 'Slow schema alterations.',
      performance: 'Applied indices on student primary numbers and cohort IDs.',
      security: 'Data columns are encrypted with AES-256 blocks.',
      scale: 'Maintains performance through read-replicas.'
    }
  ]
};
