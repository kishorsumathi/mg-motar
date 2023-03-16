from django.contrib import admin
from django.urls import path
from django.urls import re_path as url
from mainapp.views import search,home

urlpatterns = [
    #path('', LoginView.as_view(template_name='login.html'), name='login'),
    path('',home,name="home"),
    url('search',search, name='search'),
    #url('search',search, name='search'),
        
]