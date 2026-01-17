from rest_framework import viewsets

from .models import Rfi
from .serializers import RfiSerializer


class RfiViewSet(viewsets.ModelViewSet):
    queryset = Rfi.objects.all()
    serializer_class = RfiSerializer

    def get_queryset(self):
        queryset = Rfi.objects.select_related('project').all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
