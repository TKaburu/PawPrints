from django.db import models
from django.utils.text import slugify
from accounts.models import *

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
    microchip_no = models.CharField(max_length=100, unique=True)
    pet_name = models.CharField(max_length=100)
    type_of_pet = models.CharField(max_length=100, choices=PET_TYPE, default='Dog')
    breed = models.CharField(max_length=100, blank=True, null=True)
    slug = models.SlugField(unique=True, blank=True, null=True)
    age = models.IntegerField()
    pet_parent = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='pet_owner')
    pet_parent_contact = models.CharField(max_length=100)
    primary_vet = models.ForeignKey(
        CustomUser, on_delete=models.SET_NULL, null=True,
        blank=True, related_name='primary_vets'
    )
    primary_vet_contact = models.CharField(max_length=100)
    # secondary_vet = models.ForeignKey(
    #     CustomUser, on_delete=models.SET_NULL, null=True,
    #     blank=True, related_name='secondary_vets'
    # )
    # secondary_vet_contact = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_transfer_status(self):
        # Check if there is a pending transfer for this pet
        transfer_request = TransferRequest.objects.filter(pet=self, status='pending').first()
        return transfer_request.status if transfer_request else 'none'

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.pet_name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.pet_name
    

class TransferRequest(models.Model):
    """
    This class defines a transfer request model.
    """

    STATUS = (
        ('pending', 'pending'),
        ('approved', 'approved'),
        ('rejected', 'rejected'),
    )

    pet = models.ForeignKey(Pet, on_delete=models.CASCADE)
    current_owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="current_owner")
    new_owner_email = models.EmailField()
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transfer Request for {self.pet.pet_name} - {self.status}"
    
    def save(self, *args, **kwargs):
        # Check if this is an existing object being updated to 'approved'
        if self.pk and self.status == 'approved':
            # Get the previous state of the object
            old_obj = TransferRequest.objects.get(pk=self.pk)
            
            # If status changed from 'pending' to 'approved'
            if old_obj.status != 'approved':
                try:
                    # Find the new owner by email
                    new_owner = CustomUser.objects.get(email=self.new_owner_email)
                    
                    # Update the pet's owner
                    self.pet.pet_parent = new_owner
                    self.pet.save()
                except CustomUser.DoesNotExist:
                    # If the new owner doesn't exist, revert to pending
                    self.status = 'pending'
        
        super().save(*args, **kwargs)
