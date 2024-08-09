const express = require('express');
require('dotenv').config();
const authMiddleware = require('./middleware/authentication');
const cors = require('cors');
app.use(cors()); 

const app = express(); 

//middleware
app.use(express.json());


//Routes 
app.get("/",(req,res)=>{
    res.send("Management_Tool")
}); 

// routers 

const authRouter = require('./routes/auth');
const connectDB = require('./db/connect');

app.use('/api/v1/auth',authRouter)

app.use('/api/projects', authMiddleware, require('./routes/projectRoutes'));
app.use('/api/projecttasks', authMiddleware, require('./routes/task'));



const port = process.env.PORT || 3000;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        console.log("db connected")
        app.listen(port,()=> console.log(`Server is listening on port ${port}...`))
    }
    catch(error){
        console.log(error);
    }
};

start();
