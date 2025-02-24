import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import cors from "cors";
import express from "express";
import { auth } from "./auth";
import userRoutes from "./userRoutes";

const app = express();
const port = 8000;

app.all("/api/auth/*", toNodeHandler(auth));

app.get("/api/me", async (req, res): Promise<any> => {
    try {
        const session = await auth.api.getSession({
            headers: fromNodeHeaders(req.headers),
        });
        return res.json(session);
    } catch (error) {
        return res.status(500).json({ error: "Failed to get session" });
    }
});

// Mount express json middleware after Better Auth handler
// or only apply it to routes that don't interact with Better Auth
app.use(express.json());
app.use(cors());

// Mount user routes
app.use(userRoutes);

app.listen(port, () => {
    console.log(`Better Auth app listening on port ${port}`);
});