from django.db import migrations, models

import core.features.budgets.models
import core.features.risks.models
import core.features.rfis.models


class Migration(migrations.Migration):
    dependencies = [
        ('core', '0002_rename_mediaupdate_mediaitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='budgetitem',
            name='id',
            field=models.CharField(
                default=core.features.budgets.models.BudgetItem.generate_id,
                max_length=32,
                primary_key=True,
                serialize=False,
            ),
        ),
        migrations.AlterField(
            model_name='risk',
            name='id',
            field=models.CharField(
                default=core.features.risks.models.Risk.generate_id,
                max_length=32,
                primary_key=True,
                serialize=False,
            ),
        ),
        migrations.AlterField(
            model_name='rfi',
            name='id',
            field=models.CharField(
                default=core.features.rfis.models.Rfi.generate_id,
                max_length=32,
                primary_key=True,
                serialize=False,
            ),
        ),
    ]
