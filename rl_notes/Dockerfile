# RL with Python — Dockerfile
# Builds a CPU-based image from the packages listed in requirements.txt.
# For GPU support, switch to a CUDA-capable base image and install the matching
# CUDA PyTorch wheels instead of the CPU default.
FROM python:3.11-slim

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    MPLBACKEND=Agg \
    SDL_VIDEODRIVER=dummy \
    MUJOCO_GL=osmesa

WORKDIR /workspace

# Native libraries required by Box2D, MuJoCo, pygame, OpenCV, and moviepy.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    ffmpeg \
    git \
    libgl1 \
    libglib2.0-0 \
    libglew2.2 \
    libglfw3 \
    libgomp1 \
    libosmesa6 \
    libsdl2-2.0-0 \
    libsdl2-image-2.0-0 \
    libsdl2-mixer-2.0-0 \
    libsdl2-ttf-2.0-0 \
    libsm6 \
    libxcursor1 \
    libxext6 \
    libxi6 \
    libxinerama1 \
    libxrandr2 \
    libxrender1 \
    patchelf \
    swig \
    && rm -rf /var/lib/apt/lists/*

# Install third-party Python dependencies first for better layer reuse.
COPY requirements.txt ./
RUN python -m pip install --upgrade pip setuptools wheel \
    && python -m pip install -r requirements.txt

# Copy the repository and install the local package.
COPY . .
RUN python -m pip install -e .

CMD ["bash"]
