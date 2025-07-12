
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './config/db.js'
import app from './app.js'
import http from 'http'
import { Server } from 'socket.io'





const PORT = process.env.PORT || 5000;


//socket io connection
// create http server form express app
const server = http.createServer(app);
//initiliaze  socket.io on http
const io = new Server(server,{
    cors:{
        origin:process.env.CORS_ORIGIN,
        credentials:true,
    }
})





// Connect to MongoDB
connectDB()
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`);
        })

    })
    .catch(err => {
        console.error("MongoDB connection error:", err);
    })







