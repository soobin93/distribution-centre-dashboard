from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class ActivityLog(TimeStampedModel):
    class Action(models.TextChoices):
        SUBMIT = 'submit', 'Submit'
        APPROVE = 'approve', 'Approve'
        REJECT = 'reject', 'Reject'
        UPDATE = 'update', 'Update'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='activity_logs', on_delete=models.CASCADE)
    actor = models.CharField(max_length=120)
    action = models.CharField(max_length=20, choices=Action.choices)
    entity_type = models.CharField(max_length=120)
    entity_id = models.CharField(max_length=60)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.entity_type} {self.entity_id}'
