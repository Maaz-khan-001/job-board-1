from django.contrib import admin
from .models import Company, Job, Application, Interview


@admin.register(Company) # register the company in django admin
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'website', 'created_at']
    search_fields = ['name', 'description']
    list_filter = ['created_at']


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'employment_type', 'status', 'created_at']
    list_filter = ['employment_type', 'experience_level', 'status', 'remote_allowed']
    search_fields = ['title', 'description', 'company__name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ['applicant', 'job', 'status', 'applied_at']
    list_filter = ['status', 'applied_at']
    search_fields = ['applicant__username', 'job__title', 'job__company__name']
    readonly_fields = ['applied_at', 'updated_at']


@admin.register(Interview)
class InterviewAdmin(admin.ModelAdmin):
    list_display = ['application', 'interview_type', 'scheduled_at', 'status']
    list_filter = ['interview_type', 'status', 'scheduled_at']
    readonly_fields = ['created_at']