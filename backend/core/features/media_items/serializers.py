from rest_framework import serializers
from .models import MediaItem


class MediaItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaItem
        fields = '__all__'
