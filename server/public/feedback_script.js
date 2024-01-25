document.addEventListener("DOMContentLoaded", function () {
  const submitBtn = document.getElementById("submitBtn");

  const extractFeedbackData = () => {
    const form = document.getElementById("feedback-form");
    const formData = new FormData(form);

    const feedbackData = {};

    formData.forEach(function (value, key) {
      const label = form.querySelector(`label[for="${key}"]`);
      if (label) {
        const keyName = label.textContent.trim();
        const sliderId = key.replace("dropdown", "");
        const sliderValue = document.getElementById(`slidervalue${sliderId}`);
        feedbackData[keyName] = {
          value: value,
          slider: parseInt(sliderValue.textContent),
        };
      }
    });

    return feedbackData;
  };

  // Update slider value dynamically as it moves
  document.querySelectorAll("input[type='range']").forEach((slider) => {
    const sliderValue = document.getElementById(
      `slidervalue${slider.id.slice(-1)}`
    );

    slider.addEventListener("input", function () {
      sliderValue.textContent = slider.value;
    });
  });

  submitBtn.addEventListener("click", function () {
    const feedbackData = extractFeedbackData();

    // Send the feedbackData to the server
    fetch("http://localhost:3000/submit-feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ feedbackData }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        // Optionally, redirect to another page or perform other actions
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
      });
  });
});
