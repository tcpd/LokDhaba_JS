# !flask/bin/python
import decimal
from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector

# from mysql.connector import Error
#
# import simplejson
from math import ceil
# import pandas as pd
# import geopandas
import simplejson as json

app = Flask(__name__,
            static_url_path="",
            static_folder="Maps/json")
CORS(app)
# Dummy json to check api is running or not.
tasks = [
    {
        'id': 1,
        'title': u'Buy groceries',
        'description': u'Milk, Cheese, Pizza, Fruit, Tylenol',
        'done': False
    },
    {
        'id': 2,
        'title': u'Learn Python',
        'description': u'Need to find a good Python tutorial on the web',
        'done': False
    }
]

config_file = open("db_config.properties", "r")
fl = config_file.readlines()
db_config = []
for r in fl:
    w = r.split(" = ")
    db_config.append(w[1].strip("\n"))


def connectdb(config):
    return mysql.connector.connect(host=config[0], database=config[1], user=config[2], password=config[3],
                                   auth_plugin='mysql_native_password')

def module_to_table(argument):
    switcher = {
        "voterTurnoutChart": "voter_turnout",
        "cvoteShareChart": "voteshares_cont",
        "tvoteShareChart": "voteshares_total",
        "seatShareChart": "seatshares",
        "strikeRateChart": "partysummary",
        "partiesPresentedChart": "parties_contests",
        "contestedDepositSavedChart": "contested_deposit_losts",
        "winnerCasteMap": "maps",
        "numCandidatesMap": "maps",
        "voterTurnoutMap": "maps",
        "winnerMap": "maps",
        "winnerGenderMap": "maps",
        "winnerMarginMap": "maps",
        "winnerVoteShareMap": "maps",
        "partyPositionsMap": "partys",
        "partyVoteShareMap": "partys",
        "notaTurnoutMap": "maps"
    }

    # get() method of dictionary data type returns
    # value of passed argument if it is present
    # in dictionary otherwise second argument will
    # be assigned as default value of passed argument
    return switcher.get(argument, "nothing")


class DecimalEncoder(json.JSONEncoder):
    def _iterencode(self, o, markers=None):
        if isinstance(o, decimal.Decimal):
            # wanted a simple yield str(o) in the next line,
            # but that would mean a yield on the line with super(...),
            # which wouldn't work (see my comment below), so...
            return (str(o) for o in [o])
        return super(DecimalEncoder, self)._iterencode(o, markers)


# def get_map_data(rep, election, state, data):
#     if election == "GE":
#         shp = geopandas.read_file(rep + "/GE/India_PC_Updated.shp")
#         left_key = ["STATE_UT", "PC_NO"]
#         right_key = ["State_Name", "Constituency_No"]
#     if election == "AE":
#         shp = geopandas.read_file(rep + "/AE/" + state + "/" + state + "_Assembly_con.shp")
#         left_key = ["ASSEMBLY"]
#         right_key = ["Constituency_No"]
#     shp = shp.merge(data, left_on=left_key, right_on=right_key, how="left")
#     return shp


## Dummy route to check functioning of api
@app.route('/data/api/v1.0/tasks', methods=['GET'])
def get_tasks_data():
    return jsonify({'tasks': tasks})


@app.route('/data/api/v2.0/getDerivedData', methods=['POST'])
def get_paginated_data():
    connection = connectdb(db_config)
    if connection.is_connected():
        db_Info = connection.get_server_info()
        req = request.get_json()
        electionType = req.get('ElectionType')  # if key doesn't exist, returns None
        print('et', electionType)
        stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
        print('st', stateName)
        assemblyNo = req.get('AssemblyNo')
        print('an', assemblyNo)
        pageNo = int(req.get('PageNo'))
        pageSize = int(req.get('PageSize'))
        filters = req.get('Filters')
        print("filters", filters)
        sort = req.get("SortOptions")
        print("sort ", sort)
        cursor = connection.cursor(prepared=True)
        states = stateName.split(",")
        assem = assemblyNo.split(",")
        StartIndex = pageNo * pageSize
        query_input = list()
        count_input = list()
        get_data = "Select * from mastersheet where Election_Type = %s "
        query_input.append(electionType)
        get_count = "select count(*) as count from mastersheet where Election_Type = %s "
        count_input.append(electionType)

        get_state = ""
        if stateName != "all":
            get_state = "and State_Name = %s "
            query_input.append(stateName)
            count_input.append(stateName)
        get_assembly = ""
        if assemblyNo != "all":
            get_assembly = "and Assembly_No in (" + ",".join(["%s"] * len(assem)) + ") "
            for x in assem:
                query_input.append(int(x))
                count_input.append(int(x))
        get_filter = ""
        for i in filters:
            col = i.get('id')
            val = i.get('value')
            if val.isnumeric():
                str = col + " = %s "
                query_input.append(int(val))
                count_input.append(int(val))
            else:
                str = col + " LIKE %s "
                query_input.append("%" + val + "%")
                count_input.append("%" + val + "%")
            get_filter = get_filter + " and " + str

        get_sorted = ""
        for i in sort:
            col = i.get('id')
            desc = i.get('desc')
            if desc:
                get_sorted = "Order by " + col + " DESC "
            else:
                get_sorted = "Order by " + col + " ASC "

        get_page_data = "limit %s,%s"
        query_input.append(StartIndex)
        query_input.append(pageSize)

        sql_parameterized_data_query = get_data + get_state + get_assembly + get_filter + get_sorted + get_page_data
        print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
        sql_parameterized_count_query = get_count + get_state + get_assembly + get_filter
        print("Count Query : ", sql_parameterized_count_query, "\n count input :", count_input)

        cursor.execute(sql_parameterized_count_query, tuple(count_input))
        tr = [x[0] for x in cursor.fetchall()]
        total_records = tr[0]
        total_pages = ceil(total_records / pageSize)

        cursor.execute(sql_parameterized_data_query, tuple(query_input))
        records = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]  # this will extract row headers
        json_data = []
        for row in records:
            json_data.append(dict(zip(row_headers, row)))
        return (jsonify({'pages': total_pages, 'data': json_data}))


@app.route('/data/api/v1.0/DataDownload', methods=['POST'])
def get_derived_data():
    connection = connectdb(db_config)
    print("Inside Download data api")
    if connection.is_connected():
        db_Info = connection.get_server_info()
        req = request.get_json()
        electionType = req.get('ElectionType')  # if key doesn't exist, returns None
        print('et', electionType)
        stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
        print('st', stateName)
        assemblyNo = req.get('AssemblyNo')
        print('an', assemblyNo)
        filters = req.get('Filters')
        print("filters", filters)
        cursor = connection.cursor(prepared=True)
        states = stateName.split(",")
        assem = assemblyNo.split(",")
        query_input = list()
        get_data = "Select * from mastersheet where Election_Type = %s "
        query_input.append(electionType)

        get_state = ""
        if (stateName != "all"):
            get_state = "and State_Name = %s "
            query_input.append(stateName)
        get_assembly = ""
        if (assemblyNo != "all"):
            get_assembly = "and Assembly_No in (" + ",".join(["%s"] * len(assem)) + ") "
            for x in assem:
                query_input.append(int(x))
        get_filter = ""
        for i in filters:
            col = i.get('id')
            val = i.get('value')
            if val.isnumeric():
                str = col + " = %s "
                query_input.append(int(val))
            else:
                str = col + " LIKE %s "
                query_input.append("%" + val + "%")
            get_filter = get_filter + " and " + str

        sql_parameterized_data_query = get_data + get_state + get_assembly + get_filter
        print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)

        cursor.execute(sql_parameterized_data_query, tuple(query_input))
        records = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]  # this will extract row headers
        csv_data = []
        csv_data.append(row_headers)
        for row in records:
            csv_data.append(list(row))
        return (jsonify({'data': csv_data}))


