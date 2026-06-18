import ngrok
import time

listener = ngrok.forward(8000, authtoken="2QCZnVG0c4y3CaqIMGBQLSKXX5F_5QnTheriDismY3Hqb5dqZ")
print(f"URL pública: {listener.url()}")

time.sleep(99999)