from rest_framework import serializers
from .models import Milestone


class MilestoneSerializer(serializers.ModelSerializer):
    def validate_percent_complete(self, value):
        if value < 0 or value > 100:
            raise serializers.ValidationError('percent_complete must be between 0 and 100.')
        return value

    class Meta:
        model = Milestone
        fields = '__all__'
