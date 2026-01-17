from django.db import models
from core.features.common.models import TimeStampedModel


class Project(TimeStampedModel):
    class Status(models.TextChoices):
        PLANNED = 'planned', 'Planned'
        ACTIVE = 'active', 'Active'
        ON_HOLD = 'on_hold', 'On hold'
        COMPLETE = 'complete', 'Complete'

    id = models.CharField(max_length=32, primary_key=True)
    name = models.CharField(max_length=200)
    location = models.CharField(max_length=200)
    status = models.CharField(max_length=20, choices=Status.choices)
    start_date = models.DateField()
    end_date = models.DateField()
    description = models.TextField(blank=True)
    program_name = models.CharField(max_length=120)
    phase = models.CharField(max_length=120, blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self) -> str:
        return self.name
