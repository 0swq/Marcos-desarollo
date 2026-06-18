FROM python:3.12-slim

WORKDIR /app

# Instalamos dependencias primero para aprovechar el cache
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiamos el contenido actual a /app/Back
# Si estás dentro de la carpeta 'Back' localmente, usa: COPY . ./Back
# Si estás en la raíz del proyecto, asegúrate de copiar la carpeta correcta.
COPY . /app/Back/

# Muy importante: Para que 'import Back.Core' funcione,
# el intérprete debe buscar DESDE la carpeta superior (/app)
ENV PYTHONPATH=/app

EXPOSE 8000

# Ejecutamos usando el formato de módulo para que respete el PYTHONPATH
CMD ["uvicorn", "Back.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]