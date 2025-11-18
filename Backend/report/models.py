
from django.db import models


class Location(models.Model):
    latitude = models.FloatField()
    longitude = models.FloatField()
    display_name = models.CharField(max_length=255)

class Report(models.Model):
    INCIDENT_TYPES = [
        ('verbal', 'Verbal Harassment'),
        ('physical_assault', 'Physical Assault'),
        ('stalking', 'Stalking'),
        ('discrimination', 'Discrimination'),
        ('unsafe_area', 'Unsafe Area'),
        ('other', 'Other'),
        
    ]

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('solved', 'Solved'),
        ('rejected', 'Rejected'),
    ]

    incident_type = models.CharField(max_length=50, choices=INCIDENT_TYPES)
    description = models.TextField()
    date_time = models.DateTimeField()
    location = models.ForeignKey(Location, on_delete=models.CASCADE, related_name='reports')
    submitted_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    assigned_ngo = models.CharField(max_length=100, blank=True, null=True)

