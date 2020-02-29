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


class IsCollectionItemWorkspaceMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Only workspace members will have read/write access
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False
        print('IsCollectionItemWorkspaceMember', member)
        return member in obj.collection.workspace.members.all()


class IsCollectionWorkspaceMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        print('IsCollectionWorkspaceMember', member)
        return member in obj.workspace.members.all()


class IsWorkspaceMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        try:
            member = Member.objects.get(id=request.user.id)
        except Member.DoesNotExist:
            return False

        print('isWorkspaceMember', member.id, obj.id)
        return member.id == obj.id
