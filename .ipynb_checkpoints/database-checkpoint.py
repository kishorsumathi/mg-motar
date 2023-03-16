import psycopg2
try:
    conn = psycopg2.connect("dbname='myproject' user='postgres' password='root' host='143.244.138.28' port='5432'")
except:
    print("unable to connect to thre database.")

cur= conn.cursor()

try:
    cur.execute("CREATE TABLE voicesearch(id serial PRIMARY KEY, Part_Name varchar, Location varchar,Quantity varchar);")
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Steering','First row second column','5'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('battery','third row first column','6'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Radiator','fourth row fifth column','4'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Front Axle','First row tenth column','7'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Back Axle','tenth row sixth column','0'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Brake wire','ninth row seventh column','5'))
    cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Fuel tank','fifth row fourth column','1'))
    cur.execute("SELECT * FROM voicesearch")
    print(cur.fetchall())
    #cur.save()
    conn.commit()
    cur.close()
    conn.close
    # conn.commit();
    print("ok")
except Exception as E:
    print(E)