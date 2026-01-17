from django.contrib import admin

from core.features.activity.models import ActivityLog
from core.features.approvals.models import Approval
from core.features.budgets.models import BudgetItem
from core.features.documents.models import Document
from core.features.media_updates.models import MediaUpdate
from core.features.milestones.models import Milestone
from core.features.projects.models import Project
from core.features.rfis.models import Rfi
from core.features.risks.models import Risk


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'status', 'start_date', 'end_date', 'program_name')
    search_fields = ('name', 'location', 'program_name')
    list_filter = ('status', 'program_name')


@admin.register(BudgetItem)
class BudgetItemAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'category', 'forecast_cost', 'actual_spent', 'status')
    list_filter = ('status', 'currency')
    search_fields = ('category', 'cost_code', 'project__name')


@admin.register(Milestone)
class MilestoneAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'name', 'planned_date', 'status', 'percent_complete')
    list_filter = ('status',)
    search_fields = ('name', 'project__name')


@admin.register(Risk)
class RiskAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'title', 'rating', 'status', 'owner', 'due_date')
    list_filter = ('status', 'category')
    search_fields = ('title', 'project__name', 'owner')


@admin.register(Rfi)
class RfiAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'rfi_number', 'title', 'status', 'due_date')
    list_filter = ('status',)
    search_fields = ('rfi_number', 'title', 'project__name')


@admin.register(Document)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'title', 'doc_type', 'status', 'version')
    list_filter = ('doc_type', 'status')
    search_fields = ('title', 'project__name')


@admin.register(MediaUpdate)
class MediaUpdateAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'title', 'media_type', 'captured_at', 'uploaded_by')
    list_filter = ('media_type',)
    search_fields = ('title', 'project__name')


@admin.register(Approval)
class ApprovalAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'entity_type', 'status', 'requested_by', 'requested_at')
    list_filter = ('status', 'entity_type')
    search_fields = ('entity_id', 'project__name')


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    list_display = ('id', 'project', 'actor', 'action', 'entity_type', 'created_at')
    list_filter = ('action', 'entity_type')
    search_fields = ('actor', 'entity_id', 'project__name')
