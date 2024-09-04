from django.urls import path
from .views import *

urlpatterns = [
    path('', pets, name='pets'),
    path('<slug:slug>/', pet_detail, name='pet_detail'),
    path('search/<str:search>/', petSearch, name='petSearch'),

]