from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class Rfi(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        ANSWERED = 'answered', 'Answered'
        CLOSED = 'closed', 'Closed'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='rfis', on_delete=models.CASCADE)
    rfi_number = models.CharField(max_length=40)
    title = models.CharField(max_length=200)
    question = models.TextField()
    status = models.CharField(max_length=20, choices=Status.choices)
    raised_by = models.CharField(max_length=120)
    raised_at = models.DateTimeField()
    due_date = models.DateField()
    responded_at = models.DateTimeField(null=True, blank=True)
    response_summary = models.TextField(blank=True)

    class Meta:
        ordering = ['-raised_at']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.rfi_number}'
