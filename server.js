import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

const ALLOWED = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 };

app.get("/api/roll", (req, res) => {
  const dice = String(req.query.dice || "d6").toLowerCase();
  const sides = ALLOWED[dice];
  if (!sides) return res.status(400).json({ error: "Invalid dice", allowed: Object.keys(ALLOWED) });
  const result = Math.floor(Math.random() * sides) + 1;
  res.json({ dice, sides, result, timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`API on http://localhost:${port}`));