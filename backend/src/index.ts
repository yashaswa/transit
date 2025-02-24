import express from 'express';
import { requireAuth } from './auth';
import v1ApiRoutes from "./routes/index"

const app = express();
const port = process.env.PORT || 1234;




// Basic route
// app.get('/', (req, res) => {
//     res.json({ message: 'Welcome to the Express server with Prisma and Better Auth' });
// });

// // Example protected route
// app.get("/protected", requireAuth, (req, res) => {
//     res.json({ message: "Access granted", user: req.user });
// });

// Start the server

const setupAndStartServer = async ()=>{
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use('/api',v1ApiRoutes);
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });

}
setupAndStartServer();


