from django.urls import path

from files.views import SignInViwe,LogInViwe,GetInofByToken,FileDetail

urlpatterns = [
    path("signin/",SignInViwe.as_view(),name="sign_in"),
    path("login/",LogInViwe.as_view(),name="log_in"),
    path("user/",GetInofByToken.as_view(),name="user"),
    path("user/file/", FileDetail.as_view(), name="file_create"),
    path("user/file/<int:file_id>/", FileDetail.as_view(), name="file_detail"),
    
]