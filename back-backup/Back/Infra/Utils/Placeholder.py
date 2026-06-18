import io
from PIL import Image, ImageDraw, ImageFont
from starlette.responses import StreamingResponse

def generar_placeholder(texto: str) -> StreamingResponse:
    W, H = 400, 400
    bg_color = (230, 230, 230)
    text_color = (80, 80, 80)
    accent_color = (180, 180, 180)
    img = Image.new("RGB", (W, H), color=bg_color)
    draw = ImageDraw.Draw(img)
    draw.rectangle([10, 10, W - 10, H - 10], outline=accent_color, width=2)
    draw.rectangle([150, 120, 250, 200], outline=accent_color, width=2)
    draw.polygon([(155, 195), (195, 150), (245, 195)], fill=accent_color)
    try:
        font = ImageFont.truetype("arial.ttf", 22)
        font_small = ImageFont.truetype("arial.ttf", 14)
    except:
        font = ImageFont.load_default(size=22)
        font_small = ImageFont.load_default(size=14)
    linea1 = texto[:18]
    linea2 = texto[18:36] if len(texto) > 18 else ""

    for i, linea in enumerate([linea1, linea2]):
        if not linea:
            continue
        bbox = draw.textbbox((0, 0), linea, font=font)
        w = bbox[2] - bbox[0]
        draw.text(((W - w) / 2, 220 + i * 30), linea, fill=text_color, font=font)

    sub = "Sin foto disponible"
    bbox = draw.textbbox((0, 0), sub, font=font_small)
    w = bbox[2] - bbox[0]
    draw.text(((W - w) / 2, 310), sub, fill=(150, 150, 150), font=font_small)

    buf = io.BytesIO()
    img.save(buf, format="JPEG", quality=90)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/jpeg")