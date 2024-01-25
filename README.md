# Food & Emotion 
This project is a web-based feedback form that explores the connection between food, emotions, and shape. 
Users can provide feedback by selecting food-related emotions from dropdowns and adjusting sliders.
This project consists of a web app designed to capture and prompt users to express their emotions through food. Additionally, there's a Python script (`image_processing.py`) that facilitates the processing of images for 3D printing using the Foodini API.
## Features
- **Feedback Form:** Users can choose from a variety of food-related emotions and provide feedback on a scale.
- **Dynamic Sliders:** Sliders update dynamically as users move them, showing the selected values.
- **Submit Feedback:** Submit the feedback to the server using the "Submit" button.
- **Responsive Design:** The form is designed to be responsive for various screen sizes. ( Needs update )

## Image Processing and SVG Conversion

This project includes a Python script (`image_processing.py`) for processing images and converting them to SVG using the Foodini API. This script performs the following steps:

1. **Authentication:** It logs into the Foodini server to obtain an authentication token.

2. **Image Processing:** It reads an image file (`shape.png` by default), processes it to create a binary image using Otsu's thresholding, and saves the processed image as `processed_image.png`.

3. **Image Upload:** The processed image is then uploaded to the Foodini server as a creation.

4. **Object Retrieval:** The uploaded object is retrieved from the Foodini server.

5. **SVG Conversion:** The script initiates the conversion of the retrieved image to SVG using the Foodini API's imageToVector transformation.

6. **Save SVG:** If the conversion is successful, the resulting SVG content is saved to a file named `output.svg`.

### Running the Script

Ensure you have Python installed on your machine and install the required libraries using:

```bash
pip install requests opencv-python
```

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

- Node.js installed
- npm (Node Package Manager)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/food-emotion-feedback.git
```
   
2. Navigate to the project directory:

   ```bash
   cd food-emotion-feedback```

3. Install dependencies:
   ```bash npm install```

### Usage

1. Run the development server:

```bash
npm start
```
2. Open your browser and visit http://localhost:3000 to view the feedback form.


