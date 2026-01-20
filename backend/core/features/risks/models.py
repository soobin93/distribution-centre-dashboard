import uuid
from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class Risk(TimeStampedModel):
    class Status(models.TextChoices):
        OPEN = 'open', 'Open'
        MITIGATING = 'mitigating', 'Mitigating'
        CLOSED = 'closed', 'Closed'

    def generate_id() -> str:
        return f'risk-{uuid.uuid4().hex[:8]}'

    id = models.CharField(max_length=32, primary_key=True, default=generate_id)
    project = models.ForeignKey(Project, related_name='risks', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=120)
    likelihood = models.PositiveIntegerField()
    impact = models.PositiveIntegerField()
    rating = models.PositiveIntegerField()
    status = models.CharField(max_length=20, choices=Status.choices)
    owner = models.CharField(max_length=120)
    due_date = models.DateField()
    mitigation_plan = models.TextField(blank=True)

    class Meta:
        ordering = ['-rating', 'title']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.title}'
