from .models import Tip
from rest_framework import serializers




class TipSerializer(serializers.ModelSerializer):
    created_by = serializers.StringRelatedField(read_only=True)  # shows username

    class Meta:
        model = Tip
        fields = ['id', 'title', 'description', 'created_by', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_by', 'created_at', 'updated_at']
