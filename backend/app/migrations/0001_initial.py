# Generated by Django 3.0.2 on 2020-02-02 22:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='Collection',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=128, verbose_name='name')),
            ],
        ),
        migrations.CreateModel(
            name='Member',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Workspace',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=128, unique=True, verbose_name='name')),
                ('owner', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.Member')),
            ],
        ),
        migrations.CreateModel(
            name='WorkspaceMember',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('is_deleted', models.BooleanField(default=False, verbose_name='is this member a deleted user')),
                ('member', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Member')),
                ('workspace', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Workspace')),
            ],
        ),
        migrations.CreateModel(
            name='CollectionItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.TextField(max_length=128, unique=True, verbose_name='the text to show in the list')),
                ('quantity', models.PositiveIntegerField(verbose_name='quantity of an item')),
                ('state', models.CharField(choices=[('STATE_ADDED', 'Added'), ('STATE_BOUGHT', 'Bought'), ('STATE_CANCELLED', 'Cancelled')], default='STATE_ADDED', max_length=32)),
                ('added_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='added', to='app.WorkspaceMember')),
                ('bought_by', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='bought', to='app.WorkspaceMember')),
                ('collection', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Collection')),
            ],
        ),
        migrations.AddField(
            model_name='collection',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='app.Member'),
        ),
        migrations.AddField(
            model_name='collection',
            name='workspace',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Workspace'),
        ),
        migrations.AlterUniqueTogether(
            name='collection',
            unique_together={('workspace', 'name')},
        ),
    ]
