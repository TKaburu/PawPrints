from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    """
    This class defines a user.
    It extends the AbstactUser model
    """
    USER_TYPE = [
        ('pet_owner', 'Pet Owner'),
        ('vet_clinic', 'Vet Clinic'),
        ('welfare', 'Welfare'),
        ('admin', 'Admin'),
    ]
    email = models.EmailField(unique=True)
    user = models.CharField(max_length=20, choices=USER_TYPE, default='pet_owner')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        """
        String representation
        """
        return self.email