@app.route('/data/api/v1.0/getVizLegend', methods=['POST'])
def get_select_options():
    print("In get options")
    req = request.get_json()
    electionType = req.get('ElectionType')  # if key doesn't exist, returns None
    print('et', electionType)
    stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
    print('st', stateName)
    module = req.get('ModuleName')
    print('mod', module)
    type = req.get('VizType')
    print('type', type)
    if module == "voterTurnoutChart":
        return (jsonify({'data': ["male", "female", "total"]}))
    if module == "partiesPresentedChart":
        return (jsonify({'data': ["Parties_Contested", "Parties_Represented"]}))
    if module == "contestedDepositSavedChart":
        return (jsonify({'data': ["Total_Candidates", "Deposit_Lost"]}))
    if module == "winnerCasteMap":
        return (jsonify({"data": ["General", "SC", "ST"]}))
    if module == "numCandidatesMap":
        return (jsonify({"data": ["<5", "5-15", ">15"]}))
    if module == "voterTurnoutMap":
        return (jsonify(
            {"data": ["<50%", "50%-60%", "60%-70%", "70%-75%", "75%-80%", "80%-85%", "85%-90%", "90%-95%", ">95%"]}))
    if module == "winnerGenderMap":
        return (jsonify({"data": ["Male", "Female", "Others"]}))
    if module == "winnerMarginMap":
        return (jsonify({"data": ["<5%", "5%-10%", "10%-20%", ">20%"]}))
    if module in ["winnerVoteShareMap", "partyVoteShareMap"]:
        return (jsonify({"data": ["<20%", "20%-30%", "30%-40%", "40%-50%", "50%-60%", ">60%"]}))
    if module == "partyPositionsMap":
        return (jsonify({"data": ["1", "2", "3", ">3"]}))
    if module == "partyVoteShareMap":
        return (jsonify({"data": ["1", "2", "3", ">3"]}))
    if module == "notaTurnoutMap":
        return (jsonify({"data": ["<1%", "1%-3%", "3%-5%", ">5%"]}))
    connection = connectdb(db_config)
    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("show tables")
        tables = cursor.fetchall()
        db_tables = []
        for (table,) in tables:
            db_tables.append(table)
        if type == "Chart":
            tableName = module_to_table(module)
            if tableName in db_tables:
                cursor = connection.cursor(prepared=True)
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_state = ""
                if (electionType == "AE"):
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_state
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                options = []
                # print(records)
                for (row,) in records:
                    options.append(row)
                options.sort()
                return (jsonify({'data': options}))
        if type == "Map":
            a_no = req.get('AssemblyNo')
            # assembly = year[year.find("(")+1:year.find(")")]
            # a_no = int(assembly.replace("#",""))
            tableName = module_to_table(module)
            if tableName in db_tables:
                cursor = connection.cursor(prepared=True)
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_assembly = " and Assembly_No = %s"
                query_input.append(a_no)
                get_state = ""
                if electionType == "AE":
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_assembly + get_state
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                options = []
                # print(records)
                for (row,) in records:
                    options.append(row)
                options.sort()
                return jsonify({'data': options})


@app.route('/data/api/v1.0/getMapYear', methods=['POST'])
def get_year_options():
    print("In get years")
    req = request.get_json()
    electionType = req.get('ElectionType')  # if key doesn't exist, returns None
    print('et', electionType)
    stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
    print('st', stateName)
    module = req.get('ModuleName')
    print('mod', module)
    type = req.get('VizType')
    print('type', type)
    if type == 'Map':
        connection = connectdb(db_config)
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("show tables")
            tables = cursor.fetchall()
            db_tables = []
            for (table,) in tables:
                db_tables.append(table)
            tableName = module_to_table(module)
            if tableName in db_tables:
                cursor = connection.cursor(prepared=True)
                query_input = list()
                get_table = "Select distinct Year,Assembly_No from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_state = ""
                if electionType == "AE":
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_state + " and Year >2007"
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                row_headers = [x[0] for x in cursor.description]  # this will extract row headers
                json_data = []
                for row in records:
                    json_data.append(dict(zip(row_headers, row)))
                return (jsonify({'data': json_data}))


@app.route('/data/api/v1.0/getMapYearParty', methods=['POST'])
def get_party_options():
    print("In get parties")
    req = request.get_json()
    electionType = req.get('ElectionType')  # if key doesn't exist, returns None
    print('et', electionType)
    stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
    print('st', stateName)
    module = req.get('ModuleName')
    print('mod', module)
    type = req.get('VizType')
    print('type', type)
    a_no = req.get('AssemblyNo')
    print('an', a_no)
    if type == 'Map':
        connection = connectdb(db_config)
        if connection.is_connected():
            cursor = connection.cursor()
            cursor.execute("show tables")
            tables = cursor.fetchall()
            db_tables = []
            for (table,) in tables:
                db_tables.append(table)
            tableName = module_to_table(module)
            if tableName in db_tables:
                cursor = connection.cursor(prepared=True)
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_assembly = " and Assembly_No = %s"
                query_input.append(a_no)
                get_state = ""
                if (electionType == "AE"):
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_assembly + get_state
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                row_headers = [x[0] for x in cursor.description]  # this will extract row headers
                parties = []
                for (row,) in records:
                    parties.append(row)
                return (jsonify({'data': parties}))


@app.route('/data/api/v1.0/getMapData', methods=['POST'])
def get_map_data():
    print("inside map data")
    req = request.get_json()
    electionType = req.get('ElectionType')  # if key doesn't exist, returns None
    print('et', electionType)
    stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
    print('st', stateName)
    if electionType == "GE" :
        return()


@app.route('/data/api/v1.0/getVizData', methods=['POST'])
def get_viz_data():
    print("inside viz data")
    req = request.get_json()
    electionType = req.get('ElectionType')  # if key doesn't exist, returns None
    print('et', electionType)
    stateName = req.get('StateName')  # if key doesn't exist, returns a 400, bad request error
    print('st', stateName)
    module = req.get('ModuleName')
    print('mod', module)
    type = req.get('VizType')
    print('type', type)
    connection = connectdb(db_config)
    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("show tables")
        tables = cursor.fetchall()
        db_tables = []
        for (table,) in tables:
            db_tables.append(table)
        tableName = module_to_table(module)
        if tableName in db_tables:
            cursor = connection.cursor(prepared=True)
            query_input = list()
            get_table = "Select * from " + tableName
            # query_input.append(tableName)
            get_election = " where Election_Type = %s"
            query_input.append(electionType)
            get_state = ""
            if electionType == "AE":
                get_state = " and State_Name = %s"
                query_input.append(stateName)
            get_party = ""
            if module in ["cvoteShareChart", "seatShareChart", "tvoteShareChart", "strikeRateChart"]:
                parties = req.get('Legends')
                # parties = party.split(",")
                get_party = " and Party in (" + ",".join(["%s"] * len(parties)) + ") "
                for x in parties:
                    query_input.append(x)
            get_assembly = ""
            if type == "Map":
                a_no = req.get('AssemblyNo')
                print('an', a_no)
                get_assembly = " and Assembly_No = %s"
                query_input.append(a_no)
            get_map_party = ""
            if module in ["partyPositionsMap", "partyVoteShareMap"]:
                party = req.get('Party')
                print('party', party)
                get_map_party = " and Party = %s"
                query_input.append(party)

            sql_parameterized_data_query = get_table + get_election + get_state + get_party + get_assembly + get_map_party
            print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
            cursor.execute(sql_parameterized_data_query, tuple(query_input))

            records = cursor.fetchall()
            row_headers = [x[0] for x in cursor.description]  # this will extract row headers
            json_data = []
            for row in records:
                json_data.append(dict(zip(row_headers, row)))
            return jsonify({'data': json_data})


            # if type == "Chart":
            #     records = cursor.fetchall()
            #     row_headers = [x[0] for x in cursor.description]  # this will extract row headers
            #     json_data = []
            #     for row in records:
            #         json_data.append(dict(zip(row_headers, row)))
            #     return jsonify({'data': json_data})
            # if type == "Map":
            #     df = pd.DataFrame(cursor.fetchall())
            #     df.columns = [x[0] for x in cursor.description]
            #     shp = get_map_data(rep=db_config[4], election=electionType, state=stateName, data=df)
            #     print(shp.geometry)
            #     return jsonify({'data': [shp.to_json(cls=DecimalEncoder)]})



if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
