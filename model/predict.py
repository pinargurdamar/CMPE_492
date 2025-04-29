import torch
from torchvision import models, transforms
from PIL import Image
from flask import jsonify

# Model ve class labels yükleme
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# 1️⃣ Aynı model mimarisini oluşturuyoruz
model = models.resnet50(weights=None)  # boş bir resnet50 mimarisi
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 4)  # Çünkü 4 sınıfın var (Nevus, Melanoma, BCC, AKIEC)

model = model.to(device)

# 2️⃣ Eğitilmiş ağırlıkları yüklüyoruz
MODEL_PATH = 'model/resnet50_balanced_best.pth'
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval()

# Sınıf isimleri
class_names = ['Nevus', 'Melanoma', 'Basal Cell Carcinoma', 'Actinic Keratosis']

def predict(image_path):
    image = Image.open(image_path).convert('RGB')
    preprocess = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
    ])
    input_tensor = preprocess(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)
        _, predicted = torch.max(outputs, 1)

    predicted_idx = predicted.item()
    predicted_label = class_names[predicted_idx]

    print('🔵 Predicted label:', predicted_label)

    return predicted_label  # ❗ Sadece string dönüyoruz, Response değil

