from django.shortcuts import render
from django.http import HttpResponse
# from django.shortcuts import render_to_response
from django.http import JsonResponse
# Create your views here.
from .models import Womens,Contested_Deposit_Losts,Maps,Mastersheet,Parties_Contests,Party_Statistics,Partys,Partysummary,Voter_Turnout,Voteshares_Cont,Voteshares_Total
from django.views.decorators.csrf import csrf_exempt,csrf_protect
from django.db import connections
from django.db.utils import OperationalError
import json
from django.core import serializers
from math import ceil
from django.apps import apps
from django.contrib.staticfiles.views import serve
# from django.conf import settings

import csv

from django.http import StreamingHttpResponse
# from django.utils import simplejson
import os
os.chdir("..")
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


db_conn = connections['default']
try:
    db_cursor = db_conn.cursor()
except OperationalError:
    connected = False
else:
    connected = True

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
        "winnerMarginMap": "maps",            # x = x.values()

        "winnerVoteShareMap": "maps",
        "partyPositionsMap": "partys",
        "partyVoteShareMap": "partys",
        "notaTurnoutMap": "maps"
    }
    return switcher.get(argument, "nothing")

def tasks(request):
    t = [
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

    return(JsonResponse(t,safe=False))

@csrf_exempt
def get_derived_data(request):
    if connected == True:
        if request.method == 'POST':
            t = [
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

            # received_json_data = request.body.decode('utf-8')

            received_json_data=json.loads(request.body) #!NOTE-recentchange
            # received_json_data = request.POST
            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            print('et',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            print('statename',stateName)
        
            assemblyNo = received_json_data.get('AssemblyNo') #get AssemblyNo from dict
            print('an', assemblyNo)

            pageNo = int(received_json_data.get('PageNo')) #get PageNO from dict

            pageSize = int(received_json_data.get('PageSize')) #get PageSize from dict
            
            filters = received_json_data.get('Filters') ##get Filters from dict
            print("filters", filters)


            sort = received_json_data.get("SortOptions") #get SortOptions from dict
            print("sort ", sort)
            
            cursor = db_cursor

            states = stateName.split(",") #collection of string(s)

            assemblies = assemblyNo.split(",") # list containing each assembly selected by user
            
            StartIndex = pageNo * pageSize # starting index of the queries

            select_all = Mastersheet.objects.all()
            if  states[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type=electionType)
            elif assemblies[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states)
            else:
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states,Assembly_No__in=assemblies)


            for item in filters:
                id1 = item.get('id') # stores the specified field for e:g 'Name'
                val = item.get('value') # corresponding value pair for that field
                id1 = id1+'__icontains' # behaves similarly to %LIKE% 

                x = x.filter(**{id1:val}) # applies filter specific to the filed

            for op in sort: #op refers to each dictionary in the sortlist
                col = op.get('id') # gets the column from the ith dict
                desc = op.get('desc') #gets whether the value is descending or ascending                
                if desc:
                    # temp ="DESC"
                    x = x.order_by(col.desc())
                else:
                    # temp = "ASC"
                    x = x.order_by(col.asc())

            print(x.query)

            # print(x,json.dump(x.all()[:]))
            no_of_pages = ceil(len(list(select_all.values()))//pageSize)


            print("no of pages",no_of_pages)    
            y = list(x.values())[StartIndex:pageSize]
            num_pages = len(list(x.values()))//pageSize # number of pages
            print("num_pages:",num_pages)

            m = list(x.values())
            z = serializers.serialize('json',x.all())

            return JsonResponse({'data':y,'pages':num_pages},safe=False)

        # if request.method == 'GET':
        #     x = Mastersheet.objects.filter(Election_Type='AE',State_Name='Delhi',Assembly_No=3)
        #     # x = x.values()
        #     # x = x.values()
        #     data = serializers.serialize('json', x)

        #     return HttpResponse(data, content_type='application/json')


@csrf_exempt
def get_download_data(request):
    if connected == True:
        if request.method == 'POST':

            received_json_data=json.loads(request.body)

            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            # print('et',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            # print('statename',stateName)
            
            assemblyNo = received_json_data.get('AssemblyNo') #get AssemblyNo from dict
            # print('an', assemblyNo)

            pageNo = int(received_json_data.get('PageNo')) #get PageNO from dict

            pageSize = int(received_json_data.get('PageSize')) #get PageSize from dict
            
            filters = received_json_data.get('Filters') ##get Filters from dict
            print("filters", filters)

            StartIndex = pageNo * pageSize

            cursor = db_cursor
            assemblies = assemblyNo.split(",")
            states = stateName.split(",") #collection of string(s)

            if  states[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type=electionType)
            elif assemblies[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states)
            else:
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states,Assembly_No__in=assemblies)


            for item in filters:
                id1 = item.get('id') # stores the specified field for e:g 'Name'
                val = item.get('value') # corresponding value pair for that field
                id1 = id1+'__icontains' # behaves similarly to %LIKE% 

                x = x.filter(**{id1:val}) # applies filter specific to the filed

            q1 = list(x.values())

            return JsonResponse(q1,safe = False)


@csrf_exempt
def get_viz_legend(request):

    if connected == True:
        if request.method == 'POST':

            received_json_data=json.loads(request.body)

            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            print('et:',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            print('statename:',stateName)

            module = received_json_data.get('ModuleName')
            print('module : ',module)

            type1 = received_json_data.get('VizType')
            print('type: ',type1)

            if module == "voterTurnoutChart":
                return JsonResponse({'data': ["male", "female", "total"]},safe= False) 
            if module == "partiesPresentedChart":
                return (JsonResponse({'data': ["Parties_Contested", "Parties_Represented"]},safe=False))
            if module == "contestedDepositSavedChart":
                return (JsonResponse({'data': ["Total_Candidates", "Deposit_Lost"]},safe=False))
            if module == "winnerCasteMap":
                return (JsonResponse({"data": ["General", "SC", "ST"]},safe=False))
            if module == "numCandidatesMap":
                return (JsonResponse({"data": ["<5", "5-15", ">15"]},safe=False))
            if module == "voterTurnoutMap":
                return (JsonResponse({"data": ["<50%", "50%-60%", "60%-70%", "70%-75%", "75%-80%", "80%-85%", "85%-90%", "90%-95%", ">95%"]},safe=False))
            if module == "winnerGenderMap":
                return (JsonResponse({"data": ["Male", "Female", "Others"]},safe=False))
            if module == "winnerMarginMap":
                return (JsonResponse({"data": ["<5%", "5%-10%", "10%-20%", ">20%"]},safe=False))
            if module in ["winnerVoteShareMap", "partyVoteShareMap"]:
                return (JsonResponse({"data": ["<20%", "20%-30%", "30%-40%", "40%-50%", "50%-60%", ">60%"]},safe=False))
            if module == "partyPositionsMap":
                return (JsonResponse({"data": ["1", "2", "3", ">3"]},safe=False))
            if module == "partyVoteShareMap":
                return (JsonResponse({"data": ["1", "2", "3", ">3"]},safe=False))
            if module == "notaTurnoutMap":
                return (JsonResponse({"data": ["<1%", "1%-3%", "3%-5%", ">5%"]},safe=False))
            
            if type1 == 'Chart':

                table_name  = module_to_table(module)
                print('table-name:',table_name)
                Table1 = apps.get_model(app_label='v1',model_name = table_name) # getting the table name
                x = Table1.objects # select table
                x2 = x.filter(Election_Type = electionType) # where election type = %
                x3 = x2 # get election + distinct(party) from specified table
                if stateName is not None:
                    x3 = x2.filter(State_Name = stateName) # get election + state 
                x4 = x3.filter(Position__lte=9)# get election + state + position <10  
                
                parties1 = list(x4.values('Party').distinct())
                party_list1 = []
                for i in parties1:
                    party_list1.append(i['Party']) 

                query1 = sorted(party_list1) #![options]   get election + state + position from table + distinct(party)

                x5 = x4.filter(Position__lte=2)
                parties2 = list(x5.values('Party').distinct()) 
                parties_list2 = []
                for i in parties2:
                    parties_list2.append(i['Party'])
                    
                query2 = sorted(parties_list2) # ![selected_options] selected query i.e get election + state + distinct(party) + position < 10 + position < 3

                parties3 = list(x3.values('Party').distinct())
                parties_list3 = []
                for i in parties3:
                    parties_list3.append(i['Party'])


                 # get election + state + count() + distinct(party)
                query3 = len(sorted(parties_list3)) # ![total parties ] get count of x3


                # x7 = x4 # get election + state + count() + distinct(party) + position <=9 or <10

                # parties4 = list(x7.values('Party').distinct())
                # parties_list4 = []
                # for i in parties4:
                #     parties_list4.append(i['Party'])
            

                query4 = len(sorted(party_list1)) #![shown _ parties ] applied position filter to total parties

                x8 = x3
                x8 = x8.filter(Position__lte=9) # get election  + distinct(party, expanded party) + state + position
                
                parties5 = list(x8.values('Party','Expanded_Party_Name').distinct())
            
                parties_dict = {}
                for i in parties5:
                    key1 = i.get('Party')
                    val1 = i.get('Expanded_Party_Name')
                    parties_dict[key1] = val1


                query5 = parties_dict # ![full_party_names] party_name query

                dict1 = {'data':query1,'selected':query2,'total_parties':query3,'parties_displayed':query4,'names':query5}

                return JsonResponse(dict1,safe=False)

            if type1 == 'Map':

                assembly_no = received_json_data.get('AssemblyNo')
                print('assembly-no:',assembly_no)
                # assembly_no = assembly_no.split(',')
                
                table_name = module_to_table(module)
                print('table-name: ',table_name)

                Table2 = apps.get_model(app_label='v1',model_name = table_name)

                x = Table2.objects
                x1 = x.filter(Election_Type= electionType,Assembly_No = assembly_no) # get election + distinct(party) + assembly
                # print('\n',x1.values())
                if stateName!= 'Lok_Sabha':
                    x1 = x1.filter(State_Name = stateName) # get election + distinct(party) + assembly + state
                
                t_parties = list(x1.values('Party').distinct())
                print(t_parties)
                party_list = []
                
                for i in t_parties:
                    party_list.append(i['Party'])
                        
                party_list = sorted(party_list)

                return JsonResponse({'data':party_list},safe=False)

@csrf_exempt
def get_map_year(request):
    if connected == True:
        if request.method == 'POST':

            received_json_data=json.loads(request.body)

            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            print('et',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            print('statename',stateName)

            module = received_json_data.get('ModuleName')
            print('module : ',module)

            type1 = received_json_data.get('VizType')
            print('type',type1)


            if type1 == 'Map':

                table_name  = module_to_table(module)

                Table1 = apps.get_model(app_label='v1',model_name = table_name)

                x = Table1.objects.filter(Election_Type = electionType,Year__gte =2008)
                x1 = x
                if stateName != "Lok_Sabha":
                    x1 = x1.filter(State_Name = stateName)

                q1 = list(x1.values('Year','Assembly_No').distinct())
    
                return(JsonResponse({'data':q1},safe=False))



@csrf_exempt
def get_year_party(request):

    if connected == True:
        if request.method == 'POST':

            received_json_data=json.loads(request.body)

            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            print('et',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            print('statename',stateName)

            module = received_json_data.get('ModuleName')
            print('module : ',module)

            assembly_no = received_json_data.get('AssemblyNo')
            print('assemblyno',assembly_no)
            # assembly_no = assembly_no.split(',') # storing the assemblies

            type1 = received_json_data.get('VizType')
            print('type',type1)

            if type1 == "Map":

                table_name  = module_to_table(module)
                Table1 = apps.get_model(app_label='v1',model_name = table_name)
                x = Table1.objects

                x1 = x.filter(Election_Type = electionType,Assembly_No = assembly_no)

                if stateName!= "Lok_Sabha":
                    x1 = x1.filter(State_Name = stateName)

                query8 = list(x1.values('Party').distinct())
                query8_list = []
                for i in query8:
                    query8_list.append(i['Party'])
                # query8_list = sorted(query8_list)

                return(JsonResponse({'data':query8_list},safe=False))


                
@csrf_exempt
def get_viz_data(request):

    if connected == True:
        if request.method == 'POST':

            received_json_data=json.loads(request.body)

            electionType = received_json_data.get('ElectionType') #get ElectionType from dict
            print('et',electionType)
        
            stateName = received_json_data.get('StateName') #get Election from dict
            print('statename',stateName)

            module = received_json_data.get('ModuleName')
            print('module : ',module)

            assembly_no = received_json_data.get('AssemblyNo')
            print('assemblyno',assembly_no)
            # assembly_no = assembly_no.split(',')

            type1 = received_json_data.get('VizType')
            print('type',type1)

            table_name  = module_to_table(module)
            Table1 = apps.get_model(app_label='v1',model_name = table_name)

            x = Table1.objects.filter(Election_Type = electionType)
            x1 = x


            if type1 == "Chart" or stateName !="Lok_Sabha":
                x1 = x1.filter(State_Name = stateName)

            if module in ["cvoteShareChart", "seatShareChart", "tvoteShareChart", "strikeRateChart"]:
                parties = received_json_data.get('Legends')     
                x1 = x1.filter(Party__in=parties)

            if type1 == "Map":
                x1 = x1.filter(Assembly_No = assembly_no)


            if module in ["partyPositionsMap", "partyVoteShareMap"]:
                party = received_json_data['Party']
                x1 = x1.filter(Party = party)



            q2 = list(x1.values())

            return JsonResponse({'data':q2},safe=False)

@csrf_exempt
def get_static_data(request):
     if connected == True:
         if request.method == 'GET':
            p = BASE_DIR+'/static/India_PC_json.geojson'
            
            return serve(request,p)

@csrf_exempt
class Echo:
    """An object that implements just the write method of the file-like
    interface.
    """
    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value

@csrf_exempt
def get_direct_download_data(request):
    if connected == True:
        if request.method == 'GET':
            
            pseudo_buffer = Echo()
            csv_writer = csv.writer(pseudo_buffer)
            electionType = request.GET.get('ElectionType') #get ElectionType from dict
            # print('et',electionType)
        
            stateName = request.GET.get('StateName') #get Election from dict
            # print('statename',stateName)
            if stateName==None or electionType==None:
                x = Mastersheet.objects
                q1 = x.values_list() # tuple of values returned
                rows = (csv_writer.writerow(row) for row in q1)
                resp = StreamingHttpResponse(rows, content_type="text/csv")
                resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                return resp
                
            states = stateName.split(",") #

            assemblyNo = request.GET.get('AssemblyNo') #get AssemblyNo from dict
            # print('an', assemblyNo)
            if assemblyNo is None:
                assemblyNo = []
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states)
                q1 = x.values_list() # tuple of values returned
                rows = (csv_writer.writerow(row) for row in q1)
                resp = StreamingHttpResponse(rows, content_type="text/csv")
                resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                return resp

            filters = received_json_data.get('Filters') ##get Filters from dict
            assemblies = assemblyNo.split(",")

            if filters is None:
                filters = []
                x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states,Assembly_No__in=assemblies)
                q1 = x.values_list() # tuple of values returned
                rows = (csv_writer.writerow(row) for row in q1)
                resp = StreamingHttpResponse(rows, content_type="text/csv")
                resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                return resp

            print("filters", filters)

            # cursor = db_cursor


            for item in filters:
                id1 = item.get('id') # stores the specified field for e:g 'Name'
                val = item.get('value') # corresponding value pair for that field
                id1 = id1+'__icontains' # behaves similarly to %LIKE% 

                x = x.filter(**{id1:val}) # applies filter specific to the filed

                q1 = x.values_list() # tuple of values returned
                rows = (csv_writer.writerow(row) for row in q1)
                resp = StreamingHttpResponse(rows, content_type="text/csv")
                resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                return resp









if __name__ == "__main__":
    from models import Mastersheet
    x = Mastersheet.objects.filter(Election_Type='AE',State_Name='Delhi',Assembly_No=3)
    x = x.values()
    print(x)
    # x = x.values()
    # x = x.values()
    data = serializers.serialize('json', x)
