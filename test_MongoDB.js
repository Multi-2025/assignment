
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://cr9294wjb:ufJ8ZItbzIaWPUyk@cluster0.ludq9fi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);


/*
io.on('connection', (socket) => {
  console.log('A user connected');

  // 添加一个简单的事件测试消息传递
  socket.on('testEvent', (data) => {
    console.log('Received testEvent with data:', data);
    socket.emit('testResponse', 'Response from server');
  });

  socket.on('nextQuestion', (currentQuestionIndex) => {
    io.emit('updateQuestion', currentQuestionIndex + 1);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
*/
