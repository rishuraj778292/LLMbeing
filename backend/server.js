
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import app from './app.js'


dotenv.config()


const PORT = process.env.PORT || 5000;


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







