from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='MediaUpdate',
            new_name='MediaItem',
        ),
        migrations.AlterField(
            model_name='mediaitem',
            name='project',
            field=models.ForeignKey(
                on_delete=models.deletion.CASCADE,
                related_name='media_items',
                to='core.project',
            ),
        ),
    ]
