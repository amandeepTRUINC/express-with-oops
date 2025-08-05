#!/bin/bash

# Build and Push Docker Image Script
# Usage: ./build-and-push.sh [image-name] [tag]

# Default values
IMAGE_NAME=${1:-"restaurant-backend"}
TAG=${2:-"latest"}

echo "Building Docker image: $IMAGE_NAME:$TAG"

# Build the image
docker build -t $IMAGE_NAME:$TAG .

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully!"
    echo "Image: $IMAGE_NAME:$TAG"
    echo ""
    echo "To run the image locally:"
    echo "docker run -p 3000:3000 $IMAGE_NAME:$TAG"
    echo ""
    echo "To push to a registry (replace with your registry):"
    echo "docker tag $IMAGE_NAME:$TAG your-registry/$IMAGE_NAME:$TAG"
    echo "docker push your-registry/$IMAGE_NAME:$TAG"
else
    echo "❌ Failed to build Docker image"
    exit 1
fi 