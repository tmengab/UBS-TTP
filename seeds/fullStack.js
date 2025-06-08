const fsConcepts = [
  { name: 'Frontend Fundamentals', description: 'Core HTML, CSS, and JavaScript for building user interfaces' },
  { name: 'React Framework', description: 'Component-based UI development with React ecosystem' },
  { name: 'Backend Development', description: 'Server-side programming and API design' },
  { name: 'Database Systems', description: 'Data storage, modeling, and querying' },
  { name: 'DevOps & Deployment', description: 'Application deployment and infrastructure management' }
];

const fsQuestions = [
  // ========== Frontend Fundamentals ==========
  {
    conceptName: 'Frontend Fundamentals',
    level: 1,
    questionText: "What does CSS stand for?",
    options: [
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Creative Style System",
      "Content Styling Service"
    ],
    correctAnswer: 0,
    explanation: "CSS stands for Cascading Style Sheets, used for styling web documents."
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 1,
    questionText: "Which HTML tag is used for creating a hyperlink?",
    options: ["<link>", "<a>", "<href>", "<hyperlink>"],
    correctAnswer: 1,
    explanation: "The <a> tag defines a hyperlink with its href attribute."
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 2,
    questionText: "What's the purpose of JavaScript's event loop?",
    options: [
      "To handle CSS animations",
      "To manage asynchronous operations",
      "To optimize image loading",
      "To validate form inputs"
    ],
    correctAnswer: 1,
    explanation: "The event loop enables JavaScript's non-blocking, asynchronous nature."
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 2,
    questionText: "Which CSS property enables the Flexbox layout?",
    options: [
      "display: flex",
      "layout: flex",
      "position: flex",
      "box-type: flexible"
    ],
    correctAnswer: 0,
    explanation: "display: flex activates the Flexbox layout model."
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 3,
    questionText: "What does the 'Same Origin Policy' prevent in web security?",
    options: [
      "Cross-site scripting (XSS)",
      "Cross-site request forgery (CSRF)",
      "Cross-origin resource sharing",
      "Man-in-the-middle attacks"
    ],
    correctAnswer: 2,
    explanation: "It restricts how documents/scripts from one origin can interact with resources from another origin."
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 3,
    questionText: "How does Virtual DOM improve performance?",
    options: [
      "By reducing memory usage",
      "By minimizing direct DOM manipulations",
      "By compressing assets",
      "By caching API responses"
    ],
    correctAnswer: 1,
    explanation: "It batches DOM updates by comparing with a lightweight virtual representation."
  },
  // ========== React Framework ==========
  {
    conceptName: 'React Framework',
    level: 1,
    questionText: "What is JSX in React?",
    options: [
      "A JavaScript extension syntax",
      "A templating language",
      "A state management library",
      "A build tool"
    ],
    correctAnswer: 0,
    explanation: "JSX is a syntax extension that allows HTML-like code in JavaScript."
  },
  {
    conceptName: 'React Framework',
    level: 1,
    questionText: "Which hook is used for side effects in function components?",
    options: ["useState", "useEffect", "useContext", "useReducer"],
    correctAnswer: 1,
    explanation: "useEffect handles side effects like data fetching and subscriptions."
  },
  {
    conceptName: 'React Framework',
    level: 2,
    questionText: "What's the purpose of React keys?",
    options: [
      "For component styling",
      "For identifying unique elements in lists",
      "For routing between pages",
      "For state encryption"
    ],
    correctAnswer: 1,
    explanation: "Keys help React identify which items have changed in dynamic lists."
  },
  {
    conceptName: 'React Framework',
    level: 2,
    questionText: "How does React Router handle navigation?",
    options: [
      "Through full page reloads",
      "By manipulating browser history API",
      "Using iframes",
      "Via WebSockets"
    ],
    correctAnswer: 1,
    explanation: "It uses the history API for client-side routing without reloads."
  },
  {
    conceptName: 'React Framework',
    level: 3,
    questionText: "When would you use React.memo?",
    options: [
      "To memoize expensive calculations",
      "To prevent unnecessary re-renders",
      "To cache API responses",
      "To optimize bundle size"
    ],
    correctAnswer: 1,
    explanation: "It memoizes components to skip re-renders when props are unchanged."
  },
  {
    conceptName: 'React Framework',
    level: 3,
    questionText: "What problem does Context API solve?",
    options: [
      "Prop drilling",
      "State synchronization",
      "Component styling",
      "Bundle splitting"
    ],
    correctAnswer: 0,
    explanation: "It provides a way to share values across the component tree without explicit prop passing."
  },
  // ========== Backend Development ==========
  {
    conceptName: 'Backend Development',
    level: 1,
    questionText: "What is REST API?",
    options: [
      "A database management system",
      "An architectural style for web services",
      "A frontend framework",
      "A caching mechanism"
    ],
    correctAnswer: 1,
    explanation: "REST is an architectural style using HTTP methods for resource operations."
  },
  {
    conceptName: 'Backend Development',
    level: 1,
    questionText: "Which HTTP method is used for creating resources?",
    options: ["GET", "POST", "PUT", "DELETE"],
    correctAnswer: 1,
    explanation: "POST is typically used for creating new resources in RESTful APIs."
  },
  {
    conceptName: 'Backend Development',
    level: 2,
    questionText: "What's middleware in Express.js?",
    options: [
      "Database connection handlers",
      "Functions that execute during request lifecycle",
      "Frontend templates",
      "Error logging services"
    ],
    correctAnswer: 1,
    explanation: "Middleware functions have access to request/response objects and the next middleware."
  },
  {
    conceptName: 'Backend Development',
    level: 2,
    questionText: "How does JWT authentication work?",
    options: [
      "Using session cookies",
      "With signed tokens containing claims",
      "Via OAuth tokens",
      "Through SSH keys"
    ],
    correctAnswer: 1,
    explanation: "JWTs are self-contained tokens with digitally signed claims."
  },
  {
    conceptName: 'Backend Development',
    level: 3,
    questionText: "What's the purpose of API versioning?",
    options: [
      "To track developer usage",
      "To maintain backward compatibility",
      "To improve performance",
      "To reduce payload size"
    ],
    correctAnswer: 1,
    explanation: "Versioning allows introducing changes without breaking existing clients."
  },
  {
    conceptName: 'Backend Development',
    level: 3,
    questionText: "How would you optimize an N+1 query problem?",
    options: [
      "Implement caching",
      "Use eager loading or batching",
      "Increase database connections",
      "Switch to NoSQL"
    ],
    correctAnswer: 1,
    explanation: "Eager loading or data loaders can combine multiple queries into one."
  },
  // ========== Database Systems ==========
  {
    conceptName: 'Database Systems',
    level: 1,
    questionText: "What's the main advantage of relational databases?",
    options: [
      "Horizontal scalability",
      "Schema flexibility",
      "Data integrity through relations",
      "High write throughput"
    ],
    correctAnswer: 2,
    explanation: "Relational databases enforce data integrity through ACID properties."
  },
  {
    conceptName: 'Database Systems',
    level: 1,
    questionText: "Which NoSQL database is document-oriented?",
    options: ["Redis", "MongoDB", "Cassandra", "Neo4j"],
    correctAnswer: 1,
    explanation: "MongoDB stores data in flexible JSON-like documents."
  },
  {
    conceptName: 'Database Systems',
    level: 2,
    questionText: "What does ACID stand for in databases?",
    options: [
      "Atomicity, Consistency, Isolation, Durability",
      "Availability, Consistency, Integrity, Durability",
      "Atomicity, Concurrency, Integrity, Durability",
      "Automation, Consistency, Isolation, Durability"
    ],
    correctAnswer: 0,
    explanation: "ACID properties ensure reliable transaction processing."
  },
  {
    conceptName: 'Database Systems',
    level: 2,
    questionText: "When would you choose a columnar database?",
    options: [
      "For complex transactions",
      "For analytical queries on large datasets",
      "For hierarchical data",
      "For real-time collaboration"
    ],
    correctAnswer: 1,
    explanation: "Columnar stores optimize read performance for analytical workloads."
  },
  {
    conceptName: 'Database Systems',
    level: 3,
    questionText: "What's database indexing and when is it beneficial?",
    options: [
      "A backup strategy - always beneficial",
      "Data structure for faster lookups - when read-heavy",
      "A compression technique - when storage-limited",
      "A security feature - for sensitive data"
    ],
    correctAnswer: 1,
    explanation: "Indexes speed up searches but slow down writes and consume storage."
  },
  {
    conceptName: 'Database Systems',
    level: 3,
    questionText: "How does sharding improve database performance?",
    options: [
      "By replicating data across servers",
      "By partitioning data horizontally",
      "By compressing data",
      "By caching queries"
    ],
    correctAnswer: 1,
    explanation: "Sharding distributes data across multiple machines to parallelize workloads."
  },
  // ========== DevOps & Deployment ==========
  {
    conceptName: 'DevOps & Deployment',
    level: 1,
    questionText: "What is CI/CD?",
    options: [
      "A database replication strategy",
      "A software development methodology",
      "A cloud computing model",
      "A networking protocol"
    ],
    correctAnswer: 1,
    explanation: "Continuous Integration and Continuous Delivery automate the software release process."
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 1,
    questionText: "Which file defines Docker container configuration?",
    options: ["Dockerfile", "docker-compose.yml", "container.json", "config.ini"],
    correctAnswer: 0,
    explanation: "Dockerfile contains instructions for building Docker images."
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 2,
    questionText: "What's the purpose of Kubernetes?",
    options: [
      "To manage containerized applications",
      "To optimize database queries",
      "To compile frontend assets",
      "To monitor network traffic"
    ],
    correctAnswer: 0,
    explanation: "Kubernetes orchestrates container deployment, scaling, and management."
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 2,
    questionText: "Which cloud service model provides managed infrastructure?",
    options: ["IaaS", "PaaS", "SaaS", "FaaS"],
    correctAnswer: 0,
    explanation: "Infrastructure as a Service (IaaS) provides virtualized computing resources."
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 3,
    questionText: "What's blue-green deployment?",
    options: [
      "A canary release strategy",
      "Maintaining two identical production environments",
      "A database migration technique",
      "A load balancing algorithm"
    ],
    correctAnswer: 1,
    explanation: "It reduces downtime by switching between identical environments."
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 3,
    questionText: "How would you implement zero-downtime deployments?",
    options: [
      "Using rolling updates",
      "With feature flags",
      "Through blue-green deployment",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these strategies can help achieve zero-downtime deployments."
  }
];

const fsMaterials = [
  // ========== Frontend Fundamentals ==========
  {
    conceptName: 'Frontend Fundamentals',
    level: 1,
    title: 'HTML & CSS Crash Course',
    url: 'https://example.com/frontend-basics',
    mediaType: 'video'
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 2,
    title: 'Modern JavaScript Patterns',
    url: 'https://example.com/js-patterns',
    mediaType: 'article'
  },
  {
    conceptName: 'Frontend Fundamentals',
    level: 3,
    title: 'Web Performance Optimization',
    url: 'https://example.com/web-perf',
    mediaType: 'interactive'
  },

  // ========== React Framework ==========
  {
    conceptName: 'React Framework',
    level: 1,
    title: 'React Hooks Introduction',
    url: 'https://example.com/react-hooks',
    mediaType: 'video'
  },
  {
    conceptName: 'React Framework',
    level: 2,
    title: 'Advanced State Management',
    url: 'https://example.com/react-state',
    mediaType: 'article'
  },
  {
    conceptName: 'React Framework',
    level: 3,
    title: 'React Performance Deep Dive',
    url: 'https://example.com/react-perf',
    mediaType: 'interactive'
  },

  // ========== Backend Development ==========
  {
    conceptName: 'Backend Development',
    level: 1,
    title: 'REST API Design Principles',
    url: 'https://example.com/rest-api',
    mediaType: 'video'
  },
  {
    conceptName: 'Backend Development',
    level: 2,
    title: 'Authentication Strategies',
    url: 'https://example.com/auth-methods',
    mediaType: 'article'
  },
  {
    conceptName: 'Backend Development',
    level: 3,
    title: 'Microservices Architecture',
    url: 'https://example.com/microservices',
    mediaType: 'interactive'
  },

  // ========== Database Systems ==========
  {
    conceptName: 'Database Systems',
    level: 1,
    title: 'SQL vs NoSQL Comparison',
    url: 'https://example.com/db-comparison',
    mediaType: 'video'
  },
  {
    conceptName: 'Database Systems',
    level: 2,
    title: 'Database Indexing Explained',
    url: 'https://example.com/db-indexing',
    mediaType: 'article'
  },
  {
    conceptName: 'Database Systems',
    level: 3,
    title: 'Distributed Database Systems',
    url: 'https://example.com/distributed-db',
    mediaType: 'interactive'
  },

  // ========== DevOps & Deployment ==========
  {
    conceptName: 'DevOps & Deployment',
    level: 1,
    title: 'Docker for Beginners',
    url: 'https://example.com/docker-basics',
    mediaType: 'video'
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 2,
    title: 'Kubernetes Orchestration',
    url: 'https://example.com/kubernetes',
    mediaType: 'article'
  },
  {
    conceptName: 'DevOps & Deployment',
    level: 3,
    title: 'Advanced CI/CD Pipelines',
    url: 'https://example.com/cicd-advanced',
    mediaType: 'interactive'
  }
];

module.exports = {
  concepts: fsConcepts,
  questions: fsQuestions,
  materials: fsMaterials
};
