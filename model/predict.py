import os
import torch
from torchvision import models, transforms
from PIL import Image

# ✅ Cihaz seçimi
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# ✅ Model yükleme
model = models.resnet50(weights=None)
num_ftrs = model.fc.in_features
model.fc = torch.nn.Linear(num_ftrs, 4)
model = model.to(device)

try:
    MODEL_PATH = 'model/resnet50_balanced_best.pth'
    model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
    model.eval()
except Exception as e:
    print(f"🧨 Model yüklenemedi: {e}")
    raise

# ✅ Kodlarla birebir eşleşen etiketler (veritabanı ile uyumlu)
class_names = ['NV', 'MEL', 'BCC', 'BKL']

def predict(image_path):
    try:
        print(f"📂 Dosya var mı? {os.path.exists(image_path)}")
        image = Image.open(image_path).convert('RGB')
        preprocess = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
        ])
        input_tensor = preprocess(image).unsqueeze(0).to(device)

        with torch.no_grad():
            outputs = model(input_tensor)
            probs = torch.softmax(outputs, dim=1)
            sorted_probs, sorted_indices = torch.sort(probs, descending=True)

        top1_confidence = sorted_probs[0][0].item()
        top1_idx = sorted_indices[0][0].item()
        top2_confidence = sorted_probs[0][1].item()
        top2_idx = sorted_indices[0][1].item()

        if top1_confidence >= 0.70:
            predicted_label = class_names[top1_idx]
            final_confidence = top1_confidence
        elif top2_confidence >= 0.70:
            predicted_label = class_names[top2_idx]
            final_confidence = top2_confidence
        else:
            predicted_label = "The application cold not diagnose your condition"
            final_confidence = top1_confidence

        print(f"✅ Tahmin: {predicted_label}, Confidence: %{final_confidence * 100:.2f}")
        return predicted_label, final_confidence

    except Exception as e:
        print(f"❌ predict() içinde hata oluştu: {e}")
        raise
