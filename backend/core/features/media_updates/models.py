from django.db import models
from core.features.common.models import TimeStampedModel
from core.features.projects.models import Project


class MediaUpdate(TimeStampedModel):
    class MediaType(models.TextChoices):
        PHOTO = 'photo', 'Photo'
        UPDATE = 'update', 'Update'
        CAMERA_FEED = 'camera_feed', 'Camera feed'

    id = models.CharField(max_length=32, primary_key=True)
    project = models.ForeignKey(Project, related_name='media_updates', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    media_url = models.URLField()
    captured_at = models.DateTimeField()
    uploaded_by = models.CharField(max_length=120)

    class Meta:
        ordering = ['-captured_at']

    def __str__(self) -> str:
        return f'{self.project_id} · {self.title}'
