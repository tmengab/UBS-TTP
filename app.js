const express = require('express');
const connectDB = require('./config-db');
const cors = require('cors');

const conceptsRoutes = require('./routes/concepts');
const questionsRoutes = require('./routes/questions');
const progressRoutes = require('./routes/progress');
const materialsRoutes = require('./routes/materials');
const userRoutes = require('./routes/user');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/concepts', conceptsRoutes);
app.use('/api/questions', questionsRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/materials', materialsRoutes);
app.use('/api/user', userRoutes);

app.get('/', (req, res) => res.send('API Running'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
