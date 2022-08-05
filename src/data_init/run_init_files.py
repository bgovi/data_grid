"""
This file creates a backup of all tables in postgres provider effort database.
Exports them as json and csv (or some other delimiter)
"""
import json
import psycopg2
import psycopg2.extras
import sys
sys.path.append('~/PsqlCred')
import psql_cred

output_connect_string = psql_cred.output_connect_string
output_path = '~/PsqlCred/output_data'
conn = psycopg2.connect(output_connect_string)

class BackupData:

    def __init__(self):
        pass

    def Run(self):
        """
            1. create functions
            2. create admin tables
            3. create provider_effort tables
            4. add triggers
            5. create_views
            6. insert data
            7. reset indexes
            8. create policies
            9. create roles
            10. insert config files (for deployment component)
        """
        pass


        #run sepearte queries
    def RunQuery(self, sql_query):
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql_query)
        rows = cur.fetchall()
        for row in rows:
            row['updated_at'] = str(row['updated_at'])
            if 'effective_date' in row:
                row['effective_date'] = str(row['effective_date'])
        return rows

    def ResetIndexes():
        """
        -- ALTER SEQUENCE product_id_seq RESTART WITH 1453;
        -- setval('product_id_seq', 1453);
        -- SELECT SETVAL('project_id_seq', (SELECT MAX(id) + 1 FROM project));
        """
        pass

# company
# line_of_business
# department
# specialty
# time_units
# cost_center
# company_cost_center
# classifications
# cpsc
# lcg
# cpsc_lcg_map
# providers
# appointments
# appointment_effort
# oracle_effort
# user_org_permission
# full_org




if __name__ == "__main__":
    x = BackupData()
    x.BuildJsonFiles()