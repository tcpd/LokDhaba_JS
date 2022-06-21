# !flask/bin/python
import decimal
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_cors import cross_origin
import mysql.connector
from math import ceil
import simplejson as json
import spacy
from spacy.matcher import PhraseMatcher, Matcher
from StateNames import stateNamesDict
import re
import operator

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
                                   auth_plugin='mysql_native_password',use_pure=True)

def connectdb1(config):
    return mysql.connector.connect(host='0.0.0.0',port = 32000, database=config[1], user=config[2], password=config[3],
                                   auth_plugin='mysql_native_password')

def module_to_table(argument):
    switcher = {
        "voterTurnoutChart": "voter_turnout",
        "cvoteShareChart": "party_statistics",
        "tvoteShareChart": "party_statistics",
        "seatShareChart": "party_statistics",
        "strikeRateChart": "party_statistics",
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
        "notaTurnoutMap": "maps",
        "rerunningCandidates":"incumbency",
        "timesContested": "incumbency",
        "incumbentsChart" : "incumbency",
        "incumbentsParty" : "pty_incumbency",
        "incumbentsStrike":"incumbency",
        "incumbentsStrikeParty": "pty_incumbency",
        "turncoatsStrike": "incumbency",
        "turncoatsStrikeParty": "pty_incumbency",
        "firstTimeWinners": "incumbency",
        "firstTimeParty": "pty_incumbency",
        "occupationMLA": "profession",
        "educationMLA": "education",
        "ptyOccupationMLA":"pty_profession",
        "ptyEducationMLA":"pty_education"
    }
    # get() method of dictionary data type returns
    # value of passed argument if it is present
    # in dictionary otherwise second argument will
    # be assigned as default value of passed argument
    return switcher.get(argument, "nothing")


def module_to_table_legend(argument):
    switcher = {
        "cvoteShareChart": "party_statistics",
        "tvoteShareChart": "party_statistics",
        "seatShareChart": "party_statistics",
        "strikeRateChart": "party_statistics",
        "winnerMap": "maps",
        "incumbentsParty" : "party_statistics",
        "incumbentsStrikeParty": "party_statistics",
        "turncoatsStrikeParty": "party_statistics",
        "firstTimeParty": "party_statistics",
        "ptyOccupationMLA": "party_statistics",
        "ptyEducationMLA": "party_statistics"
    }
    # get() method of dictionary data type returns
    # value of passed argument if it is present
    # in dictionary otherwise second argument will
    # be assigned as default value of passed argument
    return switcher.get(argument, "nothing")





## Dummy route to check functioning of api
@app.route('/data/api/v1.0/tasks', methods=['GET'])
@cross_origin()
def get_tasks_data():
    response = jsonify({'tasks': tasks})
    response.headers.add("Access-Control-Allow-Origin","*")
    return response


@app.route('/data/api/v2.0/getDerivedData', methods=['POST'])
@cross_origin()
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
        cursor = connection.cursor()
        cursor.execute(sql_parameterized_count_query, tuple(count_input))
        rec = cursor.fetchall()
        tr = [x[0] for x in rec]
        total_records = tr[0]
        total_pages = ceil(total_records / pageSize)


        cursor.execute(sql_parameterized_data_query, tuple(query_input))
        records = cursor.fetchall()
        row_headers = [x[0] for x in cursor.description]  # this will extract row headers
        json_data = []
        for row in records:
            json_data.append(dict(zip(row_headers, row)))

        cursor.close()
        connection.close()
        response = jsonify({'pages': total_pages, 'data': json_data})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response


@app.route('/data/api/v1.0/DataDownload', methods=['POST'])
@cross_origin()
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
        cursor = connection.cursor()
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
        print(row_headers)
        csv_data = []
        csv_data.append(row_headers)
        for row in records:
            csv_data.append(list(row))
        cursor.close()
        connection.close()
        response = jsonify({'data': csv_data})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response


