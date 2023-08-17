import sys
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

imageFilePath = sys.argv[1]
BaseOptions = mp.tasks.BaseOptions
ImageEmbedder = mp.tasks.vision.ImageEmbedder
ImageEmbedderOptions = mp.tasks.vision.ImageEmbedderOptions
VisionRunningMode = mp.tasks.vision.RunningMode

# Load the input image from an image file.Im
mp_image = mp.Image.create_from_file(imageFilePath)

options = ImageEmbedderOptions(
    base_options=BaseOptions(model_asset_path='./server/utils/mobilenet_v3_large.tflite'),
    # quantize=True,
    running_mode=VisionRunningMode.IMAGE)

with ImageEmbedder.create_from_options(options) as embedder:
    embedding_result = embedder.embed(mp_image)
    print(list(embedding_result.embeddings[0].embedding))

    
