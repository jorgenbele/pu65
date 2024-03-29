from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User

from rest_framework.test import force_authenticate
from rest_framework.test import APIRequestFactory
from rest_framework.test import APIClient

from rest_framework.authtoken.views import obtain_auth_token

from .models import Collection, CollectionItem, Member, Workspace
from .views import MemberDetail

import json


def create_and_login(username, password):
    m = Member.objects.create(username=username)
    m.set_password(password)
    m.save()
    auth_resp = APIClient().post(reverse('auth_token'), {
        'username': username,
        'password': password
    },
                                 format='json').json()
    return (m, auth_resp['token'])


def login(self, username, password):
    auth_resp = self.client.post(self.auth_url, {
        'username': username,
        'password': password
    },
                                 format='json').json()
    return auth_resp


class TokenAuthLoginTestCase(TestCase):
    def setUp(self):
        m = Member.objects.create(username='testuser')
        m.set_password('testpassword')
        m.save()

        self.client = APIClient()
        self.member = m
        self.view = obtain_auth_token
        self.auth_url = reverse('auth_token')
        self.member_url = reverse('member_detail', args=[m.username])

    def test_token_auth_login(self):
        auth_resp = login(self, self.member.username, 'testpassword')
        self.assertIsNotNone(auth_resp['token'])

        # make sure it worked by getting member info
        member_info = self.client.get(self.member_url,
                                      HTTP_AUTHORIZATION='Token ' +
                                      auth_resp['token'],
                                      format='json').json()
        self.assertEqual(member_info['username'], self.member.username)


class MemberTestCase(TestCase):
    def setUp(self):
        # create two members each belonging to different
        # workspaces, make sure we only get the correct
        # members workspace and corresponding collections
        m1, token1 = create_and_login('testuser1', 'testpassword')
        m2, token2 = create_and_login('testuser2', 'testpassword')

        w1 = Workspace.objects.create(owner=m1, name='testworkspace1')

        w2 = Workspace.objects.create(owner=m2, name='testworkspace2')

        # m1 owns w3, but both belong to it
        w3 = Workspace.objects.create(owner=m1, name='testworkspace3')
        m2.part_of_workspaces.add(w3)

        cs1 = [
            Collection.objects.create(workspace=w1, created_by=m1, name=name)
            for name in ['1', '2', '3']
        ]

        cs2 = [
            Collection.objects.create(workspace=w2, created_by=m2, name=name)
            for name in ['4', '5', '6']
        ]

        cs3 = [
            Collection.objects.create(workspace=w3, created_by=m1, name=name)
            for name in ['7', '8', '9']
        ]

        self.member1 = m1
        self.member2 = m2
        self.workspace1 = w1
        self.workspace2 = w2
        self.workspace3 = w3
        self.collections1 = cs1
        self.collections2 = cs2
        self.collections3 = cs3

        self.client = APIClient()
        self.view = obtain_auth_token

        self.members_url = [
            reverse('member_detail', args=[m.username]) for m in [m1, m2]
        ]
        self.tokens = [token1, token2]

        # make sure it worked by getting member info
        self.i1, self.i2 = [
            self.client.get(url,
                            HTTP_AUTHORIZATION='Token ' + token,
                            format='json').json()
            for url, token in zip(self.members_url, self.tokens)
        ]

    def test_only_self_can_get_members_info(self):
        def got_member_info(url, token):
            r = self.client.get(url,
                                HTTP_AUTHORIZATION='Token ' + token,
                                format='json')
            return r.status_code == 200

        self.assertTrue(got_member_info(self.members_url[0], self.tokens[0]))
        self.assertTrue(got_member_info(self.members_url[1], self.tokens[1]))

        self.assertFalse(got_member_info(self.members_url[0], self.tokens[1]))
        self.assertFalse(got_member_info(self.members_url[1], self.tokens[0]))

    def test_correct_collections_dict(self):
        i1, i2 = self.i1, self.i2

        # make sure that only the collections belonging
        # to the expected workspaces that they belong to
        # are returned.

        for c in self.collections1:
            self.assertTrue(c.name in i1['collections'])
            self.assertFalse(c.name in i2['collections'])

        for c in self.collections2:
            self.assertFalse(c.name in i1['collections'])
            self.assertTrue(c.name in i2['collections'])

        for c in self.collections3:
            self.assertTrue(c.name in i1['collections'])
            self.assertFalse(
                c.name in i2['collections'])  # Has not joined the collection
            self.assertTrue(
                c.name in
                i2['all_collections'])  # Has not joined the collection

    def test_correct_workspaces_dict(self):
        i1, i2 = self.i1, self.i2

        # make sure only member1 belongs to workspace1
        # and that only member2 belongs to workspace2
        # but that both belong to workspace3
        self.assertNotEqual(i1, i2)
        self.assertEqual(i1['username'], 'testuser1')
        self.assertEqual(i2['username'], 'testuser2')
        self.assertNotEqual(i1['username'], i2['username'])
        self.assertNotEqual(i1['workspaces'], i2['workspaces'])
        self.assertNotEqual(i1['collections'], i2['collections'])

        self.assertTrue(str(self.workspace1.id) in i1['workspaces'])
        self.assertTrue(str(self.workspace3.id) in i1['workspaces'])
        self.assertFalse(str(self.workspace2.id) in i1['workspaces'])

        self.assertFalse(str(self.workspace1.id) in i2['workspaces'])
        self.assertTrue(str(self.workspace3.id) in i2['workspaces'])
        self.assertTrue(str(self.workspace2.id) in i2['workspaces'])


class WorkspacesTestCase(TestCase):
    def setUp(self):
        # create two members each belonging to different
        # workspaces, make sure we only get the correct
        # members workspace and corresponding collections
        m1, token1 = create_and_login('testuser1', 'testpassword')
        m2, token2 = create_and_login('testuser2', 'testpassword')

        w1 = Workspace.objects.create(owner=m1, name='testworkspace1')
        w2 = Workspace.objects.create(owner=m2, name='testworkspace2')

        # m1 owns w3, but both belong to it
        w3 = Workspace.objects.create(owner=m1, name='testworkspace3')
        m2.part_of_workspaces.add(w3)

        cs1 = [
            Collection.objects.create(workspace=w1, created_by=m1, name=name)
            for name in ['1', '2', '3']
        ]

        cs2 = [
            Collection.objects.create(workspace=w2, created_by=m2, name=name)
            for name in ['4', '5', '6']
        ]

        cs3 = [
            Collection.objects.create(workspace=w3, created_by=m1, name=name)
            for name in ['7', '8', '9']
        ]

        self.members = [m1, m2]
        self.workspaces = [w1, w2, w3]
        self.collections = [cs1, cs2, cs3]

        self.client = APIClient()
        self.view = obtain_auth_token

        self.tokens = [token1, token2]

    def test_can_only_modify_joined_workspace(self):
        # Both member 1 and 2 should be able to update
        # workspace 3, since member 1 owns it, and member 2
        # has joined it.
        #
        def create_collection_ok(workspace_name,
                                 token,
                                 collection_name='testcollection'):
            r = self.client.post(reverse('collections-list'), {
                'name': collection_name,
                'workspace': {
                    'name': workspace_name
                }
            },
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        # Only member1 belongs to workspace 1 and should be the only one able to create a collection there
        self.assertTrue(
            create_collection_ok(self.workspaces[0].name, self.tokens[0]))
        self.assertFalse(
            create_collection_ok(self.workspaces[0].name,
                                 self.tokens[1],
                                 collection_name='testcollection2'))

        # Only member2 belongs to workspace 2 and should be the only one able to create a collection there
        self.assertFalse(
            create_collection_ok(self.workspaces[1].name, self.tokens[0]))
        self.assertTrue(
            create_collection_ok(self.workspaces[1].name,
                                 self.tokens[1],
                                 collection_name='testcollection2'))

        # Both should be able to create collections for workspace 3
        self.assertTrue(
            create_collection_ok(self.workspaces[2].name, self.tokens[0]))
        self.assertTrue(
            create_collection_ok(self.workspaces[2].name,
                                 self.tokens[1],
                                 collection_name='testcollection2'))

    def test_only_workspace_member_can_add_collection_item(self):
        # We only want workspace members to be able to add items
        # This test makes sure that is the case
        #
        def add_item_ok(collection_id, token, item_name='testitem'):
            r = self.client.put(reverse('collections_item',
                                        args=[collection_id]), {
                                            'name': item_name,
                                            'state': 'STATE_ADDED',
                                            'quantity': 1
                                        },
                                HTTP_AUTHORIZATION='Token ' + token,
                                format='json')
            return r.status_code == 200

        # Only member1 belongs to workspace 1 and should be the only one able to add an item there
        self.assertTrue(add_item_ok(self.collections[0][1].id, self.tokens[0]))
        self.assertFalse(
            add_item_ok(self.collections[0][0].id,
                        self.tokens[1],
                        item_name='testitem2'))

        # Only member2 belongs to workspace 2 and should be the only one able to add an item collection there
        self.assertFalse(add_item_ok(self.collections[1][0].id,
                                     self.tokens[0]))
        self.assertTrue(
            add_item_ok(self.collections[1][0].id,
                        self.tokens[1],
                        item_name='testitem2'))

        # Both should be able to add items for collection 9
        self.assertTrue(add_item_ok(self.collections[2][0].id, self.tokens[0]))
        self.assertTrue(
            add_item_ok(self.collections[2][0].id,
                        self.tokens[1],
                        item_name='testiitem2'))

    def test_only_collection_members_can_update_collection_item(self):
        # We only want collection members to be able to add items
        # This test makes sure that is the case

        collections_items = []
        for collections in self.collections:
            collection = collections[0]

            items = []
            item_names = ['testitem1', 'testitem2', 'testitem3']
            for name in item_names:
                c = CollectionItem(collection=collection,
                                   name=name,
                                   added_by=self.members[0],
                                   state=CollectionItem.State.ADDED,
                                   quantity=1)
                c.save()
                items.append(c)
            collections_items.append(items)

        def update_item_ok(item,
                           token,
                           new_state=CollectionItem.State.BOUGHT,
                           new_quantity=1):
            r = self.client.patch(reverse('item_by_id', args=[item.id]), {
                'name': item.name,
                'state': new_state,
                'quantity': new_quantity
            },
                                  HTTP_AUTHORIZATION='Token ' + token,
                                  format='json')
            return r.status_code == 200

        # Only member1 belongs to workspace 1 and should be the only one able to update an item there
        self.assertTrue(update_item_ok(collections_items[0][0],
                                       self.tokens[0]))
        self.assertFalse(
            update_item_ok(collections_items[0][0], self.tokens[1]))

        # Only member2 belongs to workspace 2 and should be the only one able to update an item collection there
        self.assertFalse(
            update_item_ok(collections_items[1][0], self.tokens[0]))
        self.assertTrue(update_item_ok(collections_items[1][0],
                                       self.tokens[1]))

        # Both should be able to update items for collection 9
        self.assertTrue(update_item_ok(collections_items[2][0],
                                       self.tokens[0]))
        # but member2 has not joined the collection yet, so it will fail
        # this
        self.assertFalse(
            update_item_ok(collections_items[2][0], self.tokens[1]))
        # join the collection
        self.members[1].joined_collections.add(self.collections[2][0])
        # but it will now work since it is part of the collection
        self.assertTrue(update_item_ok(collections_items[2][0],
                                       self.tokens[1]))

    def test_create_workspace(self):
        # Test the creation of workspaces
        r = self.client.post(reverse('workspaces-list'),
                             {'name': 'testworkspace_new'},
                             HTTP_AUTHORIZATION='Token ' + self.tokens[0],
                             format='json')
        self.assertEqual(r.status_code, 201)

        workspace = Workspace.objects.get(name='testworkspace_new')
        self.assertEqual(workspace.name, 'testworkspace_new')

    def test_invite_leave_and_remove_workspace(self):
        def invite_ok(workspace_id, username, token):
            r = self.client.post(reverse('workspace_invite',
                                         args=[workspace_id, username]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        def leave_ok(workspace_id, token):
            r = self.client.post(reverse('workspace_leave',
                                         args=[workspace_id]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        def remove_ok(workspace_id, username, token):
            r = self.client.post(reverse('workspace_remove',
                                         args=[workspace_id, username]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        # member 2 is the owner of workspace 2 and cannot be invited since
        # it has already joined it
        self.assertFalse(
            invite_ok(self.workspaces[1].pk,
                      self.members[1].username,
                      token=self.tokens[1]))
        # member 1 is not a member and cannot invite anyone
        self.assertFalse(
            invite_ok(self.workspaces[1].pk,
                      self.members[0].username,
                      token=self.tokens[0]))

        # member 1 cannot invite member 2
        self.assertFalse(
            invite_ok(self.workspaces[1].pk,
                      self.members[1].username,
                      token=self.tokens[0]))

        # member 2 can invite member 1
        self.assertTrue(
            invite_ok(self.workspaces[1].pk,
                      self.members[0].username,
                      token=self.tokens[1]))

        # member 1 can leave workspace
        self.assertTrue(leave_ok(self.workspaces[1].pk, token=self.tokens[0]))

        # member 2 can't be removed from workspace (is owner)
        self.assertFalse(
            remove_ok(self.workspaces[1].pk,
                      self.members[1].username,
                      token=self.tokens[1]))

        # member 2 can invite member 1
        self.assertTrue(
            invite_ok(self.workspaces[1].pk,
                      self.members[0].username,
                      token=self.tokens[1]))

        # member 1 cant remove (is not owner)
        self.assertFalse(
            remove_ok(self.workspaces[1].pk,
                      self.members[0].username,
                      token=self.tokens[0]))
        self.assertFalse(
            remove_ok(self.workspaces[1].pk,
                      self.members[1].username,
                      token=self.tokens[0]))

        # member 1 can be removed
        self.assertTrue(
            remove_ok(self.workspaces[1].pk,
                      self.members[0].username,
                      token=self.tokens[1]))


class CollectionsTestCaseSetup(TestCase):
    def setUp(self):
        # create two members each belonging to different
        # workspaces, make sure we only get the correct
        # members workspace and corresponding collections
        userpasses = [('u1', 'testpass1'), ('u2', 'testpass2')]
        self.members, self.tokens = zip(
            *list(map(lambda up: create_and_login(*up), userpasses)))

        workspacenames = ['w1', 'w2']
        self.workspaces = list(
            map(lambda mn: Workspace.objects.create(name=mn[1], owner=mn[0]),
                zip(self.members, workspacenames)))
        self.w = self.workspaces[0]
        self.w2 = self.workspaces[0]
        list(map(lambda m: m.part_of_workspaces.add(self.w.pk), self.members))

        collectionnames = ['c1', 'c2']
        self.collections = list(
            map(
                lambda mn: Collection.objects.create(
                    name=mn[1], created_by=mn[0], workspace=self.w),
                zip(self.members, collectionnames)))


class CollectionsInviteTestCase(CollectionsTestCaseSetup):
    def test_invite_to_collection(self):
        self.assertTrue(
            self.members[0].joined_collections.filter(name='c1').exists())
        self.assertTrue(
            self.members[1].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[0].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[1].joined_collections.filter(name='c1').exists())

        def invite_to_collection_ok(member, token, collection):
            r = self.client.post(reverse('collections_invite',
                                         args=[collection.pk,
                                               member.username]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        # Invites to a collection the member is already a part of will fail,
        # but the others will not
        self.assertFalse(
            invite_to_collection_ok(self.members[0], self.tokens[0],
                                    self.collections[0]))  # already joined
        self.assertTrue(
            invite_to_collection_ok(self.members[1], self.tokens[0],
                                    self.collections[0]))

        self.assertFalse(
            invite_to_collection_ok(self.members[1], self.tokens[1],
                                    self.collections[1]))  # already joined
        self.assertTrue(
            invite_to_collection_ok(self.members[0], self.tokens[1],
                                    self.collections[1]))


# FIXME: Make tests for making sure members can only invite if they are part of the collection
# and the workspace


class CollectionsLeaveTestCase(CollectionsTestCaseSetup):
    def test_leave_collection(self):
        self.assertTrue(
            self.members[0].joined_collections.filter(name='c1').exists())
        self.assertTrue(
            self.members[1].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[0].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[1].joined_collections.filter(name='c1').exists())

        def leave_collection_ok(token, collection):
            r = self.client.post(reverse('collections_leave',
                                         args=[collection.pk]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        self.assertTrue(
            leave_collection_ok(
                self.tokens[0],
                self.collections[0]))  # Will work the first time
        self.assertFalse(
            leave_collection_ok(
                self.tokens[0],
                self.collections[0]))  # but now we left, so it wont work
        self.assertFalse(
            leave_collection_ok(
                self.tokens[0],
                self.collections[1]))  # leaving one we never were a part of

        self.assertTrue(
            leave_collection_ok(self.tokens[1], self.collections[1]))
        self.assertFalse(
            leave_collection_ok(self.tokens[1], self.collections[1]))
        self.assertFalse(
            leave_collection_ok(self.tokens[1], self.collections[0]))


class CollectionsJoinTestCase(CollectionsTestCaseSetup):
    def test_join_collection(self):
        self.assertTrue(
            self.members[0].joined_collections.filter(name='c1').exists())
        self.assertTrue(
            self.members[1].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[0].joined_collections.filter(name='c2').exists())
        self.assertFalse(
            self.members[1].joined_collections.filter(name='c1').exists())

        def join_collection_ok(token, collection):
            r = self.client.post(reverse('collections_join',
                                         args=[collection.pk]),
                                 HTTP_AUTHORIZATION='Token ' + token,
                                 format='json')
            return r.status_code == 201

        self.assertFalse(
            join_collection_ok(self.tokens[0], self.collections[0]))
        self.assertTrue(join_collection_ok(self.tokens[0],
                                           self.collections[1]))
        self.assertFalse(
            join_collection_ok(self.tokens[0], self.collections[1]))

        self.assertFalse(
            join_collection_ok(self.tokens[1], self.collections[1]))
        self.assertTrue(join_collection_ok(self.tokens[1],
                                           self.collections[0]))
        self.assertFalse(
            join_collection_ok(self.tokens[1], self.collections[0]))


class LoginLogoutTestCase(TestCase):
    def setUp(self):
        self.member, self.token = create_and_login('testuser1', 'testpassword')

    def test_logout(self):
        def get_member_ok():
            r = self.client.get(reverse('member_detail',
                                        args=[self.member.username]),
                                HTTP_AUTHORIZATION='Token ' + self.token,
                                format='json')
            return r.status_code == 200

        def logout_ok():
            r = self.client.post(reverse('logout'),
                                 HTTP_AUTHORIZATION='Token ' + self.token,
                                 format='json')
            return r.status_code == 200

        self.assertTrue(get_member_ok())  # is logged in, this will work
        self.assertTrue(logout_ok())  # is logged in, will work
        self.assertFalse(get_member_ok())  # is not logged in, won't work
        self.assertFalse(logout_ok())  # won't work, is logged out already
