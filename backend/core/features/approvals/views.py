import uuid
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.features.activity.models import ActivityLog
from .models import Approval
from .serializers import ApprovalSerializer


class ApprovalViewSet(viewsets.ModelViewSet):
    queryset = Approval.objects.all()
    serializer_class = ApprovalSerializer

    def get_queryset(self):
        queryset = Approval.objects.select_related('project').all()
        project_id = self.request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
        return queryset

    def _actor_name(self, request) -> str:
        if request.user and request.user.is_authenticated:
            return request.user.get_username()
        return 'System'

    def _log_activity(self, approval: Approval, action: str, note: str | None = None) -> None:
        metadata = {
            'approval_id': approval.id,
            'status': approval.status,
        }
        if note:
            metadata['note'] = note
        ActivityLog.objects.create(
            id=uuid.uuid4().hex,
            project=approval.project,
            actor=self._actor_name(self.request),
            action=action,
            entity_type=approval.entity_type,
            entity_id=approval.entity_id,
            metadata=metadata,
        )

    def _reject_transition(self, approval: Approval, allowed: set[str], action_name: str) -> Response | None:
        if approval.status not in allowed:
            return Response(
                {'detail': f'Cannot {action_name} approval when status is {approval.status}.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return None

    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        approval = self.get_object()
        invalid = self._reject_transition(
            approval,
            {Approval.Status.APPROVED, Approval.Status.REJECTED},
            'submit',
        )
        if invalid:
            return invalid
        approval.status = Approval.Status.PENDING
        if hasattr(approval, 'requested_by'):
            approval.requested_by = self._actor_name(request)
        if hasattr(approval, 'requested_at'):
            approval.requested_at = timezone.now()
        if hasattr(approval, 'reviewed_by'):
            approval.reviewed_by = None
        if hasattr(approval, 'reviewed_at'):
            approval.reviewed_at = None
        if hasattr(approval, 'decision_note'):
            approval.decision_note = ''
        approval.save()
        self._log_activity(approval, ActivityLog.Action.SUBMIT)
        return Response(self.get_serializer(approval).data)

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        approval = self.get_object()
        invalid = self._reject_transition(approval, {Approval.Status.PENDING}, 'approve')
        if invalid:
            return invalid
        approval.status = Approval.Status.APPROVED
        if hasattr(approval, 'reviewed_by'):
            approval.reviewed_by = self._actor_name(request)
        if hasattr(approval, 'reviewed_at'):
            approval.reviewed_at = timezone.now()
        decision_note = request.data.get('decision_note', '')
        if hasattr(approval, 'decision_note'):
            approval.decision_note = decision_note
        approval.save()
        self._log_activity(approval, ActivityLog.Action.APPROVE, decision_note or None)
        return Response(self.get_serializer(approval).data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        approval = self.get_object()
        invalid = self._reject_transition(approval, {Approval.Status.PENDING}, 'reject')
        if invalid:
            return invalid
        approval.status = Approval.Status.REJECTED
        if hasattr(approval, 'reviewed_by'):
            approval.reviewed_by = self._actor_name(request)
        if hasattr(approval, 'reviewed_at'):
            approval.reviewed_at = timezone.now()
        decision_note = request.data.get('decision_note', '')
        if hasattr(approval, 'decision_note'):
            approval.decision_note = decision_note
        approval.save()
        self._log_activity(approval, ActivityLog.Action.REJECT, decision_note or None)
        return Response(self.get_serializer(approval).data)
