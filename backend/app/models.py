from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


class Member(User):
    user = models.OneToOneField(User,
                                on_delete=models.CASCADE,
                                parent_link=True)


class Workspace(models.Model):
    # on_delete: we don't want a member that is also a workspace admin
    # to be deleted without also deleting the workspace.
    owner = models.ForeignKey(Member,
                              on_delete=models.PROTECT,
                              related_name='workspace_owner')
    name = models.TextField('name', max_length=128, unique=True)

    members = models.ManyToManyField(Member, related_name='part_of_workspaces')

    def save(self, *args, **kwargs):
        # Make sure the owner is always in members
        super().save(*args, **kwargs)
        if not self.members.filter(pk=self.owner.pk):
            self.members.add(self.owner)

    def clean(self):
        # make sure that all WorkspaceMembers are members of the workspace
        # that the collection this item belongs.
        o = self.owner
        try:
            self.members.get(pk=o.pk)
        except Member.DoesNotExist:
            raise ValidationError(
                gettext_lazy('Workspace owner must also be member'))

    def __str__(self):
        return self.name


class Collection(models.Model):
    """
    A Collection is the 
    """
    workspace = models.ForeignKey(Workspace,
                                  related_name='collections',
                                  on_delete=models.CASCADE)
    created_by = models.ForeignKey(Member, on_delete=models.PROTECT)
    name = models.TextField('name', max_length=128)

    def clean(self):
        # make sure that all WorkspaceMembers are members of the workspace
        # that the collection this item belongs.
        w = self.workspace
        if w not in self.created_by.workspaces:
            raise ValidationError(
                gettext_lazy(
                    'Collection must be created by a workspace member'))

    class Meta:
        # Collection names must be unique for a collection
        unique_together = [['workspace', 'name']]


from django.utils.translation import gettext_lazy


class CollectionItem(models.Model):
    class State(models.TextChoices):
        ADDED = 'STATE_ADDED', gettext_lazy('Added')
        BOUGHT = 'STATE_BOUGHT', gettext_lazy('Bought')
        CANCELLED = 'STATE_CANCELLED', gettext_lazy('Cancelled')

    collection = models.ForeignKey(Collection,
                                   related_name='items',
                                   on_delete=models.CASCADE)
    name = models.TextField(verbose_name='the text to show in the list',
                            max_length=128)

    added_by = models.ForeignKey(Member,
                                 on_delete=models.PROTECT,
                                 related_name='added')

    quantity = models.PositiveIntegerField(
        'quantity of an item')  # TODO: make sure it is > 0

    state = models.CharField(max_length=32,
                             choices=State.choices,
                             default=State.ADDED)
    bought_by = models.ForeignKey(Member,
                                  null=True,
                                  on_delete=models.PROTECT,
                                  related_name='bought')

    def clean(self):
        # make sure that all WorkspaceMembers are members of the workspace
        # that the collection this item belongs.
        w = self.collection.workspace
        if w not in self.added_by.workspaces or w not in self.bought_by.workspaces:
            raise ValidationError(
                gettext_lazy(
                    'Members must be members of the workspace the Collection belongs to'
                ))

    class Meta:
        unique_together = (
            'collection',
            'name',
        )
