from django.dispatch import receiver
from allauth.account.signals import user_signed_up
from django.contrib.auth.models import User
from .models import Student

@receiver(user_signed_up)
def create_student_on_signup(request, user, **kwargs):
    """
    Automatically create a Student object when a new user signs up via social login.
    """
    # Only create if the Student doesn't already exist
    if not hasattr(user, 'student'):
        Student.objects.create(
            user=user,
            test1=0.0,
            test2=0.0,
            test3=0.0,
            test4=0.0
        )
