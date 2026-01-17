from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class Document(TimeStampedModel):
    class DocType(models.TextChoices):
        PLAN = 'plan', 'Plan'
        APPROVAL = 'approval', 'Approval'
        REPORT = 'report', 'Report'
        OTHER = 'other', 'Other'

    class Status(models.TextChoices):
        DRAFT = 'draft', 'Draft'
        APPROVED = 'approved', 'Approved'
        SUPERSEDED = 'superseded', 'Superseded'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='documents', on_delete=models.CASCADE)
    doc_type = models.CharField(max_length=20, choices=DocType.choices)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    file_url = models.URLField()
    version = models.CharField(max_length=40)
    status = models.CharField(max_length=20, choices=Status.choices)
    uploaded_by = models.CharField(max_length=120)
    uploaded_at = models.DateTimeField()

    class Meta:
        ordering = ['-uploaded_at']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.title}'
