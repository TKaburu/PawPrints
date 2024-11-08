from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.crypto import get_random_string
from django.utils.text import slugify

class CustomUser(AbstractUser):
    """
    This class defines a user.
    It extends the AbstactUser model
    """
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.username
    

class PetOwner(models.Model):
    """
    This class defines a pet owner.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='pet_owner_profile')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            slug = slugify(self.user.username)
            if PetOwner.objects.filter(slug=slug).exists():
                slug = slug + '-' + get_random_string(5)
            self.slug = slug
        super(PetOwner, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username
    
class Vet(models.Model):
    """
    Vet profile extending the CustomUser model.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vet_profile')
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    vet_clinic = models.ForeignKey('VetClinic', on_delete=models.SET_NULL, related_name='vet_clinic', blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            slug = slugify(self.user.username)
            if Vet.objects.filter(slug=slug).exists():
                slug = slug + '-' + get_random_string(5)
            self.slug = slug
        super(Vet, self).save(*args, **kwargs)

    def __str__(self):
        return self.user.username

class VetClinic(models.Model):
    """
    This model defines the Vet Clinic model for the application.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='vet_clinic_profile')
    clinic_name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    confirm_password = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        This method is used to save the Vet Clinic model.
        """
        if not self.slug:
            slug = slugify(self.clinic_name)
            if VetClinic.objects.filter(slug=slug).exists():
                slug = slug + '-' + get_random_string(5)
            self.slug = slug
        super(VetClinic, self).save(*args, **kwargs)

    def __str__(self):
        """
        This method is used to return the string representation of the Vet Clinic model.
        """
        return self.clinic_name

class WelfareOrg(models.Model):
    """
    This model defines the Welfare Organization model for the application.
    """
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='welfare_org_profile')
    org_name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True, null=True)
    address = models.TextField()
    phone = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    confirm_password = models.CharField(max_length=255)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        """
        This method is used to save the Welfare Organization model.
        """
        if not self.slug:
            slug = slugify(self.org_name)
            if WelfareOrg.objects.filter(slug=slug).exists():
                slug = slug + '-' + get_random_string(5)
            self.slug = slug
        super(WelfareOrg, self).save(*args, **kwargs)

    def __str__(self):
        return self.org_name