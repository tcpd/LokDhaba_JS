# rm -r LokdhabaApi/Maps
# if [ -d "LokdhabaApi/Maps" ]; then rm -Rf LokdhabaApi/Maps; fi
# mkdir LokdhabaApi/Maps
# mkdir LokdhabaApi/Maps/GE
# mkdir LokdhabaApi/Maps/AE
# cp -r  <tcpd_data git repository location>/GE/Maps/Delim4/* LokdhabaApi/Maps/GE/
# cp -r  <tcpd_data git repostitory location>/AE/Maps/Delim4/* LokdhabaApi/Maps/AE/
# -------------------------------
# CODE REMOVED. 
# It breaks the Maps charts in ld_ui 

# Bring LD in sync with the GitLab repo
cd utils
python LD_sync_with_repo.py
cd ..

docker stop ld_ui ld_api ld_db
docker rm ld_ui ld_api ld_db
sudo docker-compose up -d --build
Rscript db/tcpd_sql_setup.R