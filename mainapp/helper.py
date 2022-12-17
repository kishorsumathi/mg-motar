from rest_framework import serializers
from .models import voicesearch



class voiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = voicesearch
        fields = ['id', 'part_name', 'location', 'quantity']