import os
import random

import pandas as pd
import numpy as np

from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from flask import Flask
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
print(Base.classes.keys())
service_code_2012 = Base.classes.calls_2012

#################################################
# Flask Routes
#################################################

@app.route("/")
def names():
    """Return a random list of 10000 dictionaries."""

    # Use Pandas to perform the sql query
    df = pd.read_sql_query("select * from calls_2012", db.session.bind)
    random.seed(4)
    sample = random.sample(df, 100)

    # Return a list of the column names (sample names)
    return sample.to_json(orient='records')


if __name__ == "__main__":
    app.run()