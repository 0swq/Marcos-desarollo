import os

import ngrok
import time
from dotenv import load_dotenv

load_dotenv()

listener = ngrok.forward(8000, authtoken=os.getenv("NGROK_AUTHTOKEN"))
print(f"URL pública: {listener.url()}")

time.sleep(99999)