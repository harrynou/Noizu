import 'reflect-metadata';
import app from './app';
import {connectDB} from './config/db'
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