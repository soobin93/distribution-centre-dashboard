from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class Milestone(TimeStampedModel):
    class Status(models.TextChoices):
        DONE = 'done', 'Done'
        IN_PROGRESS = 'in_progress', 'In progress'
        AT_RISK = 'at_risk', 'At risk'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='milestones', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    planned_date = models.DateField()
    actual_date = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices)
    percent_complete = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['planned_date']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.name}'
