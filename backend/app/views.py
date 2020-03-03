from django.shortcuts import render
from django.http import Http404
from django.shortcuts import get_object_or_404

from .models import Collection, CollectionItem, Member, Workspace
from .serializers import CollectionSerializer, CollectionItemSerializer
from .serializers import MemberSerializer, WorkspaceSerializer

from rest_framework import viewsets, permissions, status, generics
from rest_framework.generics import GenericAPIView
from rest_framework.mixins import UpdateModelMixin
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .permissions import IsOwnerOrReadOnly, IsAdminOrReadOnly
from .permissions import IsCollectionItemWorkspaceMember
from .permissions import IsCollectionWorkspaceMember
from .permissions import IsItemCollectionWorkspaceMember
#from .permissions import IsWorkspaceMember
from .permissions import IsCurrentMember


class MembersViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer


class WorkspacesViewSet(viewsets.ModelViewSet):
    queryset = Workspace.objects.all()
    serializer_class = WorkspaceSerializer

    # FIXME
    # permission_classes = (IsWorkspaceMember,)

    def perform_create(self, serializer):
        serializer.save(owner=Member.objects.get(id=self.request.user.id))


# TODO: Limit to collections the logged in user
# should have access to.
class CollectionsViewSet(viewsets.ModelViewSet):
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = (IsCollectionWorkspaceMember, )

    def perform_create(self, serializer):
        serializer.save(created_by=Member.objects.get(id=self.request.user.id))


class CollectionsItemViewSet(viewsets.ModelViewSet):
    queryset = CollectionItem.objects.all()
    serializer_class = CollectionItemSerializer


@api_view([
    'PUT',
    'DELETE',
])
@permission_classes([IsAuthenticated])
def workspace_collection(request, pk):
    try:
        workspace = Workspace.objects.get(pk=pk)
        member = Member.objects.get(pk=request.user.pk)

        if request.method == 'PUT':
            serializer = CollectionSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(created_by=member)
                data = {
                    'success': 'created collection',
                    'collection': serializer.data
                }
                return Response(data=data)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            try:
                collection = Collection.objects.get_or_create(pk=pk)

                operation = collection.delete()
                if operation_succes:
                    data = {'success': 'deleted collection'}
                    return Response(data=data)
                data = {'failure': 'failed to delete collection'}
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
            except Collection.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(data={'failure': 'not logged in or something'},
                        status=status.HTTP_400_BAD_REQUEST)


@api_view([
    'PUT',
    'DELETE',
])
@permission_classes([IsAuthenticated, IsCollectionItemWorkspaceMember])
def collection_item(request, pk):
    try:
        member = Member.objects.get(pk=request.user.pk)

        if request.method == 'PUT':
            serializer = CollectionItemSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(collection=Collection.objects.get(pk=pk),
                                added_by=member)
                data = {'success': 'added item', 'item': serializer.data}
                return Response(data=data)
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

        elif request.method == 'DELETE':
            try:
                item = CollectionItem.objects.get_or_create(pk=pk)

                operation = item.delete()
                if operation_succes:
                    data = {'success': 'deleted item'}
                    return Response(data=data)
                data = {'failure': 'failed to delete item'}
                return Response(data=data, status=status.HTTP_400_BAD_REQUEST)
            except CollectionItem.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
    except:
        return Response(data={'failure': 'not logged in or something'},
                        status=status.HTTP_400_BAD_REQUEST)


class CollectionItemDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = CollectionItem.objects.all()
    serializer_class = CollectionItemSerializer
    permission_classes = (IsItemCollectionWorkspaceMember, )


class MemberDetail(generics.RetrieveAPIView):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    permission_classes = (IsCurrentMember, )

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        for field in ['username']:
            filter[field] = self.kwargs[field]

        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj
