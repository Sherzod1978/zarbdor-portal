import pandas as pd
import random
import string

# Namuna ma'lumotlar (o'quvchi va o'qituvchilar uchun)
data = [
    {"first_name": "Sardor", "last_name": "Aliyev", "role": "student"},
    {"first_name": "Malika", "last_name": "Karimova", "role": "teacher"},
    {"first_name": "Jasur", "last_name": "Bekmurodov", "role": "student"},
    {"first_name": "Zulfiya", "last_name": "Tursunova", "role": "teacher"}
]

df = pd.DataFrame(data)

usernames = []
passwords = []

for idx, row in df.iterrows():
    f_name = row['first_name'].lower()
    username = f"{f_name}{101 + idx}"
    # 8 xonali sodda parol generatsiya qilish
    password = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    
    usernames.append(username)
    passwords.append(password)

df['username'] = usernames
df['password'] = passwords

# Kerakli ustunlar tartibi
df_final = df[['username', 'password', 'first_name', 'last_name', 'role']]

# Excel faylga saqlash
df_final.to_excel('user.xlsx', index=False)
print("Ajoyib! 'user.xlsx' fayli muvaffaqiyatli yaratildi.")