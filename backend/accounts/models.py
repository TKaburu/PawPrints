from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    This class defines a user.
    It extends the AbstactUser model
    """
    USER_TYPE = (
        ('pet_owner', 'Pet Owner'),
        ('vet', 'Vet'),

    )
    email = models.EmailField()
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    user_type = models.CharField(max_length=10, choices=USER_TYPE, default='Pet Owner')
