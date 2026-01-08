from flask import Flask, request, jsonify
from flask_cors import CORS
from backend import day_finder
import traceback

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/get-day', methods=['POST'])
def get_day():
    try:
        data = request.get_json()
        date = int(data.get('date'))
        month = data.get('month')
        year = int(data.get('year'))

        if not date or not month or not year:
            return jsonify({'error': 'Missing required fields'}), 400

        # Validate inputs roughly (backend does logic, but good to be safe)
        if not (1 <= date <= 31):
             return jsonify({'error': 'Invalid date'}), 400

        day = day_finder(date, month, year)
        
        # Original backend might return the input month string if not found, 
        # but our frontend will ensure correct month names.
        # If backend returns logic error or something unexpected, handle it?
        # The current backend returns the month name if not found in map.
        
        return jsonify({'day': day})

    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
