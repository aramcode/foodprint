// script.js
document.addEventListener("DOMContentLoaded", function () {
  const promptTextElement = document.getElementById("prompt-text");
  const enableCameraBtn = document.getElementById("enable-camera-btn");
  const captureBtn = document.getElementById("capture-btn");
  const camera = document.getElementById("camera");

  // Replace 'Placeholder Prompt' with your desired prompt
  const initialPrompt =
    "Explore the connection between food, emotions, and shape.";
  promptTextElement.textContent = initialPrompt;

  enableCameraBtn.addEventListener("click", function () {
    enableCamera();
    setRandomEmotionAndPrompt();
  });

  captureBtn.addEventListener("click", function () {
    capturePhoto();
    setRandomEmotionAndPrompt();
    console.log("Capture button clicked");
  });

  function enableCamera() {
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then(function (stream) {
        // Display the webcam stream in the video element
        camera.srcObject = stream;
        camera.play();

        // Show the capture button and hide the enable camera button
        enableCameraBtn.style.display = "none";
        captureBtn.style.display = "inline";
        camera.style.display = "block";
      })
      .catch(function (error) {
        console.error("Error accessing the camera: ", error);
      });
  }

  function capturePhoto() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to match the video frame
    canvas.width = camera.videoWidth;
    canvas.height = camera.videoHeight;

    // Draw the current video frame onto the canvas
    context.drawImage(camera, 0, 0, canvas.width, canvas.height);

    // Convert the canvas content to a data URL (base64-encoded PNG)
    const imageDataURL = canvas.toDataURL("image/png");

    // Send the image data to the server
    sendImageToServer(imageDataURL);

    // Cleanup
    camera.srcObject.getTracks().forEach((track) => track.stop());

    // Reset the UI for the next capture
    enableCameraBtn.style.display = "inline";
    captureBtn.style.display = "none";
    camera.style.display = "none";
  }

  function setRandomEmotionAndPrompt() {
    fetch("emotions.json")
      .then((response) => response.json())
      .then((emotionsAndPrompts) => {
        const randomIndex = Math.floor(
          Math.random() * emotionsAndPrompts.length
        );
        const randomEmotion = emotionsAndPrompts[randomIndex].emotion;
        const randomPrompt = emotionsAndPrompts[randomIndex].prompt;

        // Set the random emotion and prompt as the content of #prompt-text
        promptTextElement.textContent = `${randomEmotion}: ${randomPrompt}`;
      })
      .catch((error) => {
        console.error("Error fetching emotions.json:", error);
      });
  }

  function sendImageToServer(imageDataURL) {
    // Send the image data to the server
    fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageDataURL }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
  }
});
