from rest_framework import serializers
from .models import Report,Location



#--------------location serializer-----------------#
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ['id', 'latitude', 'longitude', 'display_name']
        
        
        
        
        
#--------------report serializer-----------------#  
class ReportSerializer(serializers.ModelSerializer):
    location = LocationSerializer()

    class Meta:
        model = Report
        fields = [
            'id',
            'incident_type',
            'description',
            'date_time',
            'location',
            'submitted_at',
            'status',
            'assigned_ngo',
        ]

    def create(self, validated_data):
        location_data = validated_data.pop('location')
        location = Location.objects.create(**location_data)
        report = Report.objects.create(location=location, **validated_data)
        return report