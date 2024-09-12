from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *


urlpatterns = [
    # ------------------------------- Auth URLs ------------------------------- #

    path('register/', registerUser, name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ------------------------------- Profile URLs ------------------------------- #
    path('get-user/', getUser, name='get-user'),
    path('user-dashboard/', userDashboard, name='user_dashboard'),
    path('profile/', userProfile, name='user_profile'),
    path('pet-owner-dashboard/<str:username>/', pet_owner_dashboard, name='pet_owner_dashboard'),
    path('check-user/', checkUserExists, name='check_user_exists'),

]