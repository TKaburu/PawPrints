from django.contrib import admin
from .models import *

class PetAdmin(admin.ModelAdmin):
    list_display = ('microchip_no', 'pet_name', 'type_of_pet', 'breed', 'age', 'pet_parent', 'pet_parent_contact', 'primary_vet', 'primary_vet_contact', 'created_at', 'updated_at')

admin.site.register(Pet, PetAdmin)
admin.site.register(TransferRequest)
