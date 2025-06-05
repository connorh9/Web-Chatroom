# Use Python 3.9 slim image
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy only the necessary application files
COPY __init__.py .
COPY routes.py .
COPY models.py .

# Set environment variables
ENV PORT=8080
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=__init__.py
ENV FLASK_ENV=production

# Expose the port
EXPOSE 8080

# Run the application with gunicorn and eventlet for WebSocket support
CMD ["gunicorn", "--bind", ":8080", \
     "--workers", "1", \
     "--threads", "8", \
     "--timeout", "0", \
     "--worker-class", "eventlet", \
     "--log-level", "info", \
     "--access-logfile", "-", \
     "--error-logfile", "-", \
     "__init__:create_app()"] 