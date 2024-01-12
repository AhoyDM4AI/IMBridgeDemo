const input = {
  query: `SELECT l.prop_id, price_usd, count_bookings, count_clicks
  FROM (listings l JOIN hotels h ON l.prop_id = h.prop_id) 
  JOIN searches s ON l.srch_id = s.srch_id
  WHERE h.prop_starrating > 2 AND
  PREDICT predict(prop_location_score1, prop_location_score2, prop_log_historical_price, price_usd, orig_destination_distance, prop_review_score, avg_bookings_usd, stdev_bookings_usd,  position, prop_country_id, prop_starrating, prop_brand_bool, count_clicks,  count_bookings, year, month, weekofyear, time, site_id, visitor_location_country_id, srch_destination_id, srch_length_of_stay, srch_booking_window, srch_adults_count,  srch_children_count, srch_room_count, srch_saturday_night_bool, random_bool) = 1;`,
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
data = np.column_stack(data)
data = np.split(data, np.array([8]), axis = 1)
numerical = data[0]
categorical = data[1]
X = np.hstack((scaler.transform(numerical), enc.transform(categorical).toarray()))
return model.predict(X)"
}`,
};

const analysis = {
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
data = np.column_stack(data)
data = np.split(data, np.array([8]), axis = 1)
numerical = data[0]
categorical = data[1]
X = np.hstack((scaler.transform(numerical), enc.transform(categorical).toarray()))
return model.predict(X)`,
    plan: {},
    exec: [{ no: 1, bs: 213, t: 3.2 }],
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
    data = np.column_stack(data)
    data = np.split(data, np.array([8]), axis = 1)
    numerical = data[0]
    categorical = data[1]
    X = np.hstack((self.scaler.transform(numerical),
    self.enc.transform(categorical).toarray()))
    return self.model.predict(X)`,
    plan: {},
    exec: [{ no: 1, bs: 213, t: 3.2 }],
  },
};


const result_set = {
    result_cols: [{ title: "col1_name", key: "col1" }],
    result_rows: [{ col1: "row1" }],
}

export const q1 = {
    input: input,
    analysis: analysis,
    result_set: result_set
}