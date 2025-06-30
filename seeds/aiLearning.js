const concepts = [
  { name: 'Introduction to AI', description: 'Understand the fundamentals of Artificial Intelligence.' },
  { name: 'Machine Learning Basics', description: 'Learn about the core concepts of ML.' },
  { name: 'Neural Networks 101', description: 'An introduction to how neural networks work.' }
];

const questions = [
  // Level 1: Introduction to AI
  {
    questionText: 'What is the primary goal of Artificial Intelligence?',
    options: ['To perfectly replicate human consciousness', 'To perform tasks that normally require human intelligence', 'To create better computer hardware', 'To speed up internet connections'],
    correctAnswer: 1,
    level: 1,
    conceptName: 'Introduction to AI'
  },
  {
    questionText: 'Which of these is considered a subfield of AI?',
    options: ['Graphic Design', 'Data Entry', 'Machine Learning', 'Quantum Physics'],
    correctAnswer: 2,
    level: 1,
    conceptName: 'Introduction to AI'
  },
  // Level 2: Machine Learning Basics
  {
    questionText: 'What type of learning uses labeled data to train a model?',
    options: ['Unsupervised Learning', 'Reinforcement Learning', 'Supervised Learning', 'Semi-Supervised Learning'],
    correctAnswer: 2,
    level: 2,
    conceptName: 'Machine Learning Basics'
  },
  {
    questionText: 'In machine learning, what is "overfitting"?',
    options: ['The model is too simple', 'The model performs well on new, unseen data', 'The model performs perfectly on training data but poorly on new data', 'The data has too many features'],
    correctAnswer: 2,
    level: 2,
    conceptName: 'Machine Learning Basics'
  },
    // Level 3: Neural Networks 101
  {
    questionText: 'What is the basic unit of a neural network?',
    options: ['A pixel', 'A function', 'A neuron (or node)', 'A data packet'],
    correctAnswer: 2,
    level: 3,
    conceptName: 'Neural Networks 101'
  },
  {
    questionText: 'What does an "activation function" do in a neuron?',
    options: ['It determines the output of the neuron', 'It deletes the neuron if it is not used', 'It visualizes the data', 'It stores the data permanently'],
    correctAnswer: 0,
    level: 3,
    conceptName: 'Neural Networks 101'
  }
];

const materials = [
  // Introduction to AI
  {
    title: 'What is AI? In 5 minutes',
    url: 'https://www.youtube.com/watch?v=2ePf9rue1Ao',
    mediaType: 'video',
    conceptName: 'Introduction to AI',
    level: 1
  },
  {
    title: 'A.I. vs. Machine Learning vs. Deep Learning',
    url: 'https://www.youtube.com/watch?v=WSG_A_y2U5A',
    mediaType: 'video',
    conceptName: 'Introduction to AI',
    level: 1
  },
  // Machine Learning Basics
  {
    title: 'Machine Learning Basics: What It Is and How It Works',
    url: 'https://www.youtube.com/watch?v=ukzFI9rgM34',
    mediaType: 'video',
    conceptName: 'Machine Learning Basics',
    level: 2
  },
  {
    title: 'Supervised, Unsupervised & Reinforcement Learning',
    url: 'https://www.youtube.com/watch?v=1_wfe2wP3g4',
    mediaType: 'video',
    conceptName: 'Machine Learning Basics',
    level: 2
  },
  // Neural Networks 101
  {
    title: 'But what is a neural network? | Chapter 1, Deep learning',
    url: 'https://www.youtube.com/watch?v=aircAruvnKk',
    mediaType: 'video',
    conceptName: 'Neural Networks 101',
    level: 3
  },
  {
    title: 'A friendly introduction to Neural Networks',
    url: 'https://www.freecodecamp.org/news/a-friendly-introduction-to-neural-networks/',
    mediaType: 'article',
    conceptName: 'Neural Networks 101',
    level: 3
  }
];

module.exports = {
  concepts,
  questions,
  materials
};
