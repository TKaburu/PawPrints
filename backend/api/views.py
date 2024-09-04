from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import *
from .serializers import *

@api_view(['GET', 'POST'])
def pets(request):
    """
    This function returns a list of all pets in the database or creates a new pet.
    """
    if request.method == 'GET':
        pets = Pet.objects.all()
        serializer = PetSerializer(pets, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PetSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)


@api_view(['GET', 'PUT', 'DELETE'])
def pet_detail(request, slug):
    """
    This function retrieves, updates, or deletes a pet instance.
    args:
        slug: str
    """
    try:
        pet = Pet.objects.get(slug=slug)
    except Pet.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = PetSerializer(pet)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = PetSerializer(pet, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        pet.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    else:
        return Response(status=status.HTTP_405_METHOD_NOT_ALLOWED)
    

@api_view(['GET'])
def petSearch(request, search):
    """
    This function searches for a pet by name.
    args:
        search: str
    """
    if request.method == 'GET':
        if search:
            pets = Pet.objects.filter(microchip_no__icontains=search)
            if pets.exists():
                serializer = PetSerializer(pets, many=True)
                return Response(serializer.data)
            else:
                return Response(
                    {'error': 'No pet with that number found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(
                {'error': 'Please provide a microchip number'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

