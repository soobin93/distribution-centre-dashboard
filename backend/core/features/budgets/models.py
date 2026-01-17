from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class BudgetItem(TimeStampedModel):
    class Status(models.TextChoices):
        ON_TRACK = 'on_track', 'On track'
        AT_RISK = 'at_risk', 'At risk'
        OFF_TRACK = 'off_track', 'Off track'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='budget_items', on_delete=models.CASCADE)
    category = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    original_budget = models.DecimalField(max_digits=14, decimal_places=2)
    approved_variations = models.DecimalField(max_digits=14, decimal_places=2)
    forecast_cost = models.DecimalField(max_digits=14, decimal_places=2)
    actual_spent = models.DecimalField(max_digits=14, decimal_places=2)
    currency = models.CharField(max_length=3, default='AUD')
    cost_code = models.CharField(max_length=40, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices)

    class Meta:
        ordering = ['category']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.category}'
