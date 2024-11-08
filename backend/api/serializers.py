from rest_framework import serializers
from .models import Pet

class PetSerializer(serializers.ModelSerializer):
    pet_parent_name = serializers.CharField(source='pet_parent.first_name', read_only=True)
    primary_vet_name = serializers.CharField(source='primary_vet.first_name', read_only=True, allow_null=True)
    secondary_vet_name = serializers.CharField(source='secondary_vet.first_name', read_only=True, allow_null=True)
    vet_clinic_name = serializers.CharField(source='vet_clinic.clinic_name', read_only=True, allow_null=True)
    clinic_contact = serializers.CharField(source='vet_clinic.phone', read_only=True, allow_null=True)

    class Meta:
        model = Pet
        fields = [
            'id', 'microchip_no', 'name', 'type_of_pet', 'breed', 'slug', 'age', 
            'pet_parent_name', 'vet_clinic', 'vet_clinic_name', 'clinic_contact',
            'primary_vet', 'primary_vet_name', 'secondary_vet', 'secondary_vet_name'
        ]

    def create(self, validated_data):
        pet = Pet.objects.create(**validated_data)
        return pet
