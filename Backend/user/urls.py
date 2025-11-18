from django.urls import path
from .views import UserLoginView


urlpatterns = [
    path('user/login/', UserLoginView.as_view(), name='user-login'),
]
