import os
print("=" * 60)
print("Environment Variables Check:")
print("=" * 60)
print(f"MONGO_URL exists: {'MONGO_URL' in os.environ}")
print(f"MONGO_URL value: {os.environ.get('MONGO_URL', 'NOT SET')[:50]}...")
print(f"DB_NAME: {os.environ.get('DB_NAME', 'NOT SET')}")
print(f"SMTP_USERNAME: {os.environ.get('SMTP_USERNAME', 'NOT SET')}")
print("=" * 60)
