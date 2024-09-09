from django.urls import path
from .views import *

urlpatterns = [
    path('', pets, name='pets'),
    path('pets/<slug:slug>/', pet_detail, name='pet_detail'),
    # ------------------------------- Dashboard Views ------------------------------- #
    
    path('search/<str:search>/', petSearch, name='petSearch'),

    # ------------------------------- Pet Ownership Views ------------------------------- #
    path('transfer-pet-ownership/<slug:slug>/', transferPetOwnership, name='transfer_pet_ownership'),

]