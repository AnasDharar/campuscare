from django.contrib import admin
from django.urls import path, include
from tests import views
urlpatterns = [
    path('', views.test,name='test'),
]