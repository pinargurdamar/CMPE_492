from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from model.predict import predict  # predict fonksiyonunu import ediyoruz
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

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
        # Tahmin yap
        predicted_label = predict(filepath)

        # Başarılıysa tahmin sonucunu dön
        return jsonify({'prediction': str(predicted_label)})

    except Exception as e:
        print(f"Hata oluştu: {e}")
        return jsonify({'error': 'Prediction failed'}), 500

    finally:
        # Ne olursa olsun dosyayı sil
        if os.path.exists(filepath):
            os.remove(filepath)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
