from .models import Tip
from rest_framework import serializers




class TipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tip
        fields = ['id', 'created_by', 'title', 'description', 'created_at', 'updated_at']