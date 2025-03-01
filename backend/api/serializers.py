from rest_framework import serializers
from .models import Pet
from accounts.models import *

class PetSerializer(serializers.ModelSerializer):
    # Ensure primary_vet and secondary_vet only accept users with 'vet_clinic' user_type
    primary_vet = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='vet_clinic'), required=False)
    secondary_vet = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.filter(user_type='vet_clinic'), required=False)

    class Meta:
        model = Pet
        fields = '__all__'
