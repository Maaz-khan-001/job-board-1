from django.contrib import admin
from .models import UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'user_type', 'location', 'experience_years', 'created_at']
    list_filter = ['user_type', 'experience_years', 'created_at']
    search_fields = ['user__username', 'user__email', 'location', 'skills']
    readonly_fields = ['created_at', 'updated_at']