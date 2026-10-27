import os
import django
import pandas as pd

# Django muhitini sozlash
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User

# user1.xlsx faylini o'qiymiz
df = pd.read_excel('user1.xlsx')

count_added = 0
count_updated = 0

for index, row in df.iterrows():
    # Excel faylda o'zingiz yozgan login va parollarni to'g'ridan-to'g'ri olamiz
    username = str(row['username']).strip()
    password = str(row['password']).strip()
    first_name = str(row['first_name']).strip()
    last_name = str(row['last_name']).strip()
    
    if not username or username == 'nan':
        continue

    # Agar foydalanuvchi bazada bo'lmasa, yaratamiz
    if not User.objects.filter(username=username).exists():
        User.objects.create_user(
            username=username,
            password=password,
            first_name=first_name,
            last_name=last_name
        )
        count_added += 1
    else:
        # Agar mavjud bo'lsa, Excel'dagi o'zingiz yozgan parolni yangilab qo'yamiz
        u = User.objects.get(username=username)
        u.set_password(password)
        u.first_name = first_name
        u.last_name = last_name
        u.save()
        count_updated += 1

print(f"Tayyor! Qo'shildi: {count_added}, Yangilandi: {count_updated}")