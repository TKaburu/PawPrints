from rest_framework import serializers
from .models import Pet
from accounts.models import CustomUser
from accounts.serializers import UserSerializer

class PetSerializer(serializers.ModelSerializer):
    """
    This class serializes the Pet model.
    """
    pet_parent_name = UserSerializer(read_only=True) 
    primary_vet = UserSerializer(read_only=True)
    primary_vet_contact = serializers.CharField()
    secondary_vet = UserSerializer(read_only=True)
    secondary_vet_contact = serializers.CharField()
    
    
    pet_parent_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.all(), source='pet_parent',
        write_only=True
    )
    primary_vet_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(user_type='vet'),
        source='primary_vet', write_only=True, required=False
    )
    secondary_vet_id = serializers.PrimaryKeyRelatedField(
        queryset=CustomUser.objects.filter(user_type='vet'),
        source='secondary_vet', write_only=True, required=False
    )

    class Meta:
        model = Pet
        fields = [
            'id', 'microchip_no', 'name', 'type_of_pet', 'breed', 'slug', 'age', 'pet_parent_name', 'pet_parent_id', 
            'primary_vet', 'primary_vet_id', 'primary_vet_contact', 'secondary_vet', 'secondary_vet_id', 'secondary_vet_contact', 'created_at', 'updated_at'
        ]
        extra_kwargs = {
            'slug': {'read_only': True},
            'created_at': {'read_only': True},
            'updated_at': {'read_only': True},
        }

    def create(self, validated_data):
        pet_parent = validated_data.pop('pet_parent', None)
        primary_vet = validated_data.pop('primary_vet', None)
        secondary_vet = validated_data.pop('secondary_vet', None)
        primary_vet_contact = validated_data.pop('primary_vet_contact', None)
        secondary_vet_contact = validated_data.pop('secondary_vet_contact', None)
        # Create the pet
        pet = Pet.objects.create(
            pet_parent=pet_parent,
            primary_vet=primary_vet,
            primary_vet_contact=primary_vet_contact,
            secondary_vet=secondary_vet,
            secondary_vet_contact=secondary_vet_contact,
            **validated_data
        )
        return pet
