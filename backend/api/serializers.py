from rest_framework import serializers
from .models import Pet
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

class PetSerializer(serializers.ModelSerializer):
    # Ensure pet_parent and vet fields are properly serialized
    pet_parent = CustomUserSerializer()
    primary_vet = serializers.SerializerMethodField()
    secondary_vet = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = '__all__'

    def get_primary_vet(self, obj):
        # Return the primary_vet's username and email (or any other fields you want)
        if obj.primary_vet:
            return {
                'username': obj.primary_vet.username,
            }
        return None

    def get_secondary_vet(self, obj):
        # Return the secondary_vet's username and email (or any other fields you want)
        if obj.secondary_vet:
            return {
                'username': obj.secondary_vet.username,
            }
        return None
