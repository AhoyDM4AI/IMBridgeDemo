export const input = {
  query: `SELECT prop_id, position_, price_usd, count_clicks
FROM (listings l JOIN hotels h ON l.prop_id=h.prop_id)
JOIN searches s ON l.srch_id=s.srch_id
WHERE h.prop_starrating > 2 AND predict(data) = TRUE;`,
  udf: `CREATE PYTHON_UDF predict(prop_location_score1 REAL, prop_location_score2 REAL, 
prop_log_historical_price REAL, price_usd REAL, orig_destination_distance REAL, prop_review_score REAL, 
avg_bookings_usd REAL, stdev_bookings_usd REAL, position_ STRING, prop_country_id STRING, 
prop_starrating INTEGER, prop_brand_bool INTEGER, count_clicks INTEGER, count_bookings INTEGER, 
year_ STRING, month_ STRING, weekofyear_ STRING, time_ STRING, site_id STRING, visitor_location_country_id STRING, 
srch_destination_id STRING, srch_length_of_stay INTEGER, srch_booking_window INTEGER, 
srch_adults_count INTEGER, srch_children_count INTEGER, srch_room_count INTEGER, 
srch_saturday_night_bool INTEGER, random_bool INTEGER) RETURNS INTEGER {
import pickle
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
scaler_path = '/home/test/model/expedia_standard_scale_model.pkl'
enc_path = '/home/test/model/expedia_one_hot_encoder.pkl'
model_path = '/home/test/model/expedia_lr_model.pkl'
with open(scaler_path, 'rb') as f:
scaler = pickle.load(f)
with open(enc_path, 'rb') as f:
enc = pickle.load(f)
with open(model_path, 'rb') as f:
model = pickle.load(f)
data = np.column_stack(args)
data = np.split(data, np.array([8]), axis = 1)
numerical = data[0]
categorical = data[1]
X = np.hstack((scaler.transform(numerical), enc.transform(categorical).toarray()))
return model.predict(X)"
}`,
};

export const analysis = {
  naive: {
    total: 0,
    function: `import pickle
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
scaler_path = '/home/test/model/expedia_standard_scale_model.pkl'
enc_path = '/home/test/model/expedia_one_hot_encoder.pkl'
model_path = '/home/test/model/expedia_lr_model.pkl'
with open(scaler_path, 'rb') as f:
    scaler = pickle.load(f)
with open(enc_path, 'rb') as f:
    enc = pickle.load(f)
with open(model_path, 'rb') as f:
    model = pickle.load(f)
data = np.column_stack(args)
data = np.split(data, np.array([8]), axis = 1)
numerical = data[0]
categorical = data[1]
X = np.hstack((scaler.transform(numerical), enc.transform(categorical).toarray()))
return model.predict(X)`,
    plan: {},
    exec: [{ no: 1, bs: 213, t: 3.2 }],
    result_cols: [{ title: "col1_name", key: "col1" }],
    result_rows: [{ col1: "row1" }],
  },
  opt: {
    total: 0,
    function: `import pickle
import numpy as np
from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import StandardScaler
def __init__(self):
    scaler_path = '/home/test/model/expedia_standard_scale_model.pkl'
    enc_path = '/home/test/model/expedia_one_hot_encoder.pkl'
    model_path = '/home/test/model/expedia_lr_model.pkl'
    with open(scaler_path, 'rb') as f:
        self.scaler = pickle.load(f)
    with open(enc_path, 'rb') as f:
        self.enc = pickle.load(f)
    with open(model_path, 'rb') as f:
        self.model = pickle.load(f)
def __call__(self, data):
    data = np.column_stack(args)
    data = np.split(data, np.array([8]), axis = 1)
    numerical = data[0]
    categorical = data[1]
    X = np.hstack((self.scaler.transform(numerical),
     self.enc.transform(categorical).toarray()))
    return self.model.predict(X)`,
    plan: {},
    exec: [{ no: 1, bs: 213, t: 3.2 }],
    result_cols: [{ title: "col1_name", key: "col1" }],
    result_rows: [{ col1: "row1" }],
  },
};
