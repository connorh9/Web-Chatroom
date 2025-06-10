# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# copy requirements first to leverage Docker cache
COPY requirements.txt .

# install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# copy only the necessary application files
COPY app.py .
COPY routes.py .
COPY models.py .
COPY env.yaml .

ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

EXPOSE 8080

CMD ["gunicorn", "--bind", ":8080", \
     "--workers", "1", \
     "--threads", "8", \
     "--timeout", "0", \
     "--worker-class", "eventlet", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "app:app"] 