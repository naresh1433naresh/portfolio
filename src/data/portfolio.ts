// ── Portfolio Data ──
// Edit this file to update all content across the portfolio.

export const personal = {
  name: 'NARESH',
  role: 'Software Developer | AI & Backend Developer',
  tagline: 'Building intelligent systems and scalable software.',
  description:
    'I design and build backend systems, AI-powered applications, and practical software solutions with a focus on clean architecture, scalability, and problem solving.',
  email: 'your.email@example.com',          // TODO: Replace with your email
  github: 'https://github.com/naresh1433naresh', // Updated GitHub URL
  linkedin: 'https://linkedin.com/in/yourprofile', // TODO: Replace with your LinkedIn URL
  leetcode: 'https://leetcode.com/yourprofile', // TODO: Replace with your LeetCode URL
};

export const about = {
  bio: [
    "I'm a software developer focused on building practical systems and understanding how software works beneath the surface. My interests include backend engineering, artificial intelligence, system design, data, and problem solving.",
    'I enjoy turning ideas into working products and continuously improving my understanding of software architecture, algorithms, APIs, databases, and scalable systems.',
  ],
  focus: [
    'Backend Development',
    'AI Engineering',
    'System Design',
    'Data & Databases',
    'Algorithms & Problem Solving',
  ],
};

export const techCategories = [
  {
    category: 'Languages',
    icon: '{ }',
    items: ['Java', 'Python', 'JavaScript', 'SQL'],
  },
  {
    category: 'Backend',
    icon: '⚙',
    items: ['FastAPI', 'REST APIs', 'Uvicorn', 'Pydantic'],
  },
  {
    category: 'Databases',
    icon: '◫',
    items: ['PostgreSQL', 'SQL', 'Vector Databases'],
  },
  {
    category: 'AI / Data',
    icon: '◈',
    items: ['Machine Learning', 'Generative AI', 'RAG', 'Vector Search', 'Data Analysis'],
  },
  {
    category: 'Tools',
    icon: '◻',
    items: ['Git', 'GitHub', 'VS Code', 'Jupyter / Google Colab'],
  },
];

export const featuredProject = {
  name: 'SteelFlow',
  tagline: 'AI-Powered Industrial Data Intelligence System',
  description:
    'SteelFlow is an AI-powered software system designed to process, analyze, and retrieve information from industrial/technical data, combining backend engineering, data processing, vector search, and AI capabilities into a practical intelligent system.',
  problem:
    'Industrial and technical data is dense, unstructured, and difficult to query using traditional search. Teams need fast, intelligent retrieval from complex documents.',
  solution:
    'SteelFlow processes raw technical documents, chunks and embeds them into a vector store, and uses AI-powered retrieval to answer natural-language queries accurately.',
  architecture: [
    { label: 'User / Client', active: false },
    { label: 'API Layer (FastAPI)', active: true },
    { label: 'Backend Services', active: false },
    { label: 'Data Processing Pipeline', active: false },
    { label: 'PostgreSQL + Vector Store', active: true },
    { label: 'RAG / AI Retrieval', active: true },
    { label: 'Response', active: false },
  ],
  technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Vector DB', 'RAG', 'Generative AI', 'Pydantic', 'Uvicorn'],
  features: [
    'Natural-language querying of industrial data',
    'Vector search over technical documents',
    'Retrieval-Augmented Generation (RAG) pipeline',
    'Structured backend with FastAPI + Pydantic',
    'Scalable data processing architecture',
    'Clean API design with documented endpoints',
  ],
  github: 'https://github.com/yourusername/steelflow', // TODO: Replace with actual repo URL
  demo: null, // TODO: Add live demo URL if available
  status: 'In Development',
};

