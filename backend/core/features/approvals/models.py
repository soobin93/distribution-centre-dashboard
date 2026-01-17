from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class Approval(TimeStampedModel):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Pending'
        APPROVED = 'approved', 'Approved'
        REJECTED = 'rejected', 'Rejected'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='approvals', on_delete=models.CASCADE)
    entity_type = models.CharField(max_length=120)
    entity_id = models.CharField(max_length=60)
    status = models.CharField(max_length=20, choices=Status.choices)
    requested_by = models.CharField(max_length=120)
    requested_at = models.DateTimeField()
    reviewed_by = models.CharField(max_length=120, null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    decision_note = models.TextField(blank=True)

    class Meta:
        ordering = ['-requested_at']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.entity_type} {self.entity_id}'
