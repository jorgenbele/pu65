from django.contrib.auth.models import User, Group
from rest_framework import serializers

from rest_framework.fields import Field
from django.utils.translation import gettext_lazy as _

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

    collections = serializers.SerializerMethodField()
    workspaces = serializers.SerializerMethodField()

    # get a dict {member_pk: member_username, ...}
    def get_workspaces(self, member):
        return {w.pk: w.name for w in member.part_of_workspaces.all()}

    # get a dict {member_pk: member_username, ...}
    def get_collections(self, member):
        # TODO: Must be changed when supporting
        # private lists and such
        collections = Collection.objects.filter(
            workspace__members__id__exact=member.id)
        d = {}
        for c in collections:
            d[c.id] = c.name
        return d

    class Meta:
        model = Member
        fields = ['id', 'username', 'workspaces', 'collections']


class CollectionItemSerializer(serializers.ModelSerializer):
    id = serializers.PrimaryKeyRelatedField(read_only=True)
    added_by = serializers.StringRelatedField()
    bought_by = serializers.StringRelatedField()

    class Meta:
        model = CollectionItem
        fields = ['id', 'name', 'added_by', 'quantity', 'state', 'bought_by']


from rest_framework.utils import html, humanize_datetime, json, representation

from rest_framework.fields import empty


class WorkspaceAsJSONField(Field):
    default_error_messages = {'invalid': _('Value must be valid JSON.')}

    def __init__(self, *args, **kwargs):
        self.binary = kwargs.pop('binary', False)
        self.encoder = kwargs.pop('encoder', None)
        super().__init__(*args, **kwargs)

    def get_value(self, dictionary):
        if html.is_html_input(dictionary) and self.field_name in dictionary:
            # When HTML form input is used, mark up the input
            # as being a JSON string, rather than a JSON primitive.
            class JSONString(str):
                def __new__(cls, value):
                    ret = str.__new__(cls, value)
                    ret.is_json_string = True
                    return ret

            return JSONString(dictionary[self.field_name])
        return dictionary.get(self.field_name, empty)

    def to_internal_value(self, data):
        try:
            if self.binary or getattr(data, 'is_json_string', False):
                if isinstance(data, bytes):
                    data = data.decode()
                data = json.loads(data)
            else:
                json.dumps(data, cls=self.encoder)
        except (TypeError, ValueError):
            self.fail('invalid')

        print('INTERNAL VALUD', data)
        try:
            workspace = Workspace.objects.get_or_create(**data)[0]
            return workspace
        except Workspace.DoesNotExist:
            self.fail('invalid')

    def to_representation(self, value):
        d = {'name': value.name, 'id': value.id}
        if self.binary:
            value = json.dumps(d, cls=self.encoder)
            value = value.encode()
        return d


class CollectionSerializer(serializers.ModelSerializer):
    items = CollectionItemSerializer(many=True, read_only=True)
    #workspace = serializers.SerializerMethodField()
    workspace = WorkspaceAsJSONField()
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
