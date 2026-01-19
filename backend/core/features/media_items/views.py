from rest_framework import viewsets

from .models import MediaItem
from .serializers import MediaItemSerializer


class MediaItemViewSet(viewsets.ModelViewSet):
    queryset = MediaItem.objects.all()
    serializer_class = MediaItemSerializer

    def get_queryset(self):
        queryset = MediaItem.objects.select_related('project').all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
