from django.shortcuts import render

from .models import Collection, CollectionItem, Member, Workspace
from .serializers import CollectionSerializer, CollectionItemSerializer, MemberSerializer, WorkspaceSerializer

from rest_framework import viewsets, permissions

from .permissions import IsOwnerOrReadOnly


# Create your views here.


class MembersViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    
class WorkspacesViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer

    permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                      IsOwnerOrReadOnly]

class CollectionsViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer

class CollectionsItemViewSet(viewsets.ModelViewSet):
    queryset = CollectionItem.objects.all()
    serializer_class = CollectionItemSerializer
