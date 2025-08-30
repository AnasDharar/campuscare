from django.db import models

class ChatHistory(models.Model):
    user_id = models.CharField(max_length=255, db_index=True)
    prompt = models.TextField()
    response = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['timestamp']  # chronological for display

    def __str__(self):
        return f"{self.user_id} - {self.timestamp}"
