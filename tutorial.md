# Understanding `app.py` and API Integration
*A Beginner's Guide to the Backend*

In this project, `app.py` creates a **web server** (often called an API or Backend) that listens for messages from your website (Frontend) and processes them.

Think of your application like a restaurant:
- **Frontend (`index.html`, `script.js`)**: The **Customer**, asking for something (e.g., "What day is 12th Jan 2025?").
- **API (`app.py`)**: The **Waiter**, who takes the order, brings it to the kitchen, and brings the result back to the customer.
- **Backend Logic (`backend.py`)**: The **Chef**, who actually does the calculation/cooking.

## The Code Explained

Here is a breakdown of what every part of `app.py` does.

### 1. Setup and Imports
```python
from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import day_finder
import traceback

app = Flask(__name__)
CORS(app)
```
- **Flask**: A lightweight tool for creating web servers in Python.
- **CORS (Cross-Origin Resource Sharing)**: This is crucial! It allows your frontend (which might be running on a different "address" purely during development) to talk to this python server without security blocks.
- **`day_finder`**: We import the actual calculation logic from `backend.py` so we don't clutter this file.
- **`app = Flask(__name__)`**: This initializes the waiter/server.

### 2. The Route (The Menu Item)
```python
@app.route('/api/get-day', methods=['POST'])
def get_day():
```
- **`@app.route(...)`**: This creates an "endpoint" or a valid URL that the frontend can call. 
- **`/api/get-day`**: The address. So the full address is `http://localhost:5000/api/get-day`.
- **`methods=['POST']`**: We are telling the server to expect the frontend to **send data** to us (Posting data), rather than just asking for a page (GET).

### 3. Handling the Request (Taking the Order)
```python
try:
    data = request.get_json()
    date = int(data.get('date'))
    month = data.get('month')
    year = int(data.get('year'))
```
- **`request.get_json()`**: The waiter opens the envelope sent by the customer. It expects the data to be in JSON format (JavaScript Object Notation), which looks like `{"date": 12, "month": "January", "year": 2025}`.
- We then extract the specific pieces of info we need.

### 4. Logic and Response (Serving the Dish)
```python
    day = day_finder(date, month, year)
    return jsonify({'day': day})
```
- We call the "Chef" (`day_finder`) with the ingredients.
- **`jsonify(...)`**: We wrap the result back into a JSON format `{'day': 'Sunday'}` to send it back to the frontend. The frontend (Javascript) can easily read this.

### 5. Error Handling (If Something Burns)
```python
except Exception as e:
    print(traceback.format_exc())
    return jsonify({'error': str(e)}), 500
```
- If anything crashes (e.g., bad data), the server won't just die silently. It catches the error and sends a message back saying "Something went wrong" (Status code 500).

### 6. Running the Server
```python
if __name__ == '__main__':
    app.run(debug=True, port=5000)
```
- This starts the actual server on port 5000.
- `debug=True`: If you change code, the server restarts automatically.

---

## How to Connect It (Frontend Integration)
*This is the part you didn't know!*

In your `script.js`, you use `fetch` to talk to this API. It looks something like this:

```javascript
// The Frontend "calling" the API
fetch('http://localhost:5000/api/get-day', {
    method: 'POST', // Must match the Python method
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({ // converting data to JSON string
        date: 12,
        month: 'January',
        year: 2025
    })
})
.then(response => response.json()) // Reading the waiter's response
.then(data => {
    console.log("The day is:", data.day); // Using the result!
});
```

**Key Takeaway**: 
- `app.py` is just a listener.
- It waits for a specific URL call (`/api/get-day`).
- It processes the data using Python.
- It returns the answer.
