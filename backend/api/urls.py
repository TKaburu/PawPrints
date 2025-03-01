from django.urls import path
from .views import *

urlpatterns = [
    path('pets', pets, name='pets'),
    path('pets/<slug:slug>/', pet_detail, name='pet_detail'),
    path('search/<str:search>/', petSearch, name='petSearch'),

    # ------------------------------- Pet Ownership Views ------------------------------- #
    path('register-a-pet/', RegisterPetView.as_view(), name='register_pet'),
    path('current-users-pets', PetOwnerPetsView.as_view(), name='current_users_pets'),
]