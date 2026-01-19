import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

/* Test root */
app.get("/", (req, res) => {
  res.send("AI Try-On Backend is running 🚀");
});

/* 🔥 TRY-ON ENDPOINT */
app.post(
  "/try-on",
  upload.fields([
    { name: "person", maxCount: 1 },
    { name: "outfit", maxCount: 1 }
  ]),
  (req, res) => {
    if (!req.files?.person || !req.files?.outfit) {
      return res.status(400).send("Thiếu ảnh người hoặc quần áo");
    }

    res.send("✅ Đã nhận ảnh người & quần áo (Try-On OK)");
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});




