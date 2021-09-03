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
import itertools
import spacy
from spacy.matcher import PhraseMatcher, Matcher
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

def none_checker_dict(arg):
    result = {}
    list1 = ['ElectionType','StateName','AssemblyNo','PageNo','PageSize','Filters','SortOptions']
    print(arg)
    for key,value in arg.items():
        if arg.get(key,None) is None:
            value = 'all'
        result[key] = value
    
    
    for i in list1:
        try:
            print(result[i])
        except:
            if i=='Filters':
                result[i] = []
            elif i=='SortOptions':
                result[i] = []
            else:    
                result[i] = 'all'
    
    return result

def none_checker_val(vari):
    x = ''
    print('vari is',vari)
    if vari:
        x = vari
        print("1. x is ",x)
    elif vari is None:
        print("hahshasdhadasdbasjdbkk")
    else:
        x = "all"
        print('2. x is ',x)
    print("x finally is ",x)
    return x

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
            received_json_data = none_checker_dict(received_json_data) #!returning modified dictionary after eliminating the Nonetypes
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
            
            elections = electionType.split(",") # elecition type can have multiple options

            states = stateName.split(",") #collection of string(s)

            assemblies = assemblyNo.split(",") # list containing each assembly selected by user
            

            StartIndex = pageNo * pageSize # starting index of the queries

            select_all = Mastersheet.objects.all()
            if  states[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type__in=elections)
            elif assemblies[0] == 'all':
                x = Mastersheet.objects.filter(Election_Type__in=elections,State_Name__in = states)
            else:
                x = Mastersheet.objects.filter(Election_Type__in=elections,State_Name__in = states,Assembly_No__in=assemblies)


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
            # no_of_pages = ceil(len(list(select_all.values()))//pageSize)


            # print("no of pages",no_of_pages)    
            y = list(x.values())[StartIndex:pageSize]
            num_pages = (x.count()//pageSize)
            # num_pages = len(list(x.values()))//pageSize # number of pages !TODO:!use x.count 
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

            # pageNo = int(received_json_data.get('PageNo')) #get PageNO from dict

            # pageSize = int(received_json_data.get('PageSize')) #get PageSize from dict
            
            filters = received_json_data.get('Filters') ##get Filters from dict
            print("filters", filters)

            # StartIndex = pageNo * pageSize

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
            
            # return serve(request,p)
            return render(request,'index.html')   

# @csrf_exempt
# def get_docs(request):  
#     return render(request,'index.html')   

@csrf_exempt
class Echo:
    """An object that implements just the write method of the file-like
    interface.
    """
    def write(self, value):
        """Write the value by returning it, instead of storing in a buffer."""
        return value

@csrf_exempt
def get_headers():
    HEADERS = ['Election_Type','State_Name','Assembly_No','Constituency_No','Year','month','Poll_No','DelimID','Position','Candidate','Sex','Party','Votes','Candidate_Type','Valid_Votes','Electors','Constituency_Name','Constituency_Type','Sub_Region','N_Cand','Turnout_Percentage','Vote_Share_Percentage','Deposit_Lost','Margin','Margin_Percentage','ENOP','pid','Party_Type_TCPD','Party_ID','last_poll','Contested','Last_Party','Last_Party_ID','Last_Constituency_Name','Same_Constituency','Same_Party','No_Terms','Turncoat','Incumbent','Recontest','Age','District_Name']
    return HEADERS

@csrf_exempt
def get_direct_download_data(request):
    if connected == True:
        if request.method == 'GET':

            HEADERS = [get_headers()] 
            pseudo_buffer = Echo()
            csv_writer = csv.writer(pseudo_buffer)
            csv_writer.writerow(get_headers())
            electionType = request.GET.get('ElectionType') #get ElectionType from dict
            # print('et',electionType)
            stateName = request.GET.get('StateName') #get Election from dict
            assemblyNo = request.GET.get('AssemblyNo') #get AssemblyNo from dict

            if assemblyNo is None: #checking the value as soon as it is assigned
                assemblyNo='all'

            if stateName is None: #! if we pass this to a function it doesn't remain as None, and gets assigned a temporary value
                stateName='all'

            if electionType is None:
                electionType='all'
            
            print("\n","e:",electionType,"  s:",stateName,"  a:",assemblyNo)

            elections = electionType.split(",")    
            states = stateName.split(",") #
            assemblies = assemblyNo.split(",")
            if assemblies[0]!='all':
                assemblies = [ int(i) for i in assemblies]
                print("assemblies have been changed")

            filename1 = ''
            print('el_list:',elections,' ','st_list: ',states,"  assemblies: ",assemblies,'\n')
            # if electionType==None:
            #     x = Mastersheet.objects
            #     q1 = x.values_list() # tuple of values returned
                # rows = (csv_writer.writerow(row) for row in q1)
                # resp = StreamingHttpResponse(rows, content_type="text/csv")
                # resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                # return resp

            if elections[0] =='all':
                if states[0] == 'all':
                    if assemblies[0]=='all':
                        q1 = Mastersheet.objects # if all three agree
                        filename1 = filename1 + 'All-Elec_All-States_All-Assemblies'
                    else:
                        q1 = Mastersheet.objects.filter(Assembly_No__in = assemblies)
                        filename1 = filename1 + 'All-Elec_All-States_'+ ','.join([str(i) for i in assemblies]) + '-assemblies'
                
                elif assemblies[0] == 'all':
                    q1 = Mastersheet.objects.filter(State_Name__in = states)
                    filename1 = filename1 + 'All-Elec_' + ','.join([i for i in states]) + '-states_' + 'All-Assemblies'
                else:
                    q1 = Mastersheet.objects(State_Name__in = states,Assembly_No__in = assemblies)
                    
                    filename1 = filename1 + 'All-Elec_' +  ','.join(states) + '-states_' + ','.join([str(i) for i in assemblies]) + '-assemblies'
         
                # if states[0]!='all' and assemblies[0]!='all':
                #     q1 = Mastersheet.objects(State_Name__in = states,Assembly_No__in = assemblies)
                # elif states[0] == 'all' and assemblies[0]=='all':
                #     q1 = Mastersheet.objects

            elif states[0] == 'all':
                if assemblies[0]=='all':
                    q1 = Mastersheet.objects.filter(Election_Type__in=elections)
                    filename1 = filename1 + ','.join([i for i in elections]) + '-elections_' + 'All-States_All-Assemblies'
                else:
                    q1 = Mastersheet.objects.filter(Election_Type__in=elections,Assembly_No__in = assemblies)
                    filename1 = filename1 + ','.join([i for i in elections]) + '-elections_' + 'All-States_' + ','.join([str(i) for i in assemblies]) + '-assemblies'
            
            elif assemblies[0] == 'all':
                q1 = Mastersheet.objects.filter(Election_Type__in=elections,State_Name__in = states)
                filename1 = filename1 + ','.join([i for i in elections]) + '-elections_'  + ','.join([i for i in states]) + '-states_' + 'All-Assemblies'
                            
            else:
                q1 = Mastersheet.objects.filter(Election_Type__in=elections,State_Name__in = states,Assembly_No__in = assemblies)
                statenames = str(','.join(states))
                electionnames = str(','.join(elections))
                print(statenames,electionnames)
                filename1 = filename1 + electionnames + '-elections_'  + statenames + '-states_' + ','.join([str(i) for i in assemblies]) + '-assemblies'
            
            filename1 = filename1.replace("'","")
            
            # print('an', assemblyNo)
            # if assemblyNo is None:
            #     assemblyNo = []
            #     x = Mastersheet.objects.filter(Election_Type=electionType,State_Name__in = states)
            #     q1 = x.values_list() # tuple of values returned
                # rows = (csv_writer.writerow(row) for row in q1)
                # resp = StreamingHttpResponse(rows, content_type="text/csv")
                # resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
                # return resp


            filters = request.GET.get('Filters') ##get Filters from dict
            # assemblies = assemblyNo.split(",")
            filename1 = 'TCPD_' + filename1 + '.csv'
            if filters is None:
                filters = []
                print("no filters",filename1)
                # x = Mastersheet.objects.filter(Election_Type__in=elections,State_Name__in = states,Assembly_No__in=assemblies)
                q2 = q1.values_list() # tuple of values returned

                # HEADERS = ['Election_Type','State_Name','Assembly_No','Constituency_No','Year','month','Poll_No','DelimID','Position','Candidate','Sex','Party','Votes','Candidate_Type','Valid_Votes','Electors','Constituency_Name','Constituency_Type','Sub_Region','N_Cand','Turnout_Percentage','Vote_Share_Percentage','Deposit_Lost','Margin','Margin_Percentage','ENOP','pid','Party_Type_TCPD','Party_ID','last_poll','Contested','Last_Party','Last_Party_ID','Last_Constituency_Name','Same_Constituency','Same_Party','No_Terms','Turncoat','Incumbent','Recontest','Age','District_Name']
                # q2.insert(0,HEADERS)
                headers = (csv_writer.writerow(h) for h in HEADERS) 

                # rows =(csv_writer.writerow(row) for row in q2) 
                
                rows =(csv_writer.writerow(row) for row in q2)
                rows2 = itertools.chain(headers,rows)

                print(type(rows))

                resp = StreamingHttpResponse(rows2, content_type="text/csv")
                resp['Content-Disposition'] = f'attachment; filename=\"{filename1}\"'
                return resp


            #!if unfiltered
            print("filters", filters)

            # cursor = db_cursor

            for item in filters:
                id1 = item.get('id') # stores the specified field for e:g 'Name'
                val = item.get('value') # corresponding value pair for that field
                id1 = id1+'__icontains' # behaves similarly to %LIKE% 
                
                q1 = q1.filter(**{id1:val}) # applies filter specific to the filed
                #!after filtering 

            
            q2 = q1.values_list() # tuple of values returned
            HEADERS = ['Election_Type','State_Name','Assembly_No','Constituency_No','Year','month','Poll_No','DelimID','Position','Candidate','Sex','Party','Votes','Candidate_Type','Valid_Votes','Electors','Constituency_Name','Constituency_Type','Sub_Region','N_Cand','Turnout_Percentage','Vote_Share_Percentage','Deposit_Lost','Margin','Margin_Percentage','ENOP','pid','Party_Type_TCPD','Party_ID','last_poll','Contested','Last_Party','Last_Party_ID','Last_Constituency_Name','Same_Constituency','Same_Party','No_Terms','Turncoat','Incumbent','Recontest','Age','District_Name']
            q2.insert(0,HEADERS)
            headers = (csv_writer.writerow(get_headers()),)
            rows = headers + (csv_writer.writerow(row) for row in q2)
            resp = StreamingHttpResponse(rows, content_type="text/csv")
            # resp['Content-Disposition'] = 'attachment; filename="somefilename.csv"'
            resp['Content-Disposition'] = f'attachment; filename=\"{filename1}\" '
            return resp #


@csrf_exempt
def get_search_result(request):
    if connected == True:
        if request.method == 'POST':
            nlp = spacy.load('en_core_web_md')

            received_json_data=json.loads(request.body)
            query = received_json_data.get('Query')
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

            x = Mastersheet.objects # selecting everything
            if electionType == "":
                x1 = x.filter(Election_Type = 'GE')
            else:
                x1 = x.filter(Election_Type = electionType)

            if stateName is not None:
                x1 = x1.filter(State_Name = stateName)

            x1 = x1.filter(Position__lte=9) 
            
            executed_q = list(x1.values('Party','Expanded_Party_Name').distinct()) #after query is executed
            
            parties_dict = {} #partyname as key and value as expanded name
            for i in executed_q:
                key1 = i.get('Party')
                val1 = i.get('Expanded_Party_Name')
                parties_dict[key1] = val1   

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

            return JsonResponse({'result':results},safe=False)
            # return jsonify({'results': results})


if __name__ == "__main__":
    from models import Mastersheet
    x = Mastersheet.objects.filter(Election_Type='AE',State_Name='Delhi',Assembly_No=3)
    x = x.values()
    print(x)
    # x = x.values()
    # x = x.values()
    data = serializers.serialize('json', x)

