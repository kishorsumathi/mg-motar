# Generated by Django 3.2.16 on 2022-12-16 13:37

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='voicesearch',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Part_Name', models.CharField(max_length=100)),
                ('Location', models.CharField(max_length=100)),
                ('Quantity', models.IntegerField()),
            ],
            options={
                'db_table': 'voicesearch',
            },
        ),
    ]
