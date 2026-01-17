from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model


class Command(BaseCommand):
    help = 'Create a demo user for local testing.'

    def add_arguments(self, parser):
        parser.add_argument('--username', default='demo')
        parser.add_argument('--password', default='Demo123!')

    def handle(self, *args, **options):
        username = options['username']
        password = options['password']
        User = get_user_model()

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'User "{username}" already exists.'))
            return

        User.objects.create_user(username=username, password=password)
        self.stdout.write(self.style.SUCCESS(f'Created demo user "{username}".'))
