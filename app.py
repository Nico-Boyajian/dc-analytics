import os
import random

import pandas as pd
import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
#################################################
# Database Setup
#################################################
app.config["SQLALCHEMY_DATABASE_URI"] = 'postgres://postgres:postgres@localhost:5432/dc_311'
db = SQLAlchemy(app)

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(db.engine, reflect=True)

# Save reference to the table
service_code_2012 = Base.classes.calls_2012

#################################################
# Flask Routes
#################################################

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/top_complaints/<year>")
def complaints(year):

    # Use Pandas to perform the sql query
    df_complaints = pd.read_sql_query("select servicecodedescription, count(*) as calls from calls_"+ year + " group by servicecodedescription order by count(*) desc limit 10", db.session.bind)
    return jsonify(list(df_complaints.iloc[:,0]), list(df_complaints.iloc[:,1]))

@app.route("/by_ward/<year>")
def wards(year):
    # Use Pandas to perform the sql query
    df_wards = pd.read_sql_query("select ward, count(*) as calls from calls_"+ year + " where ward is not null group by ward", db.session.bind)
    return jsonify(list(df_wards.iloc[:,0]), list(df_wards.iloc[:,1]))

@app.route("/years")
def years():
    return jsonify(["2012", "2013", "2014", "2015", "2016", "2017"])


if __name__ == "__main__":
    app.run()

# def df_to_geojson(df, properties, lat='latitude', lon='longitude'):
#     geojson = {'type':'FeatureCollection', 'features':[]}
#     for _, row in df.iterrows():
#         feature = {'type':'Feature',
#                    'properties':{},
#                    'geometry':{'type':'Point',
#                                'coordinates':[]}}
#         feature['geometry']['coordinates'] = [row[lon],row[lat]]
#         for prop in properties:
#             feature['properties'][prop] = row[prop]
#         geojson['features'].append(feature)
#     return geojson