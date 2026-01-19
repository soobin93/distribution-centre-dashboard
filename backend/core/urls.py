from django.urls import include, path
from rest_framework.routers import DefaultRouter

from core.features.auth.views import CsrfView, LoginView, LogoutView, MeView
from core.features.activity.views import ActivityLogViewSet
from core.features.approvals.views import ApprovalViewSet
from core.features.budgets.views import BudgetItemViewSet
from core.features.documents.views import DocumentViewSet
from core.features.media_items.views import MediaItemViewSet
from core.features.milestones.views import MilestoneViewSet
from core.features.projects.views import ProjectViewSet, ProgramSummaryView
from core.features.rfis.views import RfiViewSet
from core.features.risks.views import RiskViewSet

router = DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'budgets', BudgetItemViewSet)
router.register(r'milestones', MilestoneViewSet)
router.register(r'risks', RiskViewSet)
router.register(r'rfis', RfiViewSet)
router.register(r'documents', DocumentViewSet)
router.register(r'media-items', MediaItemViewSet)
router.register(r'approvals', ApprovalViewSet)
router.register(r'activity', ActivityLogViewSet)

urlpatterns = [
    path('auth/csrf/', CsrfView.as_view(), name='csrf'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('summary/', ProgramSummaryView.as_view(), name='program-summary'),
    path('', include(router.urls)),
]
