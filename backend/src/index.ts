import express from 'express';
import { requireAuth } from './auth';

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

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