export const projects = [
  {
    id: 1,
    name: 'AI Knowledge Assistant',
    description:
      'An intelligent assistant that ingests documents and answers domain-specific questions using retrieval-augmented generation.',
    technologies: ['Python', 'FastAPI', 'Vector DB', 'RAG', 'LLM'],
    github: 'https://github.com/yourusername/ai-knowledge-assistant', // TODO
    demo: null,
    status: 'In Development',
  },
  {
    id: 2,
    name: 'Data Analytics Platform',
    description:
      'A backend platform for ingesting, processing, and visualizing structured data with API endpoints for downstream consumption.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'SQL', 'Data Analysis'],
    github: 'https://github.com/yourusername/data-analytics-platform', // TODO
    demo: null,
    status: 'Planned',
  },
  {
    id: 3,
    name: 'Backend API System',
    description:
      'A production-ready REST API system with authentication, database integration, and clean architectural patterns.',
    technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Pydantic', 'REST API'],
    github: 'https://github.com/yourusername/backend-api-system', // TODO
    demo: null,
    status: 'Planned',
  },
];

export const dsaTopics = [
  { name: 'Arrays', icon: '▤' },
  { name: 'Binary Search', icon: '⌖' },
  { name: 'Recursion', icon: '↺' },
  { name: 'Sorting', icon: '⇅' },
  { name: 'Searching', icon: '⌕' },
  { name: 'Trees', icon: '⊤' },
  { name: 'Graphs', icon: '⬡' },
  { name: 'Dynamic Programming', icon: '▦' },
];

export const engineeringSteps = [
  {
    number: '01',
    title: 'Understand',
    description: 'Understand the problem deeply. Clarify requirements, constraints, and expected behavior before writing a single line of code.',
  },
  {
    number: '02',
    title: 'Design',
    description: 'Break the system into components. Define the architecture, data flow, APIs, and database schema.',
  },
  {
    number: '03',
    title: 'Build',
    description: 'Implement clean, readable, and maintainable code. Prioritize clarity over cleverness.',
  },
  {
    number: '04',
    title: 'Test',
    description: 'Validate functionality against requirements. Test edge cases, error handling, and unexpected inputs.',
  },
  {
    number: '05',
    title: 'Improve',
    description: 'Optimize for performance, scalability, and reliability. Refactor where necessary and document decisions.',
  },
];

export const systemDesignNodes = [
  { label: 'Client', type: 'client' },
  { label: 'API Gateway', type: 'gateway' },
  { label: 'Backend Services', type: 'service' },
  { label: 'Cache Layer', type: 'cache' },
  { label: 'Database', type: 'db' },
  { label: 'Vector Database', type: 'vector' },
  { label: 'AI Services', type: 'ai' },
];

export const journey = [
  {
    year: '2026',
    title: 'Building Backend & AI-Powered Systems',
    description: 'Designing and developing SteelFlow — an AI-powered system combining backend engineering, vector search, and retrieval-augmented generation.',
  },
  {
    year: '2026',
    title: 'APIs, Databases & System Design',
    description: 'Working hands-on with FastAPI, PostgreSQL, vector databases, REST APIs, and applying system design principles to real projects.',
  },
  {
    year: '2026',
    title: 'Algorithms & Problem Solving',
    description: 'Strengthening data structures and algorithms — arrays, trees, graphs, dynamic programming, and efficient problem-solving techniques.',
  },
];

export const githubRepos = [
  {
    name: 'SteelFlow',
    description: 'AI-powered industrial data intelligence system with RAG pipeline.',
    language: 'Python',
    stars: 0,
    url: 'https://github.com/yourusername/steelflow', // TODO
  },
  {
    name: 'Portfolio',
    description: 'Personal portfolio website built with React + TypeScript + Tailwind CSS.',
    language: 'TypeScript',
    stars: 0,
    url: 'https://github.com/yourusername/portfolio', // TODO
  },
  {
    name: 'DSA Practice',
    description: 'Data structures and algorithms practice — organized by topic and difficulty.',
    language: 'Java',
    stars: 0,
    url: 'https://github.com/yourusername/dsa-practice', // TODO
  },
];
