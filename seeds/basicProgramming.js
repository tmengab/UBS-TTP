const basicConcepts = [
  { name: 'Loops', description: 'Understanding and using loops in programming' },
  { name: 'Conditionals', description: 'Working with if-else statements' },
  { name: 'Functions', description: 'Creating and using functions' },
  { name: 'Data Types', description: 'Understanding primitive data types' },
  { name: 'Variables', description: 'Working with variables' }
];

const questions = [
  // ========== Loops ==========
  {
    conceptName: 'Loops',
    level: 1,
    questionText: "Which loop structure guarantees at least one execution?",
    options: [
      "for loop",
      "while loop",
      "do-while loop",
      "forEach loop"
    ],
    correctAnswer: 2,
    explanation: "do-while executes the code block once before checking the condition."
  },
  {
    conceptName: 'Loops',
    level: 1,
    questionText: "How many times will this loop run: 'for(let i=0; i<3; i++)'?",
    options: ["1", "2", "3", "4"],
    correctAnswer: 2,
    explanation: "It runs when i=0,1,2 (3 times total)."
  },
  {
    conceptName: 'Loops',
    level: 2,
    questionText: "What's the output of: for(let i=2; i<=8; i+=2) console.log(i);",
    options: [
      "2,4,6,8",
      "2,3,4,5,6,7,8",
      "2,4,6",
      "4,6,8"
    ],
    correctAnswer: 0,
    explanation: "Loop starts at 2 and increments by 2 until reaching 8."
  },
  {
    conceptName: 'Loops',
    level: 2,
    questionText: "Which loop is best when iteration count is unknown?",
    options: [
      "for",
      "while",
      "do-while",
      "All are equal"
    ],
    correctAnswer: 1,
    explanation: "while loops are ideal when termination depends on a condition."
  },
  {
    conceptName: 'Loops',
    level: 3,
    questionText: "How to break out of nested loops in JavaScript?",
    options: [
      "Using break with a label",
      "Using return",
      "Setting all counters to max",
      "Nested loops can't be broken"
    ],
    correctAnswer: 0,
    explanation: "Label syntax: 'outer: for(...) { break outer; }'"
  },
  {
    conceptName: 'Loops',
    level: 3,
    questionText: "What's the time complexity of a loop that halves n each iteration?",
    options: [
      "O(1)",
      "O(log n)",
      "O(n)",
      "O(n²)"
    ],
    correctAnswer: 1,
    explanation: "Halving produces logarithmic time complexity."
  },

  // ========== Conditionals ==========
  {
    conceptName: 'Conditionals',
    level: 1,
    questionText: "Which operator checks equality without type coercion?",
    options: ["==", "===", "=", "!="],
    correctAnswer: 1,
    explanation: "=== checks value and type."
  },
  {
    conceptName: 'Conditionals',
    level: 1,
    questionText: "What's the correct if-else syntax?",
    options: [
      "if (condition) then {} else {}",
      "if condition {} else {}",
      "if (condition) {} else {}",
      "if {condition} {} else {}"
    ],
    correctAnswer: 2,
    explanation: "Parentheses around condition are required."
  },
  {
    conceptName: 'Conditionals',
    level: 2,
    questionText: "What does 'if (!user.loggedIn)' check?",
    options: [
      "If user is logged in",
      "If user is not logged in",
      "If loggedIn property exists",
      "If user object exists"
    ],
    correctAnswer: 1,
    explanation: "! operator negates the condition."
  },
  {
    conceptName: 'Conditionals',
    level: 2,
    questionText: "Which evaluates to falsy in JavaScript?",
    options: ["1", "'hello'", "0", "[]"],
    correctAnswer: 2,
    explanation: "0 is one of JavaScript's falsy values."
  },
  {
    conceptName: 'Conditionals',
    level: 3,
    questionText: "What's the output of: console.log(null ?? 'default')",
    options: ["null", "'default'", "undefined", "Error"],
    correctAnswer: 1,
    explanation: "Nullish coalescing (??) returns right operand when left is null/undefined."
  },
  {
    conceptName: 'Conditionals',
    level: 3,
    questionText: "How to check if a variable is an array?",
    options: [
      "typeof arr === 'array'",
      "arr.isArray()",
      "Array.isArray(arr)",
      "arr instanceof Array"
    ],
    correctAnswer: 2,
    explanation: "Array.isArray() is the most reliable method."
  },

  // ========== Functions ==========
  {
    conceptName: 'Functions',
    level: 1,
    questionText: "How do you declare a function?",
    options: [
      "function myFunc() {}",
      "let myFunc = () => {}",
      "Both A and B",
      "None of these"
    ],
    correctAnswer: 2,
    explanation: "Both are valid function declarations."
  },
  {
    conceptName: 'Functions',
    level: 1,
    questionText: "What does a function return by default?",
    options: ["null", "0", "undefined", "Depends on function"],
    correctAnswer: 2,
    explanation: "Without return statement, functions return undefined."
  },
  {
    conceptName: 'Functions',
    level: 2,
    questionText: "What's an arrow function's lexical this?",
    options: [
      "Window object",
      "The calling object",
      "The enclosing context",
      "Always undefined"
    ],
    correctAnswer: 2,
    explanation: "Arrow functions don't have their own this binding."
  },
  {
    conceptName: 'Functions',
    level: 2,
    questionText: "How to pass unlimited arguments to a function?",
    options: [
      "Using arguments array",
      "Using rest parameters (...args)",
      "Using apply()",
      "Not possible"
    ],
    correctAnswer: 1,
    explanation: "...args collects all arguments into an array."
  },
  {
    conceptName: 'Functions',
    level: 3,
    questionText: "What is a pure function?",
    options: [
      "A function with no parameters",
      "A function that doesn't modify external state",
      "A function that always returns the same value",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "Pure functions have no side effects and are deterministic."
  },
  {
    conceptName: 'Functions',
    level: 3,
    questionText: "What does Function.prototype.bind() do?",
    options: [
      "Creates a new function with bound this",
      "Combines two functions",
      "Prevents function modification",
      "Optimizes function execution"
    ],
    correctAnswer: 0,
    explanation: "bind() creates a new function with preset this value."
  },

  // ========== Data Types ==========
  {
    conceptName: 'Data Types',
    level: 1,
    questionText: "Which is NOT a primitive in JavaScript?",
    options: ["string", "number", "object", "boolean"],
    correctAnswer: 2,
    explanation: "object is a reference type, not primitive."
  },
  {
    conceptName: 'Data Types',
    level: 1,
    questionText: "What's the type of null?",
    options: ["null", "undefined", "object", "number"],
    correctAnswer: 2,
    explanation: "typeof null returns 'object' (historical bug)."
  },
  {
    conceptName: 'Data Types',
    level: 2,
    questionText: "How to check if a variable is NaN?",
    options: [
      "variable === NaN",
      "isNaN(variable)",
      "Number.isNaN(variable)",
      "Both B and C"
    ],
    correctAnswer: 3,
    explanation: "NaN is the only value not equal to itself."
  },
  {
    conceptName: 'Data Types',
    level: 2,
    questionText: "What's the value of 0.1 + 0.2 === 0.3?",
    options: ["true", "false", "undefined", "Error"],
    correctAnswer: 1,
    explanation: "Floating point precision causes this to be false."
  },
  {
    conceptName: 'Data Types',
    level: 3,
    questionText: "What's a Symbol used for?",
    options: [
      "Creating unique property keys",
      "Mathematical operations",
      "String manipulation",
      "Function binding"
    ],
    correctAnswer: 0,
    explanation: "Symbols create unique identifiers for object properties."
  },
  {
    conceptName: 'Data Types',
    level: 3,
    questionText: "What does Object.freeze() do?",
    options: [
      "Makes object properties immutable",
      "Prevents object extension",
      "Both A and B",
      "Deep freezes nested objects"
    ],
    correctAnswer: 2,
    explanation: "freeze() prevents changes to existing properties and adding new ones."
  },

  // ========== Variables ==========
  {
    conceptName: 'Variables',
    level: 1,
    questionText: "Which variable declaration is block-scoped?",
    options: ["var", "let", "const", "Both B and C"],
    correctAnswer: 3,
    explanation: "let and const are block-scoped, var is function-scoped."
  },
  {
    conceptName: 'Variables',
    level: 1,
    questionText: "What's the difference between let and const?",
    options: [
      "const can't be reassigned",
      "let has hoisting",
      "const must be initialized",
      "Both A and C"
    ],
    correctAnswer: 3,
    explanation: "const requires initialization and disallows reassignment."
  },
  {
    conceptName: 'Variables',
    level: 2,
    questionText: "What is hoisting?",
    options: [
      "Moving declarations to top of scope",
      "A type of variable",
      "An ES6 feature",
      "A debugging tool"
    ],
    correctAnswer: 0,
    explanation: "JavaScript moves declarations to the top of their scope."
  },
  {
    conceptName: 'Variables',
    level: 2,
    questionText: "What's the temporal dead zone?",
    options: [
      "A period before variable declaration",
      "A memory leak",
      "A garbage collection phase",
      "An execution context"
    ],
    correctAnswer: 0,
    explanation: "TDZ is the period between entering scope and declaration."
  },
  {
    conceptName: 'Variables',
    level: 3,
    questionText: "What's the output of: console.log(typeof undeclaredVar)?",
    options: ["undefined", "null", "ReferenceError", "'undefined'"],
    correctAnswer: 3,
    explanation: "typeof returns 'undefined' for undeclared variables."
  },
  {
    conceptName: 'Variables',
    level: 3,
    questionText: "Which is true about global variables?",
    options: [
      "They become window properties",
      "They persist until page unload",
      "They can cause naming collisions",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Global variables have all these characteristics."
  }
];

const materials = [
  // ========== Loops ==========
  {
    conceptName: 'Loops',
    level: 1,
    title: 'Loop Basics',
    url: 'https://example.com/loops-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Loops',
    level: 2,
    title: 'Intermediate Loop Patterns',
    url: 'https://example.com/loops-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Loops',
    level: 3,
    title: 'Advanced Loop Optimization',
    url: 'https://example.com/loops-advanced',
    mediaType: 'interactive'
  },

  // ========== Conditionals ==========
  {
    conceptName: 'Conditionals',
    level: 1,
    title: 'If-Else Fundamentals',
    url: 'https://example.com/conditionals-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Conditionals',
    level: 2,
    title: 'Truthy/Falsy Values',
    url: 'https://example.com/conditionals-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Conditionals',
    level: 3,
    title: 'Nullish Coalescing & Optional Chaining',
    url: 'https://example.com/conditionals-advanced',
    mediaType: 'interactive'
  },

  // ========== Functions ==========
  {
    conceptName: 'Functions',
    level: 1,
    title: 'Function Declaration vs Expression',
    url: 'https://example.com/functions-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Functions',
    level: 2,
    title: 'Arrow Functions Explained',
    url: 'https://example.com/functions-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Functions',
    level: 3,
    title: 'Closures and Higher-Order Functions',
    url: 'https://example.com/functions-advanced',
    mediaType: 'interactive'
  },

  // ========== Data Types ==========
  {
    conceptName: 'Data Types',
    level: 1,
    title: 'Primitive Types Overview',
    url: 'https://example.com/datatypes-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Data Types',
    level: 2,
    title: 'Type Coercion Deep Dive',
    url: 'https://example.com/datatypes-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Data Types',
    level: 3,
    title: 'Symbols and Object Immutability',
    url: 'https://example.com/datatypes-advanced',
    mediaType: 'interactive'
  },

  // ========== Variables ==========
  {
    conceptName: 'Variables',
    level: 1,
    title: 'Var vs Let vs Const',
    url: 'https://example.com/variables-basic',
    mediaType: 'video'
  },
  {
    conceptName: 'Variables',
    level: 2,
    title: 'Hoisting and TDZ Explained',
    url: 'https://example.com/variables-intermediate',
    mediaType: 'article'
  },
  {
    conceptName: 'Variables',
    level: 3,
    title: 'Memory Management with Variables',
    url: 'https://example.com/variables-advanced',
    mediaType: 'interactive'
  }
];
