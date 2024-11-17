Canvas Builder API

# Objective
A Node.js API to manage a canvas, add shapes (circle, rectangle), and text, and export the canvas as an HTML file with SVG content. Logs export actions for tracking.

# Technology Stack
- Backend: Node.js with Express
- Database: MongoDB with Mongoose
- Canvas Manipulation: HTML5 Canvas API (via canvas library)
- Validation: Zod
- Export Format: SVG embedded in HTML
- Event Logging: MongoDB
# API Endpoints
1. Initialize Canvas
URL: /canvas
Method: POST
Description: Create a canvas with custom dimensions.
Request Body:
```json
{
  "width": 500,
  "height": 500
}
```
Response:
```json
{
  "canvasId": "string"
}
```
2. Add Elements
URL: /canvas/elements
Method: POST
Description: Add elements (shapes or text) to an existing canvas.
Request Body:
```json
{
  "canvasId": "string",
  "elements": [
    {
      "type": "rectangle",
      "x": 50,
      "y": 50,
      "width": 100,
      "height": 200,
      "strokeStyle": "red",
      "fillStyle": "blue"
    }
  ]
}
```
3. Export Canvas
URL: /canvas/export
Method: POST
Description: Export the canvas as an HTML file with embedded SVG content. Logs the export action.
Request Body:

```json
{
  "canvasId": "string"
}
```
Response:
HTML with embedded SVG content.
Request Validation
The API uses Zod for validation:

Text Element:
```json
{
  "type": "text",
  "text": "Hello",
  "x": 10,
  "y": 20,
  "font": "Arial"
}
```
Rectangle:
```json
{
  "type": "rectangle",
  "x": 50,
  "y": 50,
  "width": 100,
  "height": 200,
  "strokeStyle": "red",
  "fillStyle": "blue"
}
```
Circle:
```json
{
  "type": "circle",
  "x": 100,
  "y": 100,
  "radius": 50,
  "strokeStyle": "green",
  "fillStyle": "yellow"
}
```

# Setup Instructions

Clone the repository:

```bash
git clone https://github.com/paawanjotk/html-exports
cd html-exports
```

Install dependencies:

```bash
npm install
```

Setup environment variables:
```bash
cp .env.example .env
```

Run the application:
```bash
npm start
```
API will be available at http://localhost:8000.

# Docker Setup
Build the Docker image:
```bash
docker build -t html-export .
```

Run the Docker container:
```bash
docker run -d -p 8000:8000 --env-file .env html-export
```

Access the API at http://localhost:8000.