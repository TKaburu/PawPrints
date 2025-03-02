from rest_framework import serializers
from .models import Pet
from accounts.models import CustomUser
from accounts.serializers import CustomUserSerializer

class PetSerializer(serializers.ModelSerializer):
    # Instead of CustomUserSerializer for pet_parent, accept just the user ID
    pet_parent = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all())
    primary_vet = serializers.SerializerMethodField()
    secondary_vet = serializers.SerializerMethodField()

    class Meta:
        model = Pet
        fields = '__all__'

    def get_primary_vet(self, obj):
        if obj.primary_vet:
            return {
                'username': obj.primary_vet.username,
            }
        return None

    def get_secondary_vet(self, obj):
        if obj.secondary_vet:
            return {
                'username': obj.secondary_vet.username,
            }
        return None
