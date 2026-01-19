from rest_framework import serializers
from .models import BudgetItem


class BudgetItemSerializer(serializers.ModelSerializer):
    def validate(self, attrs):
        fields = ['original_budget', 'approved_variations', 'forecast_cost', 'actual_spent']
        for field in fields:
            value = attrs.get(field, getattr(self.instance, field, None))
            if value is not None and value < 0:
                raise serializers.ValidationError({field: f'{field} must not be negative.'})
        return attrs

    class Meta:
        model = BudgetItem
        fields = '__all__'
