import pandas as pd
import random
import os

data = []

# Our specific Prayagraj locations
locations = [
    "Prayagraj Junction",
    "Triveni Sangam (Confluence Zone)",
    "Kumbh Mela Ground (Main Venue)",
    "Dashashwamedh Ghat (Prayagraj)",
    "Shri Bade Hanuman Temple",
    "Saraswati Ghat",
    "Alopankari Temple Area"
]

# We generate 10,000 rows so the ML model has plenty of data to study
for _ in range(10000):
    loc = random.choice(locations)
    temp = random.randint(10, 45)
    hour = random.randint(0, 23)
    
    # Simulate realistic base crowds (Sangam gets the most naturally)
    if loc == "Triveni Sangam (Confluence Zone)":
        base_crowd = random.randint(8000, 15000)
    elif loc == "Kumbh Mela Ground (Main Venue)":
        base_crowd = random.randint(6000, 12000)
    elif loc == "Shri Bade Hanuman Temple":
        base_crowd = random.randint(5000, 10000)
    else:
        base_crowd = random.randint(2000, 7000)
        
    # Heat and time variations
    if temp > 35: base_crowd -= 1500  # Too hot, crowd thins
    if 12 <= hour <= 16: base_crowd += 2000  # Afternoon rush
    if hour < 6 or hour > 21: base_crowd -= 2500 # Night time lull
    
    data.append([loc, max(500, base_crowd), temp, hour])

df = pd.DataFrame(data, columns=["location", "crowd_count", "temperature", "hour"])

csv_path = os.path.join(os.path.dirname(__file__), "crowd_data.csv")
df.to_csv(csv_path, index=False)
print(f"Smart Dataset generated successfully at: {csv_path}")