import pandas as pd
import os
import json

TCPD_DATA_REPO_PATH = "../tcpd_data/data"

# Update AE assembly numbers so that LD/Browse_Data shows correct options
AE_master_path = os.path.join(TCPD_DATA_REPO_PATH, "AE", "VidhaSabhaNumber.csv")
AE_master_df = pd.read_csv(AE_master_path, low_memory=False)

AE_column_map = {
    "month" : "month",
    "DelimID" : "DelimID",
    "Assembly_No" : "sa_no",
    "State_Name" : "state",
    "Year" : "year",
}

AE_master_df[list(AE_column_map.keys())] = AE_master_df[list(AE_column_map.values())]
AE_master_df = AE_master_df[list(AE_column_map.keys())]

AE_out = [v for k,v in AE_master_df.T.to_dict().items()]
AE_out_path = "../lokdhaba_js/src/Assets/Data/VidhanSabhaNumber.json"

with open(AE_out_path, 'w+') as f:
    json.dump(AE_out, f, indent = 4)


# Same for GE now
GE_master_path = os.path.join(TCPD_DATA_REPO_PATH, "GE", "Data", "derived", "mastersheet.csv")
GE_master_df = pd.read_csv(GE_master_path, low_memory=False)

keep_cols = [
    "Assembly_No",
    "State_Name",
    "Year"
]

GE_master_df = GE_master_df.drop_duplicates(subset = ['Assembly_No', 'State_Name'], keep = 'first')
zero_assembly_rows = GE_master_df['Assembly_No'] == 0
GE_master_df = GE_master_df[~zero_assembly_rows]
GE_master_df = GE_master_df[keep_cols]

GE_out = [v for k,v in GE_master_df.T.to_dict().items()]
GE_out_path = "../lokdhaba_js/src/Assets/Data/LokSabhaNumber.json"

with open(GE_out_path, 'w+') as f:
    json.dump(GE_out, f, indent = 4)

print("[STATUS] Synchronised data files b/w LD and TCPD-GitLab repo")