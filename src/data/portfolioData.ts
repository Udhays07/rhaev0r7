import type {
  ArchitectureComponent,
  LearningArea,
  LearningStage,
  Principle,
  SimilarityItem,
  TechCategory,
  TechItem,
  TerminalCommand,
  ThoughtNode,
  Vector5,
} from '@/types';

export const PERSONAL_INFO = {
  name: 'Udhaya Moorthy',
  nickname: 'rhaev0r7',
  role: 'Software Engineer',
  location: 'India',
  github: 'https://github.com/Udhays07',
  githubHandle: '@Udhays07',
  linkedin: 'https://linkedin.com/in/udhayamoorthy',
  linkedinHandle: 'in/udhayamoorthy',
  email: 'udhayamoorthysj@gmail.com',
};

export const NAV_SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'stack', label: 'Stack' },
  { id: 'thinking', label: 'Thinking' },
  // { id: 'playground', label: 'Playground' }, — section hidden for now
  // { id: 'systems', label: 'Systems' }, — section hidden for now
  { id: 'direction', label: 'Direction' },
] as const;

/* ── 01 About ─────────────────────────────────────────────── */

export const APPROACH = [
  { title: 'Useful', desc: 'It solves an actual problem, rather than existing only as a technical demonstration.' },
  { title: 'Understandable', desc: 'Another developer can reason about it, change it, and trust it.' },
  { title: 'Thoughtful', desc: 'It considers the experience of the person who will actually use it.' },
  { title: 'Scalable', desc: 'Aware of where it might grow — without over-engineering it on day one.' },
  { title: 'Improving', desc: 'The first working version is rarely the last one. Iterate on real feedback.' },
];

export const JOURNEY = [
  {
    stage: 'Then',
    title: 'Frontend & interfaces',
    summary: 'React and TypeScript taught me component architecture, state, and API integration.',
    takeaway: 'A good frontend is not a collection of screens. It is a system.',
  },
  {
    stage: 'Then',
    title: 'Design systems',
    summary: 'Tokens, typography and spacing scales, Storybook, accessible component APIs.',
    takeaway: 'Design and engineering are not separate worlds.',
  },
  {
    stage: 'Now',
    title: 'Backend & data',
    summary: 'Python, FastAPI, PostgreSQL, SQLAlchemy, Redis, JWT, Docker — and how they fit together.',
    takeaway: 'What happens after the frontend makes the request?',
  },
  {
    stage: 'Next',
    title: 'Applied AI',
    summary: 'Embeddings, retrieval and LLMs as one part of a real application.',
    takeaway: 'The interesting part is the system around the model.',
  },
];

export const BUILD_INTERESTS = [
  { title: 'Developer tools', desc: 'Workflows that are easier, faster, or more consistent.' },
  { title: 'Education technology', desc: 'Assessments, question management, test-taking experiences.' },
  { title: 'AI-powered apps', desc: 'Retrieval, embeddings and NLP that do something useful.' },
  { title: 'Productivity tools', desc: 'Complicated, repetitive workflows made simple.' },
  { title: 'Data-driven apps', desc: 'Data that is used to decide, not just stored.' },
];

/* ── 02 Stack ─────────────────────────────────────────────── */

export const TECH_CATEGORIES: { id: TechCategory; label: string }[] = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'data', label: 'Data' },
  { id: 'ai', label: 'AI' },
  { id: 'engineering', label: 'Engineering' },
];

export const TECH_STACK_DATA: TechItem[] = [
  {
    id: 'react',
    name: 'React',
    category: 'frontend',
    tagline: 'Component-driven interfaces and predictable state.',
    description:
      'Where my career started, and still the tool I know best. I use React to build component-driven interfaces, design systems, and state-heavy application screens.',
    usedFor: [
      'Product interfaces with complex state',
      'Design systems and reusable component libraries',
      'Interactive, data-driven application screens',
      'Keeping rendering fast as screens grow',
    ],
    exploring: ['React Server Components and streaming', 'Finer-grained state and reactivity patterns'],
    practicalInsight: 'A good frontend is not just a collection of screens — it is a system built on tokens and decoupled components.',
    tags: ['Hooks', 'Context', 'State architecture', 'Composition'],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'frontend',
    tagline: 'Contracts that keep a codebase honest.',
    description:
      'TypeScript turns loose JavaScript into code that documents itself — especially at the boundaries between components and between client and server.',
    usedFor: [
      'API response contracts',
      'Component prop interfaces and generic utilities',
      'Refactoring with confidence instead of fear',
    ],
    exploring: ['Advanced conditional and template literal types', 'Runtime schema inference with Zod'],
    practicalInsight: 'Types are documentation that cannot go out of date.',
    tags: ['Generics', 'Inference', 'Utility types', 'Strict mode'],
  },
  {
    id: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    tagline: 'Choosing where rendering happens.',
    description: 'Server rendering, static generation and route handlers — and the trade-offs between them.',
    usedFor: ['SEO-sensitive pages', 'Server and static rendering', 'Route handlers and middleware'],
    exploring: ['App Router streaming and Suspense boundaries', 'Server actions'],
    practicalInsight: 'SSR, SSG or client rendering is an architectural decision about freshness, speed and cost — not a default.',
    tags: ['App Router', 'SSR', 'SSG'],
  },
  {
    id: 'html-css',
    name: 'HTML & modern CSS',
    category: 'frontend',
    tagline: 'Semantic structure, tokens, fluid layout.',
    description: 'Accessible, responsive interfaces built on semantic HTML and CSS custom properties.',
    usedFor: [
      'Semantic structure and accessibility',
      'Design tokens as CSS custom properties',
      'Fluid layouts with Grid and Flexbox',
      'Motion that respects reduced-motion settings',
    ],
    exploring: ['Container queries and the View Transitions API', 'OKLCH colour palettes'],
    practicalInsight: 'CSS is an engineering tool. A spacing and type scale creates rhythm and stops UI from fragmenting.',
    tags: ['Tokens', 'Grid', 'Accessibility'],
  },
  {
    id: 'python',
    name: 'Python',
    category: 'backend',
    tagline: 'My way into backend and AI.',
    description: 'The language I am using to go beyond the interface — for APIs, automation, data processing and AI experiments.',
    usedFor: ['REST APIs with FastAPI', 'Automation scripts', 'Embedding and retrieval experiments', 'Parsing and processing content'],
    exploring: ['asyncio concurrency and worker queues', 'Pydantic v2 and type checking with mypy'],
    practicalInsight: 'Python balances quick iteration with the deepest ecosystem for data and AI tooling.',
    tags: ['asyncio', 'Pydantic', 'Automation'],
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    tagline: 'Typed, async APIs with little ceremony.',
    description: 'A framework that makes the contract explicit: request and response models, dependencies, generated docs.',
    usedFor: ['Structuring REST services', 'Generated OpenAPI documentation', 'Dependency injection for sessions and auth', 'Request and response validation'],
    exploring: ['WebSocket streaming', 'Background tasks and job queues'],
    practicalInsight: 'Dependency injection makes each piece testable on its own — the framework nudges you toward good structure.',
    tags: ['Dependencies', 'OpenAPI', 'Async'],
  },
  {
    id: 'rest-apis',
    name: 'API design',
    category: 'backend',
    tagline: 'An API is a product contract.',
    description: 'Designing endpoints that stay maintainable as clients change and the application grows.',
    usedFor: ['Resource-oriented endpoints and pagination', 'Consistent status codes and error bodies', 'JWT authentication', 'Rate limiting and CORS'],
    exploring: ['Idempotency keys', 'Webhooks and event-driven flows'],
    practicalInsight: 'Backward compatibility and clear errors matter more than clever abstractions.',
    tags: ['HTTP', 'JWT', 'Pagination'],
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    category: 'data',
    tagline: 'Relational modelling, integrity, indexes.',
    description: 'Structured storage with SQLAlchemy models and Alembic migrations — and learning to read what the planner is doing.',
    usedFor: ['Schema design and normalisation', 'Indexes for real query patterns', 'Transactions for critical workflows', 'ORM mapping with SQLAlchemy'],
    exploring: ['Reading EXPLAIN ANALYZE', 'Connection pooling'],
    practicalInsight: 'The data model shapes the whole application. Getting the boundaries right early saves many refactors later.',
    tags: ['SQL', 'SQLAlchemy', 'Alembic'],
  },
  {
    id: 'redis',
    name: 'Redis',
    category: 'data',
    tagline: 'Fast, disposable state.',
    description: 'In-memory storage for caching, sessions and rate-limit counters.',
    usedFor: ['Cache-aside reads', 'Session and token tracking', 'Rate-limiter counters'],
    exploring: ['Invalidation strategies', 'Redis Streams'],
    practicalInsight: 'Every cache needs an explicit TTL and a clear key convention — otherwise it becomes a second, stale database.',
    tags: ['Caching', 'TTL', 'Pub/Sub'],
  },
  {
    id: 'llms-rag',
    name: 'LLMs & RAG',
    category: 'ai',
    tagline: 'Grounding models in real data.',
    description: 'Retrieval-augmented generation: give the model the right context, then validate what comes back.',
    usedFor: ['Retrieval pipelines', 'Chunking strategies', 'Structured output', 'Summarising and extracting from documents'],
    exploring: ['Hybrid search (vectors + BM25)', 'Re-ranking and evaluation', 'Tool-calling workflows'],
    practicalInsight: 'The value is not in the model call. It is in data preparation, retrieval quality and validation around it.',
    tags: ['RAG', 'Chunking', 'Prompting'],
  },
  {
    id: 'embeddings-vector',
    name: 'Embeddings & vector search',
    category: 'ai',
    tagline: 'Matching meaning, not characters.',
    description: 'Turning text into vectors so that similar ideas land near each other — for search, de-duplication and recommendations.',
    usedFor: ['Cosine similarity', 'Duplicate question detection', 'Vector indexes (HNSW, IVFFlat)', 'pgvector'],
    exploring: ['Cross-encoder re-ranking', 'Dimension reduction and quantisation'],
    practicalInsight: 'Vector search finds questions that mean the same thing even when they share no words.',
    tags: ['Cosine', 'pgvector', 'Semantic search'],
  },
  {
    id: 'git',
    name: 'Git',
    category: 'engineering',
    tagline: 'History as documentation.',
    description: 'Small commits, clear messages, reviewable pull requests.',
    usedFor: ['Feature-branch and trunk-based workflows', 'Conventional commits', 'Rebasing for a readable history'],
    exploring: ['git bisect', 'Interactive rebase'],
    practicalInsight: 'A clean history explains why a decision was made, months after everyone forgot.',
    tags: ['Branching', 'Rebase'],
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'engineering',
    tagline: 'The same environment everywhere.',
    description: 'Containers for parity between local development, CI and deployment.',
    usedFor: ['Compose setups (app + Postgres + Redis)', 'Multi-stage builds', 'One-command onboarding'],
    exploring: ['Build caching in CI', 'Image hardening'],
    practicalInsight: '"Works on my machine" stops being a sentence anyone needs to say.',
    tags: ['Compose', 'Multi-stage'],
  },
  {
    id: 'design-systems',
    name: 'Design systems',
    category: 'engineering',
    tagline: 'Tokens → components → patterns → pages.',
    description: 'Reusable foundations that bridge visual design, accessibility and a clean developer API.',
    usedFor: ['Component catalogues in Storybook', 'Colour, type, spacing and radius tokens', 'Keyboard and focus behaviour', 'Less duplicated UI across products'],
    exploring: ['Visual regression testing', 'Headless component architecture'],
    practicalInsight: 'A design system removes decision fatigue so teams can spend time on the product, not on buttons.',
    tags: ['Storybook', 'Tokens', 'WCAG'],
  },
];

/* ── 03 Thinking ──────────────────────────────────────────── */

export const THOUGHT_NODES: ThoughtNode[] = [
  {
    id: 'problem',
    stepNumber: '01',
    title: 'Problem',
    subtitle: 'Before writing code',
    description: 'Establish what the problem actually is — and what it is not.',
    keyQuestions: [
      'Who is this for?',
      'What problem are we solving?',
      'What does success look like?',
      'What are the actual constraints?',
      'What is unnecessary?',
    ],
    decisionCriteria: ['User value over technical vanity', 'A clear definition of done'],
  },
  {
    id: 'architecture',
    stepNumber: '02',
    title: 'Architecture',
    subtitle: 'Where things live',
    description: 'Decide where state lives and how data flows before choosing libraries.',
    keyQuestions: [
      'Where should state live?',
      'What belongs to the client, and what to the server?',
      'How should data flow?',
      'What happens when the application grows?',
      'What happens when something fails?',
    ],
    decisionCriteria: ['One source of truth for critical state', 'Predictable failure modes'],
  },
  {
    id: 'implementation',
    stepNumber: '03',
    title: 'Implementation',
    subtitle: 'The simplest thing that works',
    description:
      'Build the simplest solution that satisfies the real requirements. Then improve it based on real constraints rather than imaginary future ones.',
    keyQuestions: [
      'What is the most readable version of this?',
      'Is this abstraction for a real need or an imagined one?',
      'Could another engineer change this safely?',
    ],
    decisionCriteria: ['Clarity over cleverness', 'Fast feedback loops'],
  },
  {
    id: 'data-ai',
    stepNumber: '04',
    title: 'Data & AI',
    subtitle: 'Only where it earns its place',
    description: 'Bring in persistence, caching and AI deliberately, with a fallback for when they fail.',
    keyQuestions: [
      'Is the data model right for the queries we actually run?',
      'Does AI remove a real bottleneck, or is it novelty?',
      'What happens when the model or API is slow or down?',
    ],
    decisionCriteria: ['Deterministic checks around probabilistic output', 'No unnecessary round trips'],
  },
  {
    id: 'validation',
    stepNumber: '05',
    title: 'Validation',
    subtitle: 'Working locally is not finished',
    description: 'A feature is not finished just because it works on my machine.',
    keyQuestions: [
      'What about empty, loading and error states?',
      'Does it work with a keyboard and a screen reader?',
      'Are error messages actionable?',
      'Is it fast on a slow network?',
      'Will the next person understand it?',
    ],
    decisionCriteria: ['Edge cases handled', 'Maintainable by someone else'],
  },
];

/* ── 04 Playground ────────────────────────────────────────── */

/** Dimension labels for the toy embedding space. */
export const VECTOR_DIMENSIONS = ['place', 'ai', 'math', 'frontend', 'backend'] as const;

export const PLAYGROUND_CORPUS: SimilarityItem[] = [
  { id: 'q1', category: 'Geography', text: 'What is the capital city of India?', vector: [0.95, 0.05, 0.05, 0.05, 0.05] },
  { id: 'q2', category: 'Geography', text: 'Which city is the seat of the Indian government?', vector: [0.9, 0.05, 0.05, 0.05, 0.15] },
  { id: 'q3', category: 'Geography', text: 'Historical monuments to visit in New Delhi', vector: [0.82, 0.05, 0.05, 0.18, 0.05] },
  { id: 'q4', category: 'AI', text: 'How do embeddings capture semantic similarity?', vector: [0.05, 0.95, 0.5, 0.1, 0.25] },
  { id: 'q5', category: 'Math', text: 'Computing cosine similarity between two vectors', vector: [0.05, 0.55, 0.95, 0.05, 0.25] },
  { id: 'q6', category: 'AI', text: 'Chunking documents for a RAG pipeline', vector: [0.05, 0.9, 0.2, 0.1, 0.5] },
  { id: 'q7', category: 'Frontend', text: 'Building design tokens and reusable React components', vector: [0.05, 0.1, 0.05, 0.95, 0.15] },
  { id: 'q8', category: 'Backend', text: 'Async REST endpoints with Python and FastAPI', vector: [0.05, 0.15, 0.1, 0.2, 0.95] },
  { id: 'q9', category: 'Backend', text: 'Caching expensive API responses in Redis', vector: [0.05, 0.1, 0.2, 0.1, 0.9] },
];

/**
 * A tiny hand-written "embedding model": each known word contributes a
 * direction in the 5-d space; the query is the sum of its words.
 */
const LEXICON: Record<string, Vector5> = {
  capital: [1, 0, 0, 0, 0], india: [1, 0, 0, 0, 0], indian: [1, 0, 0, 0, 0], city: [0.9, 0, 0, 0, 0],
  delhi: [1, 0, 0, 0, 0], country: [0.9, 0, 0, 0, 0], government: [0.9, 0, 0, 0, 0.1], monument: [0.8, 0, 0, 0.1, 0],
  geography: [1, 0, 0, 0, 0], visit: [0.7, 0, 0, 0, 0], travel: [0.8, 0, 0, 0, 0],
  vector: [0, 0.8, 0.5, 0, 0.1], embedding: [0, 1, 0.3, 0, 0.1], similar: [0, 0.7, 0.6, 0, 0], similarity: [0, 0.7, 0.6, 0, 0],
  semantic: [0, 1, 0.1, 0, 0], search: [0.1, 0.6, 0.3, 0.1, 0.3], ai: [0, 1, 0, 0, 0.2], llm: [0, 1, 0, 0, 0.2],
  rag: [0, 1, 0, 0, 0.4], chunk: [0, 0.8, 0.1, 0, 0.3], chunking: [0, 0.8, 0.1, 0, 0.3], document: [0.1, 0.6, 0, 0.1, 0.3],
  text: [0, 0.6, 0.1, 0.1, 0.1], meaning: [0, 0.9, 0.1, 0, 0], model: [0, 0.8, 0.2, 0, 0.2],
  cosine: [0, 0.4, 1, 0, 0], math: [0, 0.2, 1, 0, 0], dimension: [0, 0.5, 0.9, 0, 0], array: [0, 0.2, 0.9, 0.1, 0.2],
  algorithm: [0, 0.3, 1, 0, 0.2], distance: [0, 0.4, 0.9, 0, 0],
  react: [0, 0, 0, 1, 0], component: [0, 0, 0, 1, 0.05], design: [0, 0, 0, 1, 0], token: [0, 0.1, 0, 0.9, 0.05],
  ui: [0, 0, 0, 1, 0], css: [0, 0, 0, 1, 0], reusable: [0, 0, 0, 0.9, 0.1], frontend: [0, 0, 0, 1, 0.1],
  interface: [0, 0, 0, 0.9, 0.1], button: [0, 0, 0, 1, 0],
  api: [0, 0, 0, 0.2, 1], fastapi: [0, 0, 0, 0.1, 1], python: [0, 0.3, 0.1, 0, 0.9], backend: [0, 0, 0, 0.1, 1],
  async: [0, 0, 0.1, 0.1, 0.9], endpoint: [0, 0, 0, 0.2, 1], server: [0, 0, 0, 0.1, 1], rest: [0, 0, 0, 0.2, 0.9],
  redis: [0, 0, 0.1, 0, 1], cache: [0, 0, 0.1, 0.1, 1], caching: [0, 0, 0.1, 0.1, 1], database: [0, 0.1, 0.1, 0, 1],
  postgres: [0, 0.1, 0.1, 0, 1], sql: [0, 0.1, 0.2, 0, 1],
};

export interface QueryEmbedding {
  vector: Vector5 | null;
  matched: string[];
}

export function embedQuery(query: string): QueryEmbedding {
  const words = query.toLowerCase().match(/[a-z]+/g) ?? [];
  const sum: Vector5 = [0, 0, 0, 0, 0];
  const matched: string[] = [];
  for (const raw of words) {
    const word = LEXICON[raw] ? raw : raw.endsWith('s') && LEXICON[raw.slice(0, -1)] ? raw.slice(0, -1) : null;
    if (!word) continue;
    matched.push(word);
    LEXICON[word].forEach((v, i) => (sum[i] += v));
  }
  return { vector: matched.length ? sum : null, matched };
}

export function cosine(a: Vector5, b: Vector5) {
  let dot = 0;
  let na = 0;
  let nb = 0;
  for (let i = 0; i < 5; i++) {
    dot += a[i] * b[i];
    na += a[i] * a[i];
    nb += b[i] * b[i];
  }
  return na && nb ? dot / Math.sqrt(na * nb) : 0;
}

export const PRESET_QUERIES = [
  'What is the capital of India?',
  'How does vector search find similar text?',
  'Reusable components in React',
  'FastAPI endpoint with a Redis cache',
];

export const RAG_SAMPLE = {
  question: 'What is Udhaya learning right now?',
  chunks: [
    { id: 'c1', text: 'I started my journey primarily through frontend development — React, TypeScript, and design systems.', score: 0.41 },
    { id: 'c2', text: 'I am gradually expanding toward backend engineering with Python, FastAPI, PostgreSQL and Redis.', score: 0.89 },
    { id: 'c3', text: 'I enjoy building developer tools, education technology and productivity tools.', score: 0.33 },
    { id: 'c4', text: 'I am exploring LLM applications, RAG, embeddings and vector search as parts of real systems.', score: 0.84 },
    { id: 'c5', text: 'I am also becoming interested in system design, scalability, testing and observability.', score: 0.77 },
  ],
  topK: 3,
  answer:
    'Udhaya is currently building foundations in backend engineering (Python, FastAPI, PostgreSQL, Redis), exploring AI engineering — RAG, embeddings and vector search — and studying system design. [c2][c4][c5]',
};

/* ── 05 Systems ───────────────────────────────────────────── */

export const ARCHITECTURE_COMPONENTS: ArchitectureComponent[] = [
  {
    id: 'client',
    name: 'Web client',
    short: 'Client',
    kind: 'React · TypeScript',
    responsibility: 'Renders the interface, owns local UI state, and shows loading, empty and error states honestly.',
    tradeoffs: 'Rich interactivity costs bundle size. Keep what must be fast on the client; push the rest to the server.',
    keyPractices: ['Typed API client', 'Optimistic updates where safe', 'Accessible focus and keyboard behaviour'],
    techUsed: ['React', 'TypeScript', 'Vite'],
  },
  {
    id: 'api',
    name: 'API layer',
    short: 'API',
    kind: 'FastAPI · Pydantic',
    responsibility: 'Validates input, authenticates the caller, and routes the request. Nothing unvalidated goes further.',
    tradeoffs: 'A thin layer keeps business logic testable — the cost is one more boundary to keep in sync.',
    keyPractices: ['Schema validation at the edge', 'JWT verification and roles', 'Consistent error shape'],
    techUsed: ['FastAPI', 'Pydantic', 'JWT'],
  },
  {
    id: 'services',
    name: 'Application services',
    short: 'Service',
    kind: 'Python · asyncio',
    responsibility: 'The business logic: decides what to read, what to write, and in what order.',
    tradeoffs: 'Separating it from HTTP and SQL makes it testable, at the price of a little indirection.',
    keyPractices: ['Repositories injected, not imported', 'Non-blocking I/O', 'Roll back on failure'],
    techUsed: ['Python', 'asyncio'],
  },
  {
    id: 'cache',
    name: 'Cache',
    short: 'Cache',
    kind: 'Redis',
    responsibility: 'Keeps recent, expensive reads close, so repeated requests skip the database.',
    tradeoffs: 'Much faster reads — in exchange for having to decide when cached data is no longer true.',
    keyPractices: ['Cache-aside with explicit TTLs', 'Namespaced keys (questions:search:…)', 'Atomic counters for rate limits'],
    techUsed: ['Redis'],
  },
  {
    id: 'database',
    name: 'Relational database',
    short: 'Postgres',
    kind: 'PostgreSQL',
    responsibility: 'The source of truth: structured data, relationships, constraints and transactions.',
    tradeoffs: 'Strong guarantees and flexible queries; schema changes need migrations and care.',
    keyPractices: ['Normalised schema with foreign keys', 'Alembic migrations', 'Indexes on real filters'],
    techUsed: ['PostgreSQL', 'SQLAlchemy', 'Alembic'],
  },
  {
    id: 'vector',
    name: 'Vector index',
    short: 'Vectors',
    kind: 'pgvector',
    responsibility: 'Stores embeddings so the service can find items that mean the same thing, not just match words.',
    tradeoffs: 'Enables semantic search — but every write now needs an embedding, which costs time and money.',
    keyPractices: ['HNSW index', 'Chunks keep source metadata', 'Top-k with a score threshold'],
    techUsed: ['pgvector', 'Embeddings'],
  },
];

/* ── 06 Principles ────────────────────────────────────────── */

export const PRINCIPLES: Principle[] = [
  {
    title: 'Good UX',
    summary: 'Interfaces should feel intentional, predictable, and easy to understand.',
    quote: 'A technically correct application can still provide a poor experience.',
    points: ['Immediate feedback for every action', 'Consistent spacing and hierarchy', 'Keyboard access and readable contrast'],
  },
  {
    title: 'Maintainability',
    summary: 'Code should be understandable by the person who writes it and the person who maintains it.',
    quote: 'Write it for the version of you who has forgotten everything in six months.',
    points: ['Clear names and small modules', 'Real types instead of any', 'Commit messages that explain why'],
  },
  {
    title: 'Simplicity',
    summary: "Don't introduce complexity without a reason.",
    quote: 'Simple solutions are often better starting points.',
    points: ['No abstractions for imagined futures', 'Solve the actual problem first', 'Delete dead code without guilt'],
  },
  {
    title: 'Performance',
    summary: 'A beautiful interface still needs to be fast and responsive.',
    quote: 'Performance is a feature, not a final polish pass.',
    points: ['No unnecessary re-renders', 'Queries that use their indexes', 'Ship less JavaScript'],
  },
  {
    title: 'Learning',
    summary: 'Every project should teach me something new.',
    quote: 'Keep going one layer deeper into how things work.',
    points: ['Build first, then read the theory', 'Understand the trade-off, not just the syntax', 'Treat unfamiliar systems as invitations'],
  },
];

/* ── 07 Direction ─────────────────────────────────────────── */

export const LEARNING_STAGES: LearningStage[] = ['Exploring', 'Learning', 'Building', 'Applying'];

export const LEARNING_AREAS: LearningArea[] = [
  {
    topic: 'React, TypeScript & design systems',
    stage: 'Applying',
    description: 'Component architecture, tokens and state-driven applications — used in real work.',
    keyConcepts: ['Component APIs', 'Tokens', 'State'],
  },
  {
    topic: 'Python backend & FastAPI',
    stage: 'Building',
    description: 'REST APIs, dependency injection, async workflows and validation.',
    keyConcepts: ['Routing', 'Dependencies', 'Auth'],
  },
  {
    topic: 'PostgreSQL & Redis',
    stage: 'Building',
    description: 'Relational modelling, migrations and caching strategies.',
    keyConcepts: ['Schema design', 'Indexes', 'Cache-aside'],
  },
  {
    topic: 'AI engineering & RAG',
    stage: 'Learning',
    description: 'Embeddings, vector search, chunking and grounded LLM workflows.',
    keyConcepts: ['Embeddings', 'Retrieval', 'Evaluation'],
  },
  {
    topic: 'System design',
    stage: 'Learning',
    description: 'Client–server boundaries, caching tiers, failure and scale.',
    keyConcepts: ['State placement', 'Rate limiting', 'Fault tolerance'],
  },
  {
    topic: 'Cloud & DevOps',
    stage: 'Exploring',
    description: 'Containers, CI/CD and deployment pipelines.',
    keyConcepts: ['Docker', 'CI/CD', 'Config'],
  },
];

export const DIRECTION_PATH = [
  { title: 'Interfaces', note: 'Where I started' },
  { title: 'Applications', note: 'Full features, end to end' },
  { title: 'Backend', note: 'APIs, data, auth' },
  { title: 'System design', note: 'How the pieces scale' },
  { title: 'AI engineering', note: 'Models inside real systems' },
  { title: 'Software engineering', note: 'All of it, deliberately' },
];

/* ── 08 Connect ───────────────────────────────────────────── */

export const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    command: 'whoami',
    description: 'Who is this',
    output: ['Udhaya Moorthy (@Udhays07)', 'Software Engineer · India', 'Frontend → Backend → AI'],
  },
  {
    command: 'focus',
    description: 'What I am working on',
    output: ['System design', 'Backend engineering (Python, FastAPI, Postgres, Redis)', 'AI engineering (RAG, embeddings, vector search)'],
  },
  {
    command: 'philosophy',
    description: 'The short version',
    output: [
      "I don't want to be defined by a list of technologies.",
      'I want to understand problems, build useful software,',
      'and keep going one layer deeper into how things work.',
    ],
  },
  {
    command: 'stack',
    description: 'Tools, grouped',
    output: [
      'frontend     React · TypeScript · Next.js · CSS · Storybook',
      'backend      Python · FastAPI · REST',
      'data         PostgreSQL · SQLAlchemy · Redis',
      'ai           Embeddings · Vector search · RAG',
      'tools        Git · Docker · Vite',
    ],
  },
  {
    command: 'connect',
    description: 'Ways to reach me',
    output: [
      `github       ${PERSONAL_INFO.github}`,
      `linkedin     ${PERSONAL_INFO.linkedin}`,
      `email        ${PERSONAL_INFO.email}`,
    ],
  },
  { command: 'email', description: 'Copy my email address', output: [] },
  { command: 'clear', description: 'Clear the screen', output: [] },
  { command: 'help', description: 'List commands', output: [] },
];
