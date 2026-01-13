# Use an official Python runtime as a parent image
FROM python:3.11-slim-bookworm

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Set the working directory to /app
WORKDIR /app

# Copy the project files
COPY pyproject.toml .
# If you have a lock file, uncomment the next line
# COPY uv.lock .

# Install dependencies
RUN uv sync --frozen --no-cache || uv sync --no-cache

# Copy the rest of the application code
COPY . .

# Expose port 8000
EXPOSE 8000

# Define environment variable
ENV PATH="/app/.venv/bin:$PATH"

# Run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