@app.route('/data/api/v1.0/getVizLegend', methods=['POST'])
@cross_origin()
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
        response = jsonify({'data': ["male", "female", "total"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "partiesPresentedChart":
        response = jsonify({'data': ["Parties_Contested", "Parties_Represented"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "contestedDepositSavedChart":
        response = jsonify({'data': ["Total_Candidates", "Deposit_Lost"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "winnerCasteMap":
        response = jsonify({"data": ["General", "SC", "ST"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "numCandidatesMap":
        response = jsonify({"data": ["<5", "5-15", ">15"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "voterTurnoutMap":
        response = jsonify({"data": ["<50%", "50%-60%", "60%-70%", "70%-75%", "75%-80%", "80%-85%", "85%-90%", "90%-95%", ">95%"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "winnerGenderMap":
        response = jsonify({"data": ["Male", "Female", "Others"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "winnerMarginMap":
        response = jsonify({"data": ["<5%", "5%-10%", "10%-20%", ">20%"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module in ["winnerVoteShareMap", "partyVoteShareMap"]:
        response = jsonify({"data": ["<20%", "20%-30%", "30%-40%", "40%-50%", "50%-60%", ">60%"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "partyPositionsMap":
        response = jsonify({"data": ["1", "2", "3", ">3"]})
    if module == "notaTurnoutMap":
        response = jsonify({"data": ["<1%", "1%-3%", "3%-5%", ">5%"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "rerunningCandidates":
        response = jsonify({"data": ["Recontesting_Candidates_pct"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "timesContested":
        response = jsonify({"data": ["First_Contests_pct","Second_Contests_pct","Multiple_Contests_pct"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "incumbentsChart":
        response = jsonify({"data": ["Contesting_Incumbents_pct","Successful_Incumbents_pct"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "incumbentsStrike":
        response = jsonify({"data": ["Incumbent_Strike_Rate"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "turncoatsStrike":
        response = jsonify({"data": ["Turncoat_Strike_Rate"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "firstTimeWinners":
        response = jsonify({"data": ["No_first_time_winners_pct"]})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    if module == "occupationMLA" or module == "educationMLA":
        response = jsonify({"data": []})
        response.headers.add("Access-Control-Allow-Origin","*")
        return response
    connection = connectdb(db_config)
    if connection.is_connected():
        cursor = connection.cursor()
        cursor.execute("show tables")
        tables = cursor.fetchall()
        db_tables = []
        for (table,) in tables:
            db_tables.append(table)
        if type == "Chart":
            tableName = module_to_table_legend(module)
            if tableName in db_tables:
                cursor = connection.cursor()
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                get_count = "Select count(distinct Party) as count from " + tableName
                get_full_names = "Select distinct Party,Expanded_Party_Name from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_state = ""
                if stateName is not None:
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_state + " and position < 10" #+" order by Party"
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                options = []
                # print(records)
                for (row,) in records:
                    options.append(row)
                options.sort()
                #sorted_parties = sorted(options, key = lambda i: i['Party'])
                sql_parameterized_selected_query = get_table + get_election + get_state  + " and position < 3"
                print("Selected Query : ", sql_parameterized_selected_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_selected_query,tuple(query_input))
                selected_records = cursor.fetchall()
                selected_options = []
                for (row,) in selected_records:
                    selected_options.append(row)

                sql_parameterized_count_query = get_count + get_election + get_state
                print("Count Query : ", sql_parameterized_count_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_count_query, tuple(query_input))
                tr = [x[0] for x in cursor.fetchall()]
                total_parties = tr[0]

                selected_count_query = get_count + get_election + get_state + " and position < 10"
                print("selected Count Query : ", selected_count_query, "\n query_input :", query_input)
                cursor.execute(selected_count_query,tuple(query_input))
                tr = [x[0] for x in cursor.fetchall()]
                shown_parties = tr[0]

                party_names_query = get_full_names + get_election + get_state + " and position <10"
                cursor.execute(party_names_query, tuple(query_input))
                party_names = cursor.fetchall()
                full_party_names = {}
                cursor.close()
                connection.close()
                for (name, full_name) in party_names:
                    print(name)
                    print(full_name)
                    full_party_names.update({name: full_name})
                response = jsonify({'data': options, 'selected': selected_options, 'total_parties': total_parties, 'parties_displayed': shown_parties, 'names': full_party_names})
                response.headers.add("Access-Control-Allow-Origin","*")
                return response

        if type == "Map":
            a_no = req.get('AssemblyNo')
            # assembly = year[year.find("(")+1:year.find(")")]
            # a_no = int(assembly.replace("#",""))
            tableName = module_to_table_legend(module)
            if tableName in db_tables:
                cursor = connection.cursor()
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_assembly = " and Assembly_No = %s"
                query_input.append(a_no)
                get_state = ""
                if stateName != "Lok_Sabha":
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_assembly + get_state
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                options = []
                cursor.close()
                connection.close()
                # print(records)
                for (row,) in records:
                    options.append(row)
                options.sort()
                response = jsonify({'data': options})
                response.headers.add("Access-Control-Allow-Origin","*")
                return response




@app.route('/data/api/v1.0/getMapYear', methods=['POST'])
@cross_origin()
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
                cursor = connection.cursor()
                query_input = list()
                get_table = "Select distinct Year,Assembly_No from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_state = ""
                if stateName != "Lok_Sabha":
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_state + " and Year >2007"
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                row_headers = [x[0] for x in cursor.description]  # this will extract row headers
                json_data = []
                cursor.close()
                connection.close()
                for row in records:
                    json_data.append(dict(zip(row_headers, row)))
                response = jsonify({'data': json_data})
                response.headers.add("Access-Control-Allow-Origin","*")
                return response



@app.route('/data/api/v1.0/getMapYearParty', methods=['POST'])
@cross_origin()
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
    #a_no = req.get('AssemblyNo')
    #print('an', a_no)
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
                cursor = connection.cursor()
                query_input = list()
                get_table = "Select distinct Party from " + tableName
                # query_input.append(tableName)
                get_election = " where Election_Type = %s"
                query_input.append(electionType)
                get_assembly = " and Year > %s"
                query_input.append(2007)
                get_state = ""
                if (stateName != "Lok_Sabha"):
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)
                sql_parameterized_data_query = get_table + get_election + get_assembly + get_state
                print("Data Query : ", sql_parameterized_data_query, "\n query_input :", query_input)
                cursor.execute(sql_parameterized_data_query, tuple(query_input))
                records = cursor.fetchall()
                row_headers = [x[0] for x in cursor.description]  # this will extract row headers
                parties = []
                cursor.close()
                connection.close()
                for (row,) in records:
                    parties.append(row)
                response = jsonify({'data': parties})
                response.headers.add("Access-Control-Allow-Origin","*")
                return response


@app.route('/data/api/v1.0/getVizData', methods=['POST'])
@cross_origin()
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
            #db_tables.append(table.decode())  ## to be used if decoding from bytearray needs to be done

        tableName = module_to_table(module)
        #print('table', tableName)
        print('tables', db_tables)
        print(tables)
        if tableName in db_tables:
            cursor = connection.cursor()
            query_input = list()
            get_table = "Select * from " + tableName
            # query_input.append(tableName)
            get_election = " where Election_Type = %s"
            query_input.append(electionType)

            get_state = ""
            if type == "Chart":
                get_state = " and State_Name = %s"
                query_input.append(stateName)
            else :
                if stateName !="Lok_Sabha":
                    get_state = " and State_Name = %s"
                    query_input.append(stateName)

            get_party = ""
            if module in ["cvoteShareChart","seatShareChart","tvoteShareChart","strikeRateChart","incumbentsParty","incumbentsStrikeParty","turncoatsStrikeParty","firstTimeParty","ptyOccupationMLA","ptyEducationMLA"]:
                parties = req.get('Legends')
                # parties = party.split(",")
                if len(parties) > 0:
                    get_party = " and Party in (" + ",".join(["%s"] * len(parties)) + ") "
                    for x in parties:
                        query_input.append(x)


            get_assembly = ""
            a_no = req.get('AssemblyNo')
            print('an', a_no)
            if type == "Map":
                get_assembly = " and Assembly_No = %s"
                query_input.append(a_no)
            if type == "IP":
                get_assembly = " and Incm_Assembly_No = %s"
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
            print(row_headers)
            cursor.close()
            connection.close()

            json_data = []
            for row in records:
                json_data.append(dict(zip(row_headers, row)))

            response = jsonify({'data': json_data})
            response.headers.add("Access-Control-Allow-Origin","*")
            return response
        else:
            response = "table not found"
            response.headers.add("Access-Control-Allow-Origin","*")
            return response


nlp = spacy.load('en_core_web_md')

@app.route('/data/api/v1.0/getSearchResults', methods=['POST'])
@cross_origin()
def get_search_result():

    req = request.get_json()
    query = req.get('Query')
    process_query = query   # query after removing all matched patterns
    doc = nlp(query)
    phraseMatcher = PhraseMatcher(nlp.vocab, attr='LOWER')
    tokenMatcher = Matcher(nlp.vocab)

    GE_terms = ["lok sabha", "ls", "ge", "general election", "general elections", "national"]
    GE_patterns = list(nlp.tokenizer.pipe(GE_terms))
    phraseMatcher.add("GE_PATTERN", None, *GE_patterns)

    AE_terms = ["ae", "vidhan sabha", "state election", "state elections", "assembly election", "assembly elections"]
    AE_patterns = list(nlp.tokenizer.pipe(AE_terms))
    phraseMatcher.add("AE_PATTERN", None, *AE_patterns)

    state_patterns = [nlp.make_doc(key) for key in stateNamesDict]
    phraseMatcher.add("STATE_PATTERN", None, *state_patterns)

    matches = phraseMatcher(doc)
    electionType = ""
    stateName = "Lok_Sabha"
    party = []
    years = []

    for i in range(len(matches)):
        string_id = nlp.vocab.strings[matches[i][0]]
        if string_id == "GE_PATTERN":
            electionType = "GE"
        elif string_id == "AE_PATTERN":
            electionType = "AE"
        elif string_id == "STATE_PATTERN":
            start, end = matches[i][1], matches[i][2]
            span = doc[start:end]
            stateName = stateNamesDict.get(span.text.lower())

        if i < len(matches) - 1 and (matches[i][1] != matches[i+1][1]):
            start, end = matches[i][1], matches[i][2]
            span = doc[start:end]
            process_query = re.sub(span.text, '', process_query)

    tokenMatcher.add("YEAR_PATTERN", None, [{"TEXT": {"REGEX": "[1-9][0-9][0-9][0-9]"}}])
    matches2 = tokenMatcher(doc)
    for match_id, start, end in matches2:
        span = doc[start:end]
        years.append(span.text)
        process_query = re.sub(span.text, '', process_query)

    new_doc = nlp(process_query)
    codes_json = open('ChartsMapsCodes.json')
    codes_data = json.load(codes_json)
    similar_modules = {}

    for code in codes_data:
        similar_modules[code['modulename']] = new_doc.similarity(nlp(code['title']))

    sorted_modules = sorted(similar_modules.items(), key=operator.itemgetter(1), reverse=True)
    module = ""
    full_party_names = {}
    party_options_modules = ["cvoteShareChart", "seatShareChart", "tvoteShareChart", "strikeRateChart"]

    for i in range(len(sorted_modules)):
        module_name = sorted_modules[i][0]
        if module_name in party_options_modules:
            module = module_name
            break

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
            cursor = connection.cursor()
            query_input = list()
            get_table = "Select distinct Party from " + tableName
            get_count = "Select count(distinct Party) as count from " + tableName
            get_full_names = "Select distinct Party,Expanded_Party_Name from " + tableName
            # query_input.append(tableName)
            get_election = " where Election_Type = %s"
            if electionType == "":
                query_input.append("GE")
            else:
                query_input.append(electionType)
            get_state = ""
            if stateName is not None:
                get_state = " and State_Name = %s"
                query_input.append(stateName)

            party_names_query = get_full_names + get_election + get_state + " and position <10"
            cursor.execute(party_names_query, tuple(query_input))
            party_names = cursor.fetchall()
            cursor.close()
            connection.close()
            print(query_input)
            for (name, full_name) in party_names:
                # print(name)
                # print(full_name)
                full_party_names.update({name: full_name})

    party_patterns = []
    for key, value in full_party_names.items():
        print(key, value)
        if key is not None:
            party_patterns.append(nlp.make_doc(key))
        if value is not None:
            party_patterns.append(nlp.make_doc(value))

    partyMatcher = PhraseMatcher(nlp.vocab, attr='LOWER')
    partyMatcher.add("PARTY_PATTERN", None, *party_patterns)
    party_matches = partyMatcher(new_doc)

    for match_id, start, end in party_matches:
        span = doc[start:end]
        party_match = span.text.upper()
        for key, value in full_party_names.items():
            if party_match == key or party_match == value:
                party.append(key)

    results = {}
    results["electionType"] = electionType
    results["stateName"] = stateName
    results["year"] = years
    results["similarModules"] = sorted_modules
    results["party"] = party

    response = jsonify({'results': results})
    response.headers.add("Access-Control-Allow-Origin","*")
    return response


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
