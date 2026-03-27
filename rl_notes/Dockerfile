# RL with Python — Dockerfile
# Builds a CPU-based image. For GPU support, swap the base image:
#   FROM pytorch/pytorch:2.3.0-cuda12.1-cudnn8-runtime
FROM pytorch/pytorch:2.3.0-runtime

# Prevent interactive prompts during apt installs
ENV DEBIAN_FRONTEND=noninteractive

# System dependencies needed by pygame / ALE / rendering
RUN apt-get update && apt-get install -y --no-install-recommends \
    libsdl2-dev \
    libsdl2-image-dev \
    libsdl2-mixer-dev \
    libsdl2-ttf-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    swig \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /workspace

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the repo
COPY . .

# Default: drop into a bash shell (override at runtime as needed)
CMD ["bash"]
