const mongoose = require('mongoose');
const AIQAPair = require('./models/AIQAPair');

// 连接数据库
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function testAIQAPair() {
  try {
    const userId = 'test-user-123';
    
    // 测试1: 创建第一个AI问答对
    console.log('=== Test 1: Creating first Q&A pair ===');
    const testQA1 = await AIQAPair.create({
      userId: userId,
      question: 'What is JavaScript?',
      answer: 'JavaScript is a programming language used for web development.',
      aiProvider: 'DeepSeek'
    });
    console.log('First Q&A pair created:', testQA1._id);
    
    // 测试2: 尝试创建相同的问题
    console.log('\n=== Test 2: Trying to create duplicate question ===');
    const testQA2 = await AIQAPair.create({
      userId: userId,
      question: 'What is JavaScript?',
      answer: 'JavaScript is a programming language used for web development.',
      aiProvider: 'DeepSeek'
    });
    console.log('Second Q&A pair created:', testQA2._id);
    
    // 测试3: 查询所有问答对
    console.log('\n=== Test 3: All Q&A pairs ===');
    const allQA = await AIQAPair.find({ userId }).sort({ createdAt: -1 });
    console.log(`Found ${allQA.length} Q&A pairs for user ${userId}:`);
    allQA.forEach((qa, index) => {
      console.log(`${index + 1}. Question: "${qa.question}"`);
      console.log(`   Answer: "${qa.answer}"`);
      console.log(`   Created: ${qa.createdAt}`);
    });
    
    // 测试4: 测试精确匹配查找
    console.log('\n=== Test 4: Testing exact match search ===');
    const exactMatch = await AIQAPair.findOne({ 
      question: 'What is JavaScript?',
      userId: userId 
    }).sort({ createdAt: -1 });
    console.log('Exact match found:', exactMatch ? 'Yes' : 'No');
    
    // 测试5: 测试文本搜索
    console.log('\n=== Test 5: Testing text search ===');
    const searchResults = await AIQAPair.find({ 
      $text: { $search: 'JavaScript' },
      userId: userId 
    }).sort({ createdAt: -1 });
    console.log(`Text search found ${searchResults.length} results for "JavaScript"`);
    
    // 测试6: 创建不同的问题
    console.log('\n=== Test 6: Creating different question ===');
    const testQA3 = await AIQAPair.create({
      userId: userId,
      question: 'How to use JavaScript arrays?',
      answer: 'JavaScript arrays can be created using square brackets and have many useful methods.',
      aiProvider: 'DeepSeek'
    });
    console.log('Third Q&A pair created:', testQA3._id);
    
    // 测试7: 最终统计
    console.log('\n=== Test 7: Final statistics ===');
    const finalCount = await AIQAPair.countDocuments({ userId });
    console.log(`Total Q&A pairs for user ${userId}: ${finalCount}`);
    
  } catch (error) {
    console.error('Test error:', error);
  } finally {
    mongoose.connection.close();
  }
}

testAIQAPair(); 