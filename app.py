from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mysqldb import MySQL
import os
from model.predict import predict
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# ✅ MySQL Bağlantı Ayarları
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = 'Gunsandpepers2003'
app.config['MYSQL_DB'] = 'skin_diagnosis'

mysql = MySQL(app)

# ✅ Yükleme klasörü
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/test')
def test():
    return "Server is alive and reachable!"

@app.route('/predict', methods=['POST'])
def predict_route():
    if 'file' not in request.files:
        return jsonify({'error': 'No file provided'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

    try:
        predicted_label, confidence_value = predict(filepath)

        cursor = mysql.connection.cursor()
        cursor.execute("SELECT name, symptoms, precautions, note FROM diseases WHERE code = %s", (predicted_label,))
        result = cursor.fetchone()
        cursor.close()

        if result:
            name, symptoms, precautions, note = result
            return jsonify({
                'prediction': predicted_label,
                'confidence': round(confidence_value * 100, 2),
                'name': name,
                'symptoms': symptoms.split(';'),
                'precautions': precautions.split(';'),
                'note': note
            })
        else:
            return jsonify({
                'prediction': predicted_label,
                'confidence': round(confidence_value * 100, 2),
                'error': 'Disease info not found in database.'
            })

    except Exception as e:
        print(f"Hata oluştu: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
