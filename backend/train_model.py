import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from xgboost import XGBRegressor

df=pd.read_csv("../dataset/crowd_data.csv")

X=df[["temperature","hour"]]
y=df["crowd_count"]

X_train,X_test,y_train,y_test=\
train_test_split(
X,y,
test_size=0.2,
random_state=42
)

model=XGBRegressor()

model.fit(
X_train,
y_train
)

joblib.dump(
model,
"crowd_model.pkl"
)

print("Model saved")