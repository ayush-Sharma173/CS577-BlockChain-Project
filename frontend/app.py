from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/landing')
def landing():
    return render_template('landing.html')

@app.route('/donate')
def donate():
    return render_template('raise_donate.html')

@app.route('/request')
def request_page():
    return render_template('raise_request.html')

@app.route('/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/assets/app.js')
def serve_app_js():
    return send_from_directory('assets', 'app.js')

if __name__ == '__main__':
    app.run(debug=True)