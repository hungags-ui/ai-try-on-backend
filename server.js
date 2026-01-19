import express from "express";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const app = express();
app.use(cors());
app.get("/", (req, res) => {
  res.send("AI Try-On Backend is running 🚀");
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    uptime: process.uptime(),
    time: new Date()
  });
});

const upload = multer({ dest: "uploads/" });

app.post(
  "/try-on",
  upload.fields([
    { name: "person", maxCount: 1 },
    { name: "outfit", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const personImage = fs.readFileSync(req.files.person[0].path, "base64");
      const outfitImage = fs.readFileSync(req.files.outfit[0].path, "base64");

      const prompt = `
Replace only the clothing on the woman using the second image as the outfit.
Keep the original face, hair, body shape, pose, skin tone, background,
lighting, shadows, and color balance exactly the same.
Do not change facial features or body proportions.
Ensure realistic fabric fit and natural wrinkles.
Photorealistic result.
`;

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  { inlineData: { mimeType: "image/jpeg", data: personImage } },
                  { inlineData: { mimeType: "image/jpeg", data: outfitImage } },
                  { text: prompt },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      const imageBase64 =
        data.candidates[0].content.parts[0].inlineData.data;

      res.json({ image: imageBase64 });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "AI processing failed" });
    }
  }
);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.get("/health", (req, res) => {
  res.json({ status: "ok", time: new Date() });
});


