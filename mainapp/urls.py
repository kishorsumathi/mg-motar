from django.contrib import admin
from django.urls import path
from mainapp.views import search

urlpatterns = [
    #path('', LoginView.as_view(template_name='login.html'), name='login'),
    path('',search,name="search"),]