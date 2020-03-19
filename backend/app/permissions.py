#!/usr/bin/env python3

# FROM: https://www.django-rest-framework.org/tutorial/4-authentication-and-permissions/
from rest_framework import permissions

from .models import Collection, CollectionItem, Member, Workspace


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.owner == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        else:
            return request.user.is_staff


# IsCollectionItemWorkspaceMember is used to make sure
# that when an item is added only workspace members of
# the given collection can add items. If we didn't
# do this check, non-members of a workspace could
# still add items to a collection of that workspace.
class IsCollectionItemWorkspaceMember(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            collection = Collection.objects.get(pk=view.kwargs['pk'])
        except Collection.DoesNotExist:
            return False
        # Only workspace members of the collection will have read/write access
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False
        return member in collection.workspace.members.all()


# IsCollectionItemMember is used to make sure
# that when an item is added only members of
# the given collection can add items. If we didn't
# do this check, non-members of a collection could
# still add items to a collection.
class IsCollectionItemMember(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            collection = Collection.objects.get(pk=view.kwargs['pk'])
        except Collection.DoesNotExist:
            return False
        # Only workspace members of the collection will have read/write access
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False
        return member in collection.members.all()


# IsItemCollectionWorkspaceMember is used
# by the CollectionsViewSet to make sure that
# when a collection is attempted to be created
# the requesting user member is part of the workspace
# it attempts to create it in.
class IsItemCollectionWorkspaceMember(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            item = CollectionItem.objects.get(pk=view.kwargs['pk'])
        except CollectionItem.DoesNotExist:
            return False

        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        return item.collection.workspace.members.filter(id=member.id).exists()


class IsItemCollectionMember(permissions.BasePermission):
    def has_permission(self, request, view):
        try:
            item = CollectionItem.objects.get(pk=view.kwargs['pk'])
        except CollectionItem.DoesNotExist:
            return False

        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        return item.collection.members.filter(id=member.id).exists()


# IsCollectionWorkspaceMember is used
# by the CollectionsViewSet to make sure that
# when a collection is attempted to be created
# the requesting user member is part of the workspace
# it attempts to create it in.
class IsCollectionWorkspaceMember(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        if request.method in permissions.SAFE_METHODS:
            try:
                collection = Collection.objects.get(pk=view.kwargs['pk'])
            except Collection.DoesNotExist:
                return False
            return collection.workspace.members.filter(id=member.id).exists()

        # request.data is expected to be
        # { "name": <collection name>, "workspace": { "name": <workspace_name> } }
        # That is, the data used to describe a new collection to
        # be created.
        workspace_name = request.data['workspace']['name']
        try:
            workspace = Workspace.objects.get(name=workspace_name)
        except Workspace.DoesNotExist:
            return False

        return member.part_of_workspaces.filter(id=workspace.id).exists()


# IsCollectionMember is used to make sure
# that collections are non readable by non-joined members
# UNLESS they want to create a new collection
class IsCollectionMember(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        if request.method in permissions.SAFE_METHODS:
            try:
                collection = Collection.objects.get(pk=view.kwargs['pk'])
            except Collection.DoesNotExist:
                return False
            return collection.members.filter(id=member.id).exists()

        # We want the member to be able to create new collections
        # without being a member (of course), but not to update it
        # leave checking if they belong to the workspace
        # to IsCollectionWorkspaceMember
        if request.method in ('POST', 'PUT'):
            return True


# IsCurrentMember is used to limit access to the /members/<username>
# page. We only want the user itself to access that page, as
# it displays all the collections and workspaces it is part of
#  - sensitive information.
class IsCurrentMember(permissions.DjangoObjectPermissions):
    def has_object_permission(self, request, view, obj):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        return member.id == obj.id


# IsWorkspaceOwner is used to limit access to workspace-owner
# only action
class IsWorkspaceOwner(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        try:
            workspace = Workspace.objects.get(pk=view.kwargs['pk'])
        except Workspace.DoesNotExist:
            return False
        return workspace.owner == member


# IsWorkspaceMember is used to limit access to member-only actions
class IsWorkspaceMember(permissions.DjangoObjectPermissions):
    def has_permission(self, request, view):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        print(member)
        print(member.part_of_workspaces.all())
        return member.part_of_workspaces.filter(pk=view.kwargs['pk']).exists()
