# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Contested_Deposit_Losts(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Total_Candidates = models.IntegerField(db_column='Total_Candidates', blank=True, null=True)  # Field name made lowercase.
    Deposit_Lost = models.IntegerField(db_column='Deposit_Lost', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'contested_deposit_losts'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No'),)


class DjangoMigrations(models.Model):
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class Maps(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Constituency_No = models.IntegerField(db_column='Constituency_No')  # Field name made lowercase.
    Constituency_Name = models.CharField(db_column='Constituency_Name', max_length=50)  # Field name made lowercase.
    Turnout_Percentage = models.DecimalField(db_column='Turnout_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Vote_Share_Percentage = models.DecimalField(db_column='Vote_Share_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Constituency_Type = models.CharField(db_column='Constituency_Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    Electors = models.IntegerField(db_column='Electors', blank=True, null=True)  # Field name made lowercase.
    N_Cand = models.IntegerField(db_column='N_Cand', blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(db_column='Position')  # Field name made lowercase.
    Sex = models.CharField(db_column='Sex', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    Votes = models.IntegerField(db_column='Votes', blank=True, null=True)  # Field name made lowercase.
    Candidate = models.CharField(db_column='Candidate', max_length=255)  # Field name made lowercase.
    Margin_Percentage = models.DecimalField(db_column='Margin_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Runner = models.CharField(db_column='Runner', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Runner_Party = models.CharField(db_column='Runner_Party', max_length=50, blank=True, null=True)  # Field name made lowercase.
    Runner_Sex = models.CharField(db_column='Runner_Sex', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Nota_Percentage = models.DecimalField(db_column='Nota_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'maps'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Constituency_No'),)


class Mastersheet(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Constituency_No = models.IntegerField(db_column='Constituency_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    month = models.IntegerField(blank=True, null=True)
    Poll_No = models.IntegerField(db_column='Poll_No')  # Field name made lowercase.
    DelimID = models.IntegerField(db_column='DelimID', blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(db_column='Position')  # Field name made lowercase.
    Candidate = models.CharField(db_column='Candidate', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Sex = models.CharField(db_column='Sex', max_length=3, blank=True, null=True)  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Votes = models.IntegerField(db_column='Votes', blank=True, null=True)  # Field name made lowercase.
    Candidate_Type = models.CharField(db_column='Candidate_Type', max_length=5, blank=True, null=True)  # Field name made lowercase.
    Valid_Votes = models.IntegerField(db_column='Valid_Votes', blank=True, null=True)  # Field name made lowercase.
    Electors = models.IntegerField(db_column='Electors', blank=True, null=True)  # Field name made lowercase.
    Constituency_Name = models.CharField(db_column='Constituency_Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Constituency_Type = models.CharField(db_column='Constituency_Type', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Sub_Region = models.CharField(db_column='Sub_Region', max_length=255, blank=True, null=True)  # Field name made lowercase.
    N_Cand = models.IntegerField(db_column='N_Cand', blank=True, null=True)  # Field name made lowercase.
    Turnout_Percentage = models.DecimalField(db_column='Turnout_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Vote_Share_Percentage = models.DecimalField(db_column='Vote_Share_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Deposit_Lost = models.CharField(db_column='Deposit_Lost', max_length=3, blank=True, null=True)  # Field name made lowercase.
    Margin = models.IntegerField(db_column='Margin', blank=True, null=True)  # Field name made lowercase.
    Margin_Percentage = models.DecimalField(db_column='Margin_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    ENOP = models.FloatField(db_column='ENOP', blank=True, null=True)  # Field name made lowercase.
    pid = models.CharField(max_length=255, blank=True, null=True)
    Party_Type_TCPD = models.CharField(db_column='Party_Type_TCPD', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Party_ID = models.IntegerField(db_column='Party_ID', blank=True, null=True)  # Field name made lowercase.
    last_poll = models.CharField(max_length=10, blank=True, null=True)
    Contested = models.IntegerField(db_column='Contested', blank=True, null=True)  # Field name made lowercase.
    Last_Party = models.CharField(db_column='Last_Party', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Last_Party_ID = models.IntegerField(db_column='Last_Party_ID', blank=True, null=True)  # Field name made lowercase.
    Last_Constituency_Name = models.CharField(db_column='Last_Constituency_Name', max_length=255, blank=True, null=True)  # Field name made lowercase.
    Same_Constituency = models.CharField(db_column='Same_Constituency', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Same_Party = models.CharField(db_column='Same_Party', max_length=10, blank=True, null=True)  # Field name made lowercase.
    No_Terms = models.IntegerField(db_column='No_Terms', blank=True, null=True)  # Field name made lowercase.
    Turncoat = models.CharField(db_column='Turncoat', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Incumbent = models.CharField(db_column='Incumbent', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Recontest = models.CharField(db_column='Recontest', max_length=10, blank=True, null=True)  # Field name made lowercase.
    Age = models.IntegerField(db_column='Age', blank=True, null=True)  # Field name made lowercase.
    District_Name = models.CharField(db_column='District_Name', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'mastersheet'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Constituency_No', 'Poll_No', 'Position'),)


class Parties_Contests(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Parties_Contested = models.IntegerField(db_column='Parties_Contested', blank=True, null=True)  # Field name made lowercase.
    Parties_Represented = models.IntegerField(db_column='Parties_Represented', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'parties_contests'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No'),)


class Party_Statistics(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    Total_Seats_in_Assembly = models.IntegerField(db_column='Total_Seats_in_Assembly')  # Field name made lowercase.
    Total_Votes_in_Assembly = models.IntegerField(db_column='Total_Votes_in_Assembly')  # Field name made lowercase.
    Total_Votes_in_Contested_Seats = models.IntegerField(db_column='Total_Votes_in_Contested_Seats')  # Field name made lowercase.
    Total_Candidates = models.IntegerField(db_column='Total_Candidates', blank=True, null=True)  # Field name made lowercase.
    Winners = models.IntegerField(db_column='Winners')  # Field name made lowercase.
    Deposit_Lost = models.IntegerField(db_column='Deposit_Lost', blank=True, null=True)  # Field name made lowercase.
    Strike_Rate = models.DecimalField(db_column='Strike_Rate', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Seat_Share = models.DecimalField(db_column='Seat_Share', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Vote_Share_in_Assembly = models.DecimalField(db_column='Vote_Share_in_Assembly', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Vote_Share_in_Contested_Seats = models.DecimalField(db_column='Vote_Share_in_Contested_Seats', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(blank=True, null=True)
    Expanded_Party_Name = models.CharField(db_column='Expanded_Party_Name', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'party_statistics'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Party'),)


class Partys(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Constituency_No = models.IntegerField(db_column='Constituency_No')  # Field name made lowercase.
    Constituency_Name = models.CharField(db_column='Constituency_Name', max_length=50)  # Field name made lowercase.
    Vote_Share_Percentage = models.DecimalField(db_column='Vote_Share_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Constituency_Type = models.CharField(db_column='Constituency_Type', max_length=50, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(db_column='Position')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    Votes = models.IntegerField(db_column='Votes', blank=True, null=True)  # Field name made lowercase.
    Candidate = models.CharField(db_column='Candidate', max_length=255)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'partys'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Constituency_No', 'Position'),)


class Partysummary(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    Total_Cand = models.IntegerField(db_column='Total_Cand', blank=True, null=True)  # Field name made lowercase.
    Winners = models.IntegerField(db_column='Winners')  # Field name made lowercase.
    Deposit_Lost = models.IntegerField(db_column='Deposit_Lost', blank=True, null=True)  # Field name made lowercase.
    Avg_Winning_Margin = models.DecimalField(db_column='Avg_Winning_Margin', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Strike_Rate = models.DecimalField(db_column='Strike_Rate', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'partysummary'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Party'),)


class Seatshares(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    partyseats = models.IntegerField(blank=True, null=True)
    totalseats = models.IntegerField(blank=True, null=True)
    Seats = models.DecimalField(db_column='Seats', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'seatshares'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Party'),)


class Voter_Turnout(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    male = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    female = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)
    total = models.DecimalField(max_digits=4, decimal_places=2, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'voter_turnout'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No'),)


class Voteshares_Cont(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    partyvotes = models.IntegerField(blank=True, null=True)
    totalvotes = models.IntegerField(blank=True, null=True)
    Vote_Share_Percentage = models.DecimalField(db_column='Vote_Share_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'voteshares_cont'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Party'),)


class Voteshares_Total(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Party = models.CharField(db_column='Party', max_length=50)  # Field name made lowercase.
    Vote_Share_Percentage = models.DecimalField(db_column='Vote_Share_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.
    Position = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'voteshares_total'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No', 'Party'),)


class Womens(models.Model):
    Election_Type = models.CharField(db_column='Election_Type', primary_key=True, max_length=2)  # Field name made lowercase.
    State_Name = models.CharField(db_column='State_Name', max_length=50)  # Field name made lowercase.
    Assembly_No = models.IntegerField(db_column='Assembly_No')  # Field name made lowercase.
    Year = models.IntegerField(db_column='Year')  # Field name made lowercase.
    Women_Percentage = models.DecimalField(db_column='Women_Percentage', max_digits=4, decimal_places=2, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'womens'
        unique_together = (('Election_Type', 'State_Name', 'Assembly_No'),)
