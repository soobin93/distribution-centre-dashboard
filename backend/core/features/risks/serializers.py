from rest_framework import serializers
from .models import Risk


class RiskSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        likelihood = attrs.get('likelihood', getattr(self.instance, 'likelihood', None))
        impact = attrs.get('impact', getattr(self.instance, 'impact', None))
        rating = attrs.get('rating', getattr(self.instance, 'rating', None))

        if likelihood is not None and (likelihood < 1 or likelihood > 5):
            raise serializers.ValidationError({'likelihood': 'Likelihood must be between 1 and 5.'})
        if impact is not None and (impact < 1 or impact > 5):
            raise serializers.ValidationError({'impact': 'Impact must be between 1 and 5.'})
        if likelihood is not None and impact is not None and rating is not None:
            expected = likelihood * impact
            if rating != expected:
                raise serializers.ValidationError(
                    {'rating': f'Rating must equal likelihood * impact ({expected}).'}
                )

        return attrs

    class Meta:
        model = Risk
        fields = '__all__'
