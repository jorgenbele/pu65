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

from app.views import CollectionsViewSet, CollectionsItemViewSet, \
    MembersViewSet, WorkspacesViewSet

from app.views import logout
from app.views import collection_item, collection_join, collection_leave
from app.views import collection_invite
from app.views import workspace_collection, CollectionItemDetail
from app.views import MemberDetail
from app.views import create_user
from app.views import workspace_invite, workspace_leave

from rest_framework.authtoken.views import obtain_auth_token

router = routers.DefaultRouter()
#router.register(r'members', MembersViewSet)
router.register(r'workspaces', WorkspacesViewSet, basename='workspaces')
router.register(r'collections', CollectionsViewSet, basename='collections')
#router.register(r'items', CollectionsItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls, name='admin'),
    path(r'collections/<int:pk>/item/',
         collection_item,
         name='collections_item'),
    path(r'collections/<int:pk>/join/',
         collection_join,
         name='collections_join'),
    path(r'collections/<int:pk>/leave/',
         collection_leave,
         name='collections_leave'),
    path(r'collections/<int:pk>/invite/<str:username>/',
         collection_invite,
         name='collections_invite'),
    path(r'items/<int:pk>/', CollectionItemDetail.as_view(),
         name='item_by_id'),
    path(r'members/<str:username>/',
         MemberDetail.as_view(),
         name='member_detail'),
    path(r'workspaces/<int:pk>/collection/',
         workspace_collection,
         name='workspace_collection'),
    path(r'create_user/', create_user, name='create_user'),
    path(r'workspaces/<int:pk>/invite/<str:username>/',
         workspace_invite,
         name='workspace_invite'),
    path(r'workspaces/<int:pk>/leave/',
         workspace_leave,
         name='workspace_leave'),

    # TODO
    # path(r'workspaces/<int:pk>/admin/create_join_code',
    #      workspace_create_join_code,
    #      name='workspace_create_join_code'),

    # path(r'workspaces/join/<int:join_code>',
    #      workspace_join_by_code,
    #      name='workspace_join_by_code'),
    path(r'logout/', logout, name='logout'),
    path('api-token-auth/', obtain_auth_token, name='auth_token'),
    path('api-auth/', include('rest_framework.urls',
                              namespace='rest_framework'))
]
