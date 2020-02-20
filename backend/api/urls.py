"""api URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls import include
from django.urls import path
from django.contrib.auth.models import User
from django.contrib import admin
from rest_framework import routers, serializers, viewsets

from app.views import CollectionsViewSet, CollectionsItemViewSet, MembersViewSet, WorkspacesViewSet

from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
router.register(r'members', MembersViewSet)
router.register(r'workspaces', WorkspacesViewSet)
router.register(r'collections', CollectionsViewSet)
router.register(r'items', CollectionsItemViewSet)
# register views here
#router.register(r'users', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
    #url(r'admin/', admin.site.urls, name='admin'),
    path('api-token-auth/', obtain_auth_token),
    path('api-auth/', include('rest_framework.urls',
                              namespace='rest_framework'))
]
