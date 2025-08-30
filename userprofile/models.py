from django.db import models
from django.contrib.auth.models import User

class Student(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    test1 = models.FloatField(blank=True, null=True)
    test2 = models.FloatField(blank=True, null=True)
    test3 = models.FloatField(blank=True, null=True)
    test4 = models.FloatField(blank=True, null=True)
    college_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.username}'s scores"
