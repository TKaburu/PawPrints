from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import registerUser, userProfile, getUser


urlpatterns = [
    # ------------------------------- Auth URLs ------------------------------- #

    path('register/', registerUser, name='register_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ------------------------------- Profile URLs ------------------------------- #
    path('get-user/', getUser, name='get-user'),
    path('profile/<str:username>/', userProfile, name='user_profile'),

]