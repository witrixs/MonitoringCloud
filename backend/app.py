from flask import Flask, send_from_directory, jsonify
from flask_cors import CORS
from nextcloud_info import get_server_info
import os

app = Flask(__name__, static_folder='build', static_url_path='')
CORS(app)

@app.route('/api/serverinfo', methods=['GET'])
def server_info():
    try:
        info = get_server_info()
        return jsonify(info)
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == "__main__":
    if os.getenv('FLASK_ENV') == 'development':
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        app.run(ssl_context=('path/to/cert.pem', 'path/to/key.pem'), host='0.0.0.0', port=443)
