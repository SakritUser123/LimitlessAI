#!/usr/bin/env python3
"""
Local food detection using YOLOv8
Runs as a standalone service on port 5001
"""

from flask import Flask, request, jsonify
from PIL import Image
import base64
import io
import json
from ultralytics import YOLO

app = Flask(__name__)

# Load YOLOv8 model (will auto-download on first run)
model = YOLO('yolov8n.pt')  # nano model for speed

# Food-related classes from COCO
FOOD_CLASSES = {
    'apple', 'banana', 'orange', 'broccoli', 'carrot', 'hot dog',
    'pizza', 'donut', 'cake', 'sandwich', 'meat', 'fish', 'bread',
    'vegetable', 'salad', 'fruit', 'food'
}

@app.route('/detect-food', methods=['POST'])
def detect_food():
    """Detect food items in image"""
    try:
        data = request.json
        image_base64 = data.get('image')
        
        if not image_base64:
            return jsonify({'error': 'No image provided'}), 400
        
        # Decode base64 image
        image_data = base64.b64decode(image_base64.split(',')[-1])
        image = Image.open(io.BytesIO(image_data))
        
        # Run detection
        results = model(image)
        
        # Extract detected food items
        detected_foods = []
        for r in results:
            for c in r.boxes.cls:
                class_name = model.names[int(c)].lower()
                if any(food in class_name for food in FOOD_CLASSES):
                    detected_foods.append(class_name)
        
        # Remove duplicates and limit to top 5
        detected_foods = list(set(detected_foods))[:5]
        
        if not detected_foods:
            detected_foods = ['food', 'meal']  # Generic fallback
        
        return jsonify({
            'detected_foods': detected_foods,
            'success': True
        })
    
    except Exception as e:
        return jsonify({'error': str(e), 'success': False}), 500

if __name__ == '__main__':
    print("🚀 Food Detector running on http://localhost:5001")
    app.run(host='127.0.0.1', port=5001, debug=False)
