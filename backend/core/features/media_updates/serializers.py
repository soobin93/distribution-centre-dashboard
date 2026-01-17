from rest_framework import serializers
from .models import MediaUpdate


class MediaUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaUpdate
        fields = '__all__'
