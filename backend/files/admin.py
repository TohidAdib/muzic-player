from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from files.models import File

class FileInline(admin.TabularInline):
    model = File
    fields = ["id","title","file"]
    extra = 1

class AdminUser(BaseUserAdmin):
    inlines = [FileInline]

admin.site.unregister(User)
admin.site.register(User,AdminUser)
