from rest_framework import viewsets

from .models import BudgetItem
from .serializers import BudgetItemSerializer


class BudgetItemViewSet(viewsets.ModelViewSet):
    queryset = BudgetItem.objects.all()
    serializer_class = BudgetItemSerializer

    def get_queryset(self):
        queryset = BudgetItem.objects.select_related('project').all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset
