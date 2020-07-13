import json
import psycopg2
import cgi

conn = psycopg2.connect(database="hukiton", user="postgres", password="4432", host="127.0.0.1", port="5432")
cursor = conn.cursor()

# Раздел "Функции для извлечения и конвертирования данных"

# Выбор данных

def selectFromDb(conntection, request, cursor, name):
    name = name
    cursor.execute(request)
    results = cursor.fetchall()
    return convertToJsonFromat(results, name)


# Запись данных в строку и приведение строки к json типу
def convertToJsonFromat(results, name):
    name = name
    val = ""
    for item in results:
        val += "%s; "% item 

    val = val.replace(',', '.')
    val = val.replace(';',',')
    val = val[:-1]
    # Запись данных в словарь
    appDict = {
    'name': name,
    'value': val
    }
    return addToJson(appDict)

def addToJson(dictionary):
    with open('data.json', 'w') as json_f:
        json.dump(dictionary, json_f)
    f = open('data.json')
    data=''
    for line in f.readlines():
        data+=line
    return data
    


# Конец раздела "Функции для извлечения и конвертирования данных"
