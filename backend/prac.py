import random
from datetime import datetime , timedelta
import time

num = random.randint(100000 , 999999)
print(num)

otp_expiry = (datetime.now() + timedelta(minutes = 10))

print(otp_expiry)