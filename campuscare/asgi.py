import os
from django.core.asgi import get_asgi_application
from fastapi import FastAPI
from chatbot.backend.main import app as chatbot_app   # ✅ Import your chatbot FastAPI app

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "campuscare.settings")

# Django app
django_app = get_asgi_application()

# Root ASGI app
app = FastAPI(title="CampusCare Combined App")

# Mount Django at /django
app.mount("/django", django_app)

# Mount Chatbot FastAPI app at /api
app.mount("/api", chatbot_app)
