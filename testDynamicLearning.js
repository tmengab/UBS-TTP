async function testDynamicLearning() {
  const userId = '684da65eb66e1ca5aeaebe44'; // 使用现有的用户ID
  const topic = 'React Hooks';

  console.log('=== 测试动态学习轨道创建 ===');
  
  try {
    // 1. 创建学习轨道
    console.log('1. 创建学习轨道...');
    const createResponse = await fetch('http://localhost:3000/api/chatbot/create-learning-track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, userId })
    });
    
    const createData = await createResponse.json();
    console.log('创建结果:', createData);
    
    if (createData.success && createData.trackId) {
      const trackId = createData.trackId;
      
      // 2. 获取学习轨道详情
      console.log('\n2. 获取学习轨道详情...');
      const getResponse = await fetch(`http://localhost:3000/api/chatbot/learning-track/${trackId}?userId=${userId}`);
      const getData = await getResponse.json();
      console.log('轨道详情:', {
        topic: getData.data.topic,
        questionCount: getData.data.questions.length,
        materialCount: getData.data.materials.length,
        status: getData.data.status
      });
      
      // 3. 测试答题
      console.log('\n3. 测试答题...');
      const answerResponse = await fetch('http://localhost:3000/api/chatbot/answer-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          questionIndex: 0,
          userAnswer: 0
        })
      });
      
      const answerData = await answerResponse.json();
      console.log('答题结果:', answerData);
      
      // 4. 获取用户的所有学习轨道
      console.log('\n4. 获取用户的所有学习轨道...');
      const tracksResponse = await fetch(`http://localhost:3000/api/chatbot/user-learning-tracks/${userId}`);
      const tracksData = await tracksResponse.json();
      console.log('用户学习轨道:', tracksData.data);
      
    }
    
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testDynamicLearning(); 