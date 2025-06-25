# controlDeTareasPythonApp/Dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY controlDeTareasIA/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY controlDeTareasIA/ ./

CMD ["python", "app.py"]

EXPOSE 5000
