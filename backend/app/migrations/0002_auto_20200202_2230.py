# Generated by Django 3.0.2 on 2020-02-02 22:30

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='member',
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users'
            },
        ),
        migrations.AlterModelManagers(
            name='member',
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.AddField(
            model_name='workspace',
            name='members',
            field=models.ManyToManyField(to='app.Member'),
        ),
        migrations.AlterField(
            model_name='collectionitem',
            name='added_by',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name='added',
                to='app.Workspace'),
        ),
        migrations.AlterField(
            model_name='collectionitem',
            name='bought_by',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name='bought',
                to='app.Workspace'),
        ),
        migrations.AlterField(
            model_name='member',
            name='user',
            field=models.OneToOneField(
                on_delete=django.db.models.deletion.CASCADE,
                parent_link=True,
                primary_key=True,
                serialize=False,
                to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='workspace',
            name='owner',
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name='workspace_owner',
                to='app.Member'),
        ),
        migrations.DeleteModel(name='WorkspaceMember', ),
    ]
