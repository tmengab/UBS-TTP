const dsConcepts = [
  { name: 'Python Basics', description: 'Essential Python for data science' },
  { name: 'Pandas', description: 'Data manipulation and analysis' },
  { name: 'Data Visualization', description: 'Creating insights with visuals' },
  { name: 'Machine Learning', description: 'Fundamental ML concepts' },
  { name: 'Data Cleaning', description: 'Preprocessing and wrangling' }
];

const dsQuestions = [
  // ========== Python Basics ==========
  {
    conceptName: 'Python Basics',
    level: 1,
    questionText: "Which Python data structure is mutable and ordered?",
    options: ["Tuple", "List", "Set", "Dictionary"],
    correctAnswer: 1,
    explanation: "Lists are mutable ordered sequences."
  },
  {
    conceptName: 'Python Basics',
    level: 1,
    questionText: "How to create a list comprehension that squares numbers 0-9?",
    options: [
      "[x**2 for x in range(10)]",
      "{x**2 for x in range(10)}",
      "(x**2 for x in range(10))",
      "map(lambda x: x**2, range(10))"
    ],
    correctAnswer: 0,
    explanation: "List comprehensions use square brackets."
  },
  {
    conceptName: 'Python Basics',
    level: 2,
    questionText: "What does np.arange(5,10,2) produce?",
    options: [
      "array([5, 7, 9])",
      "array([5, 6, 7, 8, 9])",
      "array([5, 10, 2])",
      "Error"
    ],
    correctAnswer: 0,
    explanation: "arange(start, stop, step) generates values from 5 to 10 stepping by 2."
  },
  {
    conceptName: 'Python Basics',
    level: 2,
    questionText: "Which is the correct way to handle missing values in Python?",
    options: [
      "None",
      "np.nan",
      "pd.NA",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All represent missing values in different contexts."
  },
  {
    conceptName: 'Python Basics',
    level: 3,
    questionText: "What's the output of: [x for x in 'Data' if x.isupper()]",
    options: [
      "['D']",
      "['D','a','t','a']",
      "['a','t','a']",
      "[]"
    ],
    correctAnswer: 0,
    explanation: "isupper() only matches uppercase letters."
  },
  {
    conceptName: 'Python Basics',
    level: 3,
    questionText: "How to properly use a generator to save memory?",
    options: [
      "Replace list comprehensions with generator expressions",
      "Use yield in functions",
      "Both A and B",
      "Generators don't save memory"
    ],
    correctAnswer: 2,
    explanation: "Both are valid generator approaches."
  },

  // ========== Pandas ==========
  {
    conceptName: 'Pandas',
    level: 1,
    questionText: "How to select a column 'age' from DataFrame df?",
    options: [
      "df.age",
      "df['age']",
      "df.loc[:,'age']",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All are valid column selection methods."
  },
  {
    conceptName: 'Pandas',
    level: 1,
    questionText: "What does df.dropna() do?",
    options: [
      "Fills missing values",
      "Removes rows with nulls",
      "Deletes all nulls",
      "Shows null counts"
    ],
    correctAnswer: 1,
    explanation: "dropna() removes rows/columns containing null values."
  },
  {
    conceptName: 'Pandas',
    level: 2,
    questionText: "How to merge two DataFrames on a common column?",
    options: [
      "df1.join(df2)",
      "pd.concat([df1,df2])",
      "pd.merge(df1,df2,on='key')",
      "df1 + df2"
    ],
    correctAnswer: 2,
    explanation: "merge() is the primary method for database-style joining."
  },
  {
    conceptName: 'Pandas',
    level: 2,
    questionText: "What's the purpose of df.pivot_table()?",
    options: [
      "Create spreadsheet-style pivot tables",
      "Rotate DataFrame 90 degrees",
      "Transpose rows and columns",
      "Convert to numpy array"
    ],
    correctAnswer: 0,
    explanation: "pivot_table() aggregates and summarizes data."
  },
  {
    conceptName: 'Pandas',
    level: 3,
    questionText: "How to handle datetime conversion in Pandas?",
    options: [
      "pd.to_datetime()",
      "df['date'].astype('datetime64[ns]')",
      "Both A and B",
      "Pandas doesn't support datetimes"
    ],
    correctAnswer: 2,
    explanation: "Both methods convert strings to datetime objects."
  },
  {
    conceptName: 'Pandas',
    level: 3,
    questionText: "What does df.groupby('category').agg({'price':['mean','std']}) do?",
    options: [
      "Filters by category",
      "Calculates mean and std deviation of price per category",
      "Creates new categories",
      "Deletes the price column"
    ],
    correctAnswer: 1,
    explanation: "groupby()+agg() computes aggregate statistics."
  },

  // ========== Data Visualization ==========
  {
    conceptName: 'Data Visualization',
    level: 1,
    questionText: "Which matplotlib function creates a line plot?",
    options: [
      "plt.scatter()",
      "plt.bar()",
      "plt.plot()",
      "plt.pie()"
    ],
    correctAnswer: 2,
    explanation: "plot() creates line graphs by default."
  },
  {
    conceptName: 'Data Visualization',
    level: 1,
    questionText: "What's the primary purpose of a histogram?",
    options: [
      "Show relationships between variables",
      "Display distribution of a single variable",
      "Compare categorical data",
      "Plot time series data"
    ],
    correctAnswer: 1,
    explanation: "Histograms visualize data distributions."
  },
  {
    conceptName: 'Data Visualization',
    level: 2,
    questionText: "How to create subplots in matplotlib?",
    options: [
      "plt.subplots()",
      "plt.figure().add_subplot()",
      "Both A and B",
      "Matplotlib doesn't support subplots"
    ],
    correctAnswer: 2,
    explanation: "Both methods create multi-panel figures."
  },
  {
    conceptName: 'Data Visualization',
    level: 2,
    questionText: "When would you use a box plot?",
    options: [
      "To show individual data points",
      "To visualize a distribution's quartiles",
      "To plot continuous time series",
      "To compare unrelated variables"
    ],
    correctAnswer: 1,
    explanation: "Box plots display median, quartiles and outliers."
  },
  {
    conceptName: 'Data Visualization',
    level: 3,
    questionText: "What's the advantage of seaborn over matplotlib?",
    options: [
      "More statistical visualizations",
      "Better default styles",
      "Tighter integration with pandas",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Seaborn provides all these benefits."
  },
  {
    conceptName: 'Data Visualization',
    level: 3,
    questionText: "How to create an interactive plot with Plotly?",
    options: [
      "fig = px.scatter(); fig.show()",
      "plt.interactive(True)",
      "df.plot(interactive=True)",
      "Only with JavaScript"
    ],
    correctAnswer: 0,
    explanation: "Plotly Express provides simple interactive plotting."
  },

  // ========== Machine Learning ==========
  {
    conceptName: 'Machine Learning',
    level: 1,
    questionText: "What's the difference between supervised and unsupervised learning?",
    options: [
      "Supervised uses labeled data",
      "Unsupervised finds hidden patterns",
      "Both A and B",
      "No difference"
    ],
    correctAnswer: 2,
    explanation: "Supervised needs labels, unsupervised doesn't."
  },
  {
    conceptName: 'Machine Learning',
    level: 1,
    questionText: "Which algorithm is used for classification?",
    options: [
      "Linear Regression",
      "K-Means",
      "Decision Trees",
      "PCA"
    ],
    correctAnswer: 2,
    explanation: "Decision Trees can classify data."
  },
  {
    conceptName: 'Machine Learning',
    level: 2,
    questionText: "What's the purpose of train_test_split()?",
    options: [
      "Split data into training and testing sets",
      "Divide features into categories",
      "Separate numerical/categorical variables",
      "Normalize the dataset"
    ],
    correctAnswer: 0,
    explanation: "Essential for evaluating model performance."
  },
  {
    conceptName: 'Machine Learning',
    level: 2,
    questionText: "What does the 'random_state' parameter do?",
    options: [
      "Controls randomness for reproducibility",
      "Selects random features",
      "Shuffles data randomly",
      "All of the above"
    ],
    correctAnswer: 0,
    explanation: "Ensures reproducible results in randomized operations."
  },
  {
    conceptName: 'Machine Learning',
    level: 3,
    questionText: "How to handle overfitting in a model?",
    options: [
      "Add more training data",
      "Use regularization",
      "Simplify the model",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these techniques combat overfitting."
  },
  {
    conceptName: 'Machine Learning',
    level: 3,
    questionText: "What's the purpose of cross-validation?",
    options: [
      "More reliable performance estimate",
      "Better use of limited data",
      "Both A and B",
      "Only for neural networks"
    ],
    correctAnswer: 2,
    explanation: "CV provides robust evaluation and maximizes data usage."
  },

  // ========== Data Cleaning ==========
  {
    conceptName: 'Data Cleaning',
    level: 1,
    questionText: "How to identify missing values in Pandas?",
    options: [
      "df.isnull()",
      "df.info()",
      "df.describe()",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "All these methods help identify nulls."
  },
  {
    conceptName: 'Data Cleaning',
    level: 1,
    questionText: "What's the first step in data cleaning?",
    options: [
      "Handle missing values",
      "Explore and understand data",
      "Remove duplicates",
      "Normalize data"
    ],
    correctAnswer: 1,
    explanation: "Always start with exploratory data analysis."
  },
  {
    conceptName: 'Data Cleaning',
    level: 2,
    questionText: "How to handle categorical variables?",
    options: [
      "Label Encoding",
      "One-Hot Encoding",
      "Target Encoding",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Different techniques suit different scenarios."
  },
  {
    conceptName: 'Data Cleaning',
    level: 2,
    questionText: "What's feature scaling and why is it important?",
    options: [
      "Adjusting feature ranges for algorithm compatibility",
      "Removing unimportant features",
      "Creating new features",
      "Only needed for deep learning"
    ],
    correctAnswer: 0,
    explanation: "Many algorithms require features on similar scales."
  },
  {
    conceptName: 'Data Cleaning',
    level: 3,
    questionText: "How to detect and handle outliers?",
    options: [
      "Z-score method",
      "IQR method",
      "Visual inspection",
      "All of the above"
    ],
    correctAnswer: 3,
    explanation: "Multiple valid approaches exist."
  },
  {
    conceptName: 'Data Cleaning',
    level: 3,
    questionText: "What's the purpose of pd.qcut()?",
    options: [
      "Quantile-based discretization",
      "Quality control checks",
      "Quick column updates",
      "Query optimization"
    ],
    correctAnswer: 0,
    explanation: "qcut() bins data into equal-sized buckets."
  }
];

const dsMaterials = [
  // ========== Python Basics ==========
  {
    conceptName: 'Python Basics',
    level: 1,
    title: 'Python for Data Science',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'video'
  },
  {
    conceptName: 'Python Basics',
    level: 2,
    title: 'NumPy Arrays Explained',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'article'
  },
  {
    conceptName: 'Python Basics',
    level: 3,
    title: 'Advanced Python Patterns',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'interactive'
  },

  // ========== Pandas ==========
  {
    conceptName: 'Pandas',
    level: 1,
    title: 'Pandas Fundamentals',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'video'
  },
  {
    conceptName: 'Pandas',
    level: 2,
    title: 'Advanced Data Manipulation',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'article'
  },
  {
    conceptName: 'Pandas',
    level: 3,
    title: 'Optimizing Pandas Performance',
    url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI',
    mediaType: 'interactive'
  },

  // ========== Data Visualization ==========
  {
    conceptName: 'Data Visualization',
    level: 1,
    title: 'Matplotlib Basics',
    url: 'https://www.youtube.com/watch?v=3Xc3CA655Y4',
    mediaType: 'video'
  },
  {
    conceptName: 'Data Visualization',
    level: 2,
    title: 'Seaborn Tutorial',
    url: 'https://www.youtube.com/watch?v=6GUZXDef2U0',
    mediaType: 'article'
  },
  {
    conceptName: 'Data Visualization',
    level: 3,
    title: 'Interactive Dashboards',
    url: 'https://www.youtube.com/watch?v=MTlQvyNQ3PM',
    mediaType: 'interactive'
  },

  // ========== Machine Learning ==========
  {
    conceptName: 'Machine Learning',
    level: 1,
    title: 'ML Fundamentals',
    url: 'https://www.youtube.com/watch?v=E0Hmnixke2g',
    mediaType: 'video'
  },
  {
    conceptName: 'Machine Learning',
    level: 2,
    title: 'Feature Engineering',
    url: 'https://www.youtube.com/watch?v=d12ra3b_M-0',
    mediaType: 'article'
  },
  {
    conceptName: 'Machine Learning',
    level: 3,
    title: 'Hyperparameter Tuning',
    url: 'https://www.youtube.com/watch?v=HdlDYng8g9s',
    mediaType: 'interactive'
  },

  // ========== Data Cleaning ==========
  {
    conceptName: 'Data Cleaning',
    level: 1,
    title: 'Data Wrangling Basics',
    url: 'https://www.youtube.com/watch?v=sJjzrRN7voE',
    mediaType: 'video'
  },
  {
    conceptName: 'Data Cleaning',
    level: 2,
    title: 'Handling Missing Data',
    url: 'https://www.youtube.com/watch?v=UzsWr9X98J8',
    mediaType: 'article'
  },
  {
    conceptName: 'Data Cleaning',
    level: 3,
    title: 'Advanced Data Pipelines',
    url: 'https://www.youtube.com/watch?v=6kEGUCrBEU0',
    mediaType: 'interactive'
  }
];

module.exports = { dsConcepts, dsQuestions, dsMaterials };
