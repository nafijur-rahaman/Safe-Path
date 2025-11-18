from rest_framework import serializers
from django.contrib.auth.models import User



#--------------user login serializer-----------------#
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)