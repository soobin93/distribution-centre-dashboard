from rest_framework import viewsets

from .models import MediaUpdate
from .serializers import MediaUpdateSerializer


class MediaUpdateViewSet(viewsets.ModelViewSet):
    queryset = MediaUpdate.objects.all()
    serializer_class = MediaUpdateSerializer

    def get_queryset(self):
        queryset = MediaUpdate.objects.select_related('project').all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
