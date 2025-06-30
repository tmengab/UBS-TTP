const dsConcepts = [
  { name: 'Arrays', description: 'Understanding array operations and characteristics' },
  { name: 'Linked Lists', description: 'Working with node-based linked structures' },
  { name: 'Stacks & Queues', description: 'LIFO and FIFO principle implementations' },
  { name: 'Trees', description: 'Hierarchical data structures and traversals' },
  { name: 'Hash Tables', description: 'Key-value pair storage and collision handling' }
];

const dsQuestions = [
  // ========== Arrays ==========
  {
    conceptName: 'Arrays',
    level: 1,
    questionText: "What's the time complexity of accessing an array element by index?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Arrays provide constant-time access using indices."
  },
  {
    conceptName: 'Arrays',
    level: 1,
    questionText: "Which operation has O(n) time complexity in arrays?",
    options: [
      "Access by index",
      "Insertion at beginning",
      "Update existing element",
      "All of the above"
    ],
    correctAnswer: 1,
    explanation: "Inserting at beginning requires shifting all elements."
  },
  {
    conceptName: 'Arrays',
    level: 2,
    questionText: "What's the output after: let arr = [1,2]; arr[10]=3; console.log(arr.length)?",
    options: ["2", "3", "10", "11"],
    correctAnswer: 3,
    explanation: "Assigning to index 10 sets length to 11 (empty slots become undefined)."
  },
  {
    conceptName: 'Arrays',
    level: 2,
    questionText: "Which method efficiently combines two arrays without mutation?",
    options: [
      "arr1.concat(arr2)",
      "arr1.push(...arr2)",
      "[...arr1, ...arr2]",
      "Both A and C"
    ],
    correctAnswer: 3,
    explanation: "Both concat and spread operator create new arrays."
  },
  {
    conceptName: 'Arrays',
    level: 3,
    questionText: "How to implement a dynamic array that resizes automatically?",
    options: [
      "Double capacity when full",
      "Add fixed space when full",
      "Use linked lists instead",
      "Preallocate maximum needed size"
    ],
    correctAnswer: 0,
    explanation: "Doubling provides amortized O(1) insertion time."
  },
  {
    conceptName: 'Arrays',
    level: 3,
    questionText: "What's the space complexity of recursive array processing?",
    options: ["O(1)", "O(n)", "O(log n)", "Depends on recursion depth"],
    correctAnswer: 3,
    explanation: "Each recursive call adds a stack frame."
  },

  // ========== Linked Lists ==========
  {
    conceptName: 'Linked Lists',
    level: 1,
    questionText: "What's the basic building block of a linked list?",
    options: ["Array", "Object", "Node", "Pointer"],
    correctAnswer: 2,
    explanation: "Nodes containing data and reference to next node."
  },
  {
    conceptName: 'Linked Lists',
    level: 1,
    questionText: "Which operation is O(1) in singly linked lists?",
    options: [
      "Random access",
      "Insertion at head",
      "Deletion at tail",
      "Search by value"
    ],
    correctAnswer: 1,
    explanation: "Head insertion just updates one pointer."
  },
  {
    conceptName: 'Linked Lists',
    level: 2,
    questionText: "How to detect a cycle in a linked list?",
    options: [
      "Hash table tracking visited nodes",
      "Fast/slow pointer technique",
      "Both A and B",
      "Not possible"
    ],
    correctAnswer: 2,
    explanation: "Both methods work, with different tradeoffs."
  },
  {
    conceptName: 'Linked Lists',
    level: 2,
    questionText: "What's the advantage of a dummy node in list processing?",
    options: [
      "Simplifies edge cases",
      "Improves performance",
      "Reduces memory usage",
      "Enables random access"
    ],
    correctAnswer: 0,
    explanation: "Handles empty list/unified head operations gracefully."
  },
  {
    conceptName: 'Linked Lists',
    level: 3,
    questionText: "How to reverse a linked list in O(1) space?",
    options: [
      "Iterative pointer manipulation",
      "Recursive approach",
      "Copy to array and reverse",
      "Not possible"
    ],
    correctAnswer: 0,
    explanation: "Iteratively flip next pointers in place."
  },
  {
    conceptName: 'Linked Lists',
    level: 3,
    questionText: "When would you choose linked list over array?",
    options: [
      "Frequent random access",
      "Frequent insertions/deletions",
      "Memory efficiency",
      "Cache performance"
    ],
    correctAnswer: 1,
    explanation: "Linked lists excel at dynamic modifications."
  },

  // ========== Stacks & Queues ==========
  {
    conceptName: 'Stacks & Queues',
    level: 1,
    questionText: "Which principle does a stack follow?",
    options: ["FIFO", "LIFO", "Random", "Priority"],
    correctAnswer: 1,
    explanation: "Last-In-First-Out (like a stack of plates)."
  },
  {
    conceptName: 'Stacks & Queues',
    level: 1,
    questionText: "What's the runtime of pop() in a properly implemented stack?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Stack operations are constant time."
  },
  {
    conceptName: 'Stacks & Queues',
    level: 2,
    questionText: "How to implement a queue using two stacks?",
    options: [
      "Enqueue to stack1, dequeue by popping stack1 to stack2",
      "Alternate pushes between stacks",
      "Maintain parallel stacks",
      "Not possible"
    ],
    correctAnswer: 0,
    explanation: "Transfer elements between stacks to reverse order."
  },
  {
    conceptName: 'Stacks & Queues',
    level: 2,
    questionText: "Which data structure would best model a printer job queue?",
    options: ["Stack", "Queue", "Heap", "Tree"],
    correctAnswer: 1,
    explanation: "Printer should process jobs in arrival order (FIFO)."
  },
  {
    conceptName: 'Stacks & Queues',
    level: 3,
    questionText: "What's the main advantage of a circular queue?",
    options: [
      "Reuse empty spaces after dequeue",
      "Faster random access",
      "Automatic sorting",
      "Dynamic resizing"
    ],
    correctAnswer: 0,
    explanation: "Efficiently utilizes fixed-size buffer."
  },
  {
    conceptName: 'Stacks & Queues',
    level: 3,
    questionText: "How to design a stack that also tracks min/max in O(1)?",
    options: [
      "Auxiliary stack tracking extremes",
      "Store tuples with current min/max",
      "Both A and B",
      "Not possible"
    ],
    correctAnswer: 2,
    explanation: "Both approaches work with different tradeoffs."
  },

  // ========== Trees ==========
  {
    conceptName: 'Trees',
    level: 1,
    questionText: "What defines a binary tree?",
    options: [
      "Each node has exactly two children",
      "Maximum two children per node",
      "Nodes form a single path",
      "Always balanced"
    ],
    correctAnswer: 1,
    explanation: "Binary means at most two children."
  },
  {
    conceptName: 'Trees',
    level: 1,
    questionText: "Which traversal visits root first?",
    options: ["In-order", "Pre-order", "Post-order", "Level-order"],
    correctAnswer: 1,
    explanation: "Pre-order: root → left → right."
  },
  {
    conceptName: 'Trees',
    level: 2,
    questionText: "What's the height of a complete binary tree with n nodes?",
    options: ["n", "log n", "⌊log₂n⌋", "n/2"],
    correctAnswer: 2,
    explanation: "Height grows logarithmically with nodes."
  },
  {
    conceptName: 'Trees',
    level: 2,
    questionText: "When would you use BFS over DFS?",
    options: [
      "Finding shortest path in unweighted graph",
      "Checking if tree is balanced",
      "Finding deepest node",
      "All of the above"
    ],
    correctAnswer: 0,
    explanation: "BFS naturally finds shortest paths."
  },
  {
    conceptName: 'Trees',
    level: 3,
    questionText: "How to serialize a binary tree for reconstruction?",
    options: [
      "Store pre-order with null markers",
      "Store in-order only",
      "Use adjacency list",
      "All methods work equally"
    ],
    correctAnswer: 0,
    explanation: "Pre-order with nulls preserves structure."
  },
  {
    conceptName: 'Trees',
    level: 3,
    questionText: "What's the advantage of AVL trees over BST?",
    options: [
      "Guaranteed O(log n) operations",
      "Simpler implementation",
      "Less memory overhead",
      "Faster for unsorted data"
    ],
    correctAnswer: 0,
    explanation: "Self-balancing maintains logarithmic height."
  },

  // ========== Hash Tables ==========
  {
    conceptName: 'Hash Tables',
    level: 1,
    questionText: "What's the average-case time complexity for hash table lookup?",
    options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
    correctAnswer: 0,
    explanation: "Properly implemented hash tables provide constant-time access."
  },
  {
    conceptName: 'Hash Tables',
    level: 1,
    questionText: "Which is NOT a collision resolution method?",
    options: [
      "Separate chaining",
      "Open addressing",
      "Linear probing",
      "Binary search"
    ],
    correctAnswer: 3,
    explanation: "Binary search isn't used in hash tables."
  },
  {
    conceptName: 'Hash Tables',
    level: 2,
    questionText: "What makes a good hash function?",
    options: [
      "Uniform distribution",
      "Deterministic",
      "Fast computation",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these properties are essential."
  },
  {
    conceptName: 'Hash Tables',
    level: 2,
    questionText: "When would a hash table degrade to O(n) performance?",
    options: [
      "High load factor",
      "Poor hash function",
      "Excessive collisions",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these factors can cause performance issues."
  },
  {
    conceptName: 'Hash Tables',
    level: 3,
    questionText: "How does consistent hashing improve distributed systems?",
    options: [
      "Minimizes rehashing during scaling",
      "Provides encryption",
      "Enables binary search",
      "Reduces memory usage"
    ],
    correctAnswer: 0,
    explanation: "Only remaps k/n keys when adding nth server."
  },
  {
    conceptName: 'Hash Tables',
    level: 3,
    questionText: "What's the time complexity of inserting n elements into a dynamic hash table?",
    options: ["O(n)", "O(n log n)", "O(n²)", "Amortized O(n)"],
    correctAnswer: 3,
    explanation: "Resizing operations are amortized over many inserts."
  }
];

const dsMaterials = [
  // ========== Arrays ==========
  {
    conceptName: 'Arrays',
    level: 1,
    title: 'Array Fundamentals',
    url: 'https://example.com/arrays-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Arrays',
    level: 2,
    title: 'Array Operations Analysis',
    url: 'https://example.com/arrays-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Arrays',
    level: 3,
    title: 'Dynamic Array Implementation',
    url: 'https://example.com/arrays-advanced',
    mediaType: 'interactive'
  },

  // ========== Linked Lists ==========
  {
    conceptName: 'Linked Lists',
    level: 1,
    title: 'Singly Linked List Basics',
    url: 'https://example.com/linkedlists-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Linked Lists',
    level: 2,
    title: 'Cycle Detection Algorithms',
    url: 'https://example.com/linkedlists-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Linked Lists',
    level: 3,
    title: 'Advanced Pointer Manipulation',
    url: 'https://example.com/linkedlists-advanced',
    mediaType: 'interactive'
  },

  // ========== Stacks & Queues ==========
  {
    conceptName: 'Stacks & Queues',
    level: 1,
    title: 'LIFO vs FIFO Principles',
    url: 'https://example.com/stacksqueues-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Stacks & Queues',
    level: 2,
    title: 'Queue Implementation Variations',
    url: 'https://example.com/stacksqueues-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Stacks & Queues',
    level: 3,
    title: 'Min-Stack Challenge',
    url: 'https://example.com/stacksqueues-advanced',
    mediaType: 'interactive'
  },

  // ========== Trees ==========
  {
    conceptName: 'Trees',
    level: 1,
    title: 'Tree Terminology Explained',
    url: 'https://example.com/trees-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Trees',
    level: 2,
    title: 'Traversal Algorithms Compared',
    url: 'https://example.com/trees-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Trees',
    level: 3,
    title: 'Balanced Tree Implementations',
    url: 'https://example.com/trees-advanced',
    mediaType: 'interactive'
  },

  // ========== Hash Tables ==========
  {
    conceptName: 'Hash Tables',
    level: 1,
    title: 'Hashing Fundamentals',
    url: 'https://example.com/hashtables-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Hash Tables',
    level: 2,
    title: 'Collision Resolution Methods',
    url: 'https://example.com/hashtables-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Hash Tables',
    level: 3,
    title: 'Distributed Hash Tables',
    url: 'https://example.com/hashtables-advanced',
    mediaType: 'interactive'
  }
];

module.exports = {
  concepts: dsConcepts,
  questions: dsQuestions,
  materials: dsMaterials
};
