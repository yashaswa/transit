import express from 'express';
import { requireAuth } from './authMiddleware';


const app = express();
const port = process.env.PORT || 1234;

app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Express server with Prisma and Better Auth' });
});

// Example protected route
app.get("/protected", requireAuth, (req, res) => {
    res.json({ message: "Access granted", user: req.user });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
