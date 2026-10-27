import os
import django
import pandas as pd

# Django muhitini sozlash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# Sizning D diskdan olib kelib backend papkasiga qo'ygan asl Excel faylingiz nomi
df = pd.read_excel('user1.xlsx')

count_added = 0
count_existing = 0

for index, row in df.iterrows():
    username = str(row['username'])
    password = str(row['password'])
    first_name = str(row['first_name'])
    last_name = str(row['last_name'])
    
    # Bazada mavjud emasligini tekshirib, qo'shamiz
    if not User.objects.filter(username=username).exists():
        User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        count_added += 1
    else:
        # Agar oldindan bo'lsa, parolini yangilab qo'yamiz
        u = User.objects.get(username=username)
        u.set_password(password)
        u.save()
        count_existing += 1

print(f"Import yakunlandi! Qo'shildi: {count_added}, Yangilandi: {count_existing}")