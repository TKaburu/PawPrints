from django.db import models
from django.utils.text import slugify
from django.utils.crypto import get_random_string
from accounts.models import CustomUser

class Pet(models.Model):
    """
    This class defines a pet model.
    """

    PET_TYPE = (
        ('Dog', 'Dog'),
        ('Cat', 'Cat'),
        ('Bird', 'Bird'),
        ('Horse', 'Horse'),
        ('Cow', 'Cow'),
        ('Fish', 'Fish'),
        ('Goat', 'Goat'),
        ('Sheep', 'Sheep'),
        ('Snake', 'Snake'),
        ('Rabbit', 'Rabbit'),
        ('Other', 'Other'),
    )
    microchip_no = models.CharField(max_length=100)
    name = models.CharField(max_length=100)
    type_of_pet = models.CharField(max_length=100, choices=PET_TYPE, default='Dog')
    breed = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True, null=True)
    age = models.IntegerField()
    pet_parent_name = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='owned_pets')
    pet_parent_contact = models.CharField(max_length=100)
    primary_vet = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True,
        blank=True, related_name='primary_vets'
        )
    primary_vet_contact = models.CharField(max_length=100)
    secondary_vet = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True,
        blank=True, related_name='secondary_vets'
        )
    secondary_vet_contact = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if not self.slug:
            slug = slugify(self.name)
            if Pet.objects.filter(slug=slug).exists():
                slug = slug + '-' + get_random_string(5)
            self.slug = slug
        super(Pet, self).save(*args, **kwargs)
