from django.contrib import admin
from django.urls import path, include
from userprofile import views
urlpatterns = [
    path('', views.dashboard, name='dashboard'),
]