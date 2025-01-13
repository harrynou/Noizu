import dotenv from 'dotenv';
import app from './app';
import {connectDB} from './config/db'

dotenv.config();

const port = 5000;
connectDB().then(() => {
    console.log("Connected to Database.")
    app.listen(
        port,
        () => console.log("App is running!")
    )
}).catch((err) => {
    console.error("Error:", err)
});