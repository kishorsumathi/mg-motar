import psycopg2

try:
    conn = psycopg2.connect("dbname='myproject' user='root' password='123'")
except:
    print("unable to connect to thre database.")

cur= conn.cursor()

try:
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Steering','First row second column','5'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('battery','third row first column','6'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Radiator','fourth row fifth column','4'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Front Axle','First row tenth column','7'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Back Axle','tenth row sixth column','0'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Brake wire','ninth row seventh column','5'))
    # cur.execute("INSERT INTO voicesearch(Part_Name,Location,Quantity) VALUES(%s,%s,%s)", ('Fuel tank','fifth row fourth column','1'))
    cur.execute("SELECT * FROM voicesearch")
    print(cur.fetchall())
    cur.close()
    conn.close
    # conn.commit();
    print("ok")
except Exception as E:
    print(E)