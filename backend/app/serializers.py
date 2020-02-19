from django.contrib.auth.models import User, Group
from rest_framework import serializers

from .models import Collection, CollectionItem, Member, Workspace


class WorkspaceMemberSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = Member
        fields = ['username', 'id']


class WorkspaceSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    owner = serializers.PrimaryKeyRelatedField(read_only=True)
    members = serializers.SerializerMethodField()
    collections = serializers.SerializerMethodField()

    # get a dict {member_pk: member_username, ...}
    def get_members(self, workspace):
        return {m.pk: m.username for m in workspace.members.all()}

    # get a dict {member_pk: member_username, ...}
    def get_collections(self, workspace):
        return {c.pk: c.name for c in workspace.collections.all()}

    class Meta:
        model = Workspace
        fields = ['name', 'owner', 'members', 'id', 'collections']


class MemberSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)

    workspaces = serializers.SerializerMethodField()

    # get a dict {member_pk: member_username, ...}
    def get_workspaces(self, member):
        return {w.pk: w.name for w in member.part_of_workspaces.all()}

    class Meta:
        model = Member
        fields = ['id', 'username', 'workspaces']


class CollectionItemSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    added_by = serializers.StringRelatedField()
    bought_by = serializers.StringRelatedField()

    class Meta:
        model = CollectionItem
        fields = ['id', 'name', 'added_by', 'quantity', 'state', 'bought_by']


class CollectionSerializer(serializers.ModelSerializer):
    items = CollectionItemSerializer(many=True, read_only=True)
    workspace = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField()
    id = serializers.PrimaryKeyRelatedField(read_only=True)

    def get_workspace(self, collection):
        workspace = collection.workspace
        return {'id': workspace.pk, 'name': workspace.name}

    class Meta:
        model = Collection
        fields = [
            'workspace', 'created_by', 'name', 'items', 'id', 'workspace'
        ]
