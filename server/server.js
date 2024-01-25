const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const app = express();
const port = 3000;

// Increase the payload size limit
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors());
app.use(express.static(path.join(__dirname, "/public")));

// Directory to store individual feedback JSON files
const feedbackDir = path.join(__dirname, "public", "feedback");

// Create the feedback directory if it doesn't exist
if (!fs.existsSync(feedbackDir)) {
  fs.mkdirSync(feedbackDir);
}

// Endpoint to handle image uploads
app.post("/upload", (req, res) => {
  const imageDataURL = req.body.imageDataURL;

  if (!imageDataURL) {
    return res.status(400).json({ error: "No image data provided" });
  }

  const base64Data = imageDataURL.replace(/^data:image\/png;base64,/, "");
  const filename = path.join(
    __dirname,
    "public",
    "images",
    `image_${Date.now()}.png`
  );

  fs.writeFile(filename, base64Data, "base64", (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to save the image" });
    }

    console.log(`Image saved: ${filename}`);

    // Execute Python script after image is saved
    const pythonScriptPath = path.join(__dirname, "process_and_svg.py");
    exec(
      `python ${pythonScriptPath} ${filename}`,
      (pythonErr, pythonStdout, pythonStderr) => {
        if (pythonErr) {
          console.error("Error executing Python script:", pythonErr);
        } else {
          console.log("Python script executed successfully:", pythonStdout);
        }
      }
    );

    res.status(200).json({ message: "Image received and saved successfully" });
  });
});

// Endpoint to handle feedback submissions
app.post("/submit-feedback", (req, res) => {
  const feedbackData = req.body.feedbackData;

  if (!feedbackData) {
    return res.status(400).json({ error: "No feedback data provided" });
  }

  // Create a unique filename based on timestamp
  const feedbackFilename = `feedback_${Date.now()}.json`;
  const feedbackFilePath = path.join(feedbackDir, feedbackFilename);

  // Save feedback data to a new JSON file
  fs.writeFileSync(feedbackFilePath, JSON.stringify(feedbackData, null, 2));

  console.log("Feedback received:", feedbackData);

  res
    .status(200)
    .json({ message: "Feedback received and processed successfully" });
});

// Serve the HTML file for any other route
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
