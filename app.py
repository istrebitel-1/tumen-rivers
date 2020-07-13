from flask import Flask, render_template, url_for
from json_convert import selectFromDb, convertToJsonFromat, addToJson
import psycopg2
import json


app = Flask(__name__)
conn = psycopg2.connect(database="hukiton", user="postgres", password="4432", host="127.0.0.1", port="5432")
cursor = conn.cursor()

# Запуск index.html
@app.route('/')
def index():
    url_for('static', filename='style.css')
    url_for('static', filename='js.js')
    return render_template("index.html")

# Получение рек из базы
@app.route('/db_rivers', methods=['GET'])
def database_R():
    cursor.execute("select distinct river_name from task_data")
    results = cursor.fetchall()
    str1 = ""
    for item in results:
        str1 += "%s;"% item 
    str1 = str1[:-1]
    return str1


# Получение дат из базы
@app.route('/db_dates', methods=['GET'])
def database_D():
    cursor.execute("select distinct observation_period from task_data")
    results2 = cursor.fetchall()
    str2 = ""
    for item2 in results2:
        str2 += "%s;"% item2
    str2 = str2[:-1]
    return str2


#010
@app.route('/db_ar_at_od', methods=['GET'])
def river_subctance_alltime():
    data = selectFromDb(conn, '''select nitrite_nitrogen from task_data where river_name = 'р. Ишим, в створе с. Абатское, ПДК' order by observation_period''', cursor, 'Nitrite nitrogen')
    return data

if __name__ == "__main__":
    app.run(debug=True)