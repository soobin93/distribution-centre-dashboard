from django.db.models import Sum
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.views import APIView

from core.features.approvals.models import Approval
from core.features.budgets.models import BudgetItem
from core.features.milestones.models import Milestone
from core.features.risks.models import Risk

from .models import Project
from .serializers import ProjectSerializer


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer


class ProgramSummaryView(APIView):
    def get(self, request):
        budget_totals = BudgetItem.objects.aggregate(
            total_original=Sum('original_budget'),
            total_variations=Sum('approved_variations'),
            total_forecast=Sum('forecast_cost'),
            total_actual=Sum('actual_spent'),
        )
        milestones_total = Milestone.objects.count()
        milestones_done = Milestone.objects.filter(status=Milestone.Status.DONE).count()
        open_risks = Risk.objects.exclude(status=Risk.Status.CLOSED).count()
        pending_approvals = Approval.objects.filter(status=Approval.Status.PENDING).count()

        def safe_total(value):
            return float(value or 0)

        payload = {
            'total_original_budget': safe_total(budget_totals['total_original']),
            'total_variations': safe_total(budget_totals['total_variations']),
            'total_forecast_cost': safe_total(budget_totals['total_forecast']),
            'total_actual_spend': safe_total(budget_totals['total_actual']),
            'milestones_completed': {
                'completed': milestones_done,
                'total': milestones_total,
            },
            'open_risks': open_risks,
            'pending_approvals': pending_approvals,
        }
        return Response(payload)
