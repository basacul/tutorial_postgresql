# tutorial_postgresql
Udemy course Node, SQL, &amp; PostgreSQL - Mastering Backend on goorm.io with a container running on ubuntu 18.04.

## How to set up PostgreSQL on container
Unfortunately you will encounter several issues when installing postgresql onto the current container. In order to resolve all the issues, follow these steps.

0. Update the locale to include en_US.UTF8 because it is set to Korean
```
root@goorm:/anyfolder# sudo locale-gen en_US.UTF-8
root@goorm:/anyfolder# update-locale LANG=en_US.UTF-8
```
1. Update your system by running
```
root@goorm:/anyfolder# sudo apt-get update
````
2. Upgrade your system by running
```
root@goorm:/anyfolder# sudo apt-get upgrade
```
3. Remove useless packages
```
root@goorm:/anyfolder# sudo apt-get autoremove
````
4. Only after these steps install postgresql version 14 by running
```
root@goorm:/anyfolder# sudo apt install postgresql postgresql-contrib
```
5. Update the configuration file in /etc/postgresql/14/bin/postgresql.conf using vim such that
- The attribute **listen_address** is uncommented with the value equal to '0.0.0.0' 
````
root@goorm:/anyfolder# vim /etc/postgresql/14/main/postgresql.conf

...
# - Connection Settings -

listen_address = '0.0.0.0'
...
````
6. Furthermore in the same folder update the configuration file pg_hba.conf using vim such that
- IPv4 local connections is set to 0.0.0.0/32
- Allow replication connections from localhost, by a user with the replication privilege is set to 0.0.0.0/32 (only one value)
````
root@goorm:/anyfolder# vim /etc/postgresql/14/main/pg_hba.conf

...
# IPv4 local connections:
host	all				all		0.0.0.0/32			scram-sha-256
...
# Allow replication connections from localhost, by a user with the
# replication privilege
local	replication		all							peer
host 	replication		all		0.0.0.0/32			scram-sha-256
host	replication		all		::1/128				scram-sha-256
````
7. After the updates in both config files you need to start postgresql
```
root@goorm:/anyfolder# sudo service postgresql start
* Starting PostgreSQL 14 database server
  ...done.
```
8. To be sure check the clusters there exist
````
root@goorm:/anyfolder# pg_lscluster
Ver	Cluster	Port 	Status		Owner		Data directory				Log file
14	main	5432 	online		postgres	/var/lib/postgresql/14/main	/var/log/postgresql-14-main.log
````
9. Start the cluster **main** with version **14**
````
root@goorm:/anyfolder# pg_ctlcluster 14 main start
Cluster is already running. (in my case)
````
10. Now switch to user postgres
```
root@goorm:/anyfolder# sudo -i -u postgres
postgres@goorm: ~$
````
11. Now you can work with **psql** commands
````
postgres@goorm:~$ psql
psql (14.1 (Ubuntu 14.1-1.pgdg18.04+1))
Type "help" for help.

postgres=#
````
12. You can exit the user postgres (when you see postgres@goorm:~$) with **exit**
````
postgres@goorm:~$ exit
logout
root@goorm:/workspace/tutorial_postgresql/node_postgres#
```
## Further issues
The database will shut down from time to time. This has to do with goorm.io doing something in the background. When this happens, you will see, that the terminal changed. 

In that case just run the steps 9 and 10 and your database is running - till you need to repeat these steps.

## Initialize database
When you are currently the user postgres in goorm, then you can run directly in the terminal without specifying the user.

1. Create the database
```
postgres@goorm:~$ createdb creaturesdb
```
2. Initialize the database creaturesdb with the creatures.sql file
```
postgres@goorm:~$ cd /workspace/tutorial_postgresql/node_postgres/psql
postgres@goorm:/workspace/tutorial_postgresql/node_postgres/psql$ psql creaturesdb < creatures.sql 
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 3
INSERT 0 3
INSERT 0 3
INSERT 0 4
INSERT 0 3
postgres@goorm:/workspace/tutorial_postgresql/node_postgres/psql$
````

## Joining tables
How to join tables from the linking tables.
```
postgres@goorm:~$ psql creaturesdb
psql (14.1 (Ubuntu 14.1-1.pgdg18.04+1))
Type "help" for help.

creaturesdb=# SELECT * FROM allies JOIN elves ON allies.elf = elves.name;
 wizard  |   elf   |  name   | speed
---------+---------+---------+-------
 Saruman | Legolas | Legolas |    10
 Gandalf | Legolas | Legolas |    10
 Gandalf | Arwen   | Arwen   |     9
 Saruman | Elrond  | Elrond  |     5
(4 rows)

creaturesdb=# select * from guardians join hobbits on guardians.hobbit = hobbits.name;
   elf   | hobbit | name  | personality
---------+--------+-------+-------------
 Legolas | Frodo  | Frodo | careful
 Arwen   | Sam    | Sam   | brave
 Elrond  | Bilbo  | Bilbo | greedy
(3 rows)

creaturesdb=# select * from guardians join hobbits on guardians.hobbit = hobbits.name join elves on guardians.elf = elves.name;
   elf   | hobbit | name  | personality |  name   | speed
---------+--------+-------+-------------+---------+-------
 Legolas | Frodo  | Frodo | careful     | Legolas |    10
 Arwen   | Sam    | Sam   | brave       | Arwen   |     9
 Elrond  | Bilbo  | Bilbo | greedy      | Elrond  |     5
(3 rows)

```

## Monsters API
1. Initialize Project
```
root@goorm:/workspace/tutorial_postgresql/node_postgres(main)# mkdir monsters_api
root@goorm:/workspace/tutorial_postgresql/node_postgres(main)# cd monsters_api
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api(main)# npm initi -y
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api(main)# npm i nodemon --save-dev
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api(main)# npm i express body-parser pg --save
```
2. Create a user in postgresql for node
```
root@goorm:/...# sudo service postgresql start
root@goorm:/...# pg_ctlcluster 14 main start
root@goorm:/...# createdb monstersdb
root@goorm:/...# sudo -i -u postgres
postgres@goorm:# createdb monstersdb 
postgres@goorm:# psql monstersdb
psql (14.1 (Ubuntu 14.1-1.pgdg18.04+1))
Type "help" for help.
monstersdb=# CREATE USER node_user WITH SUPERUSER PASSWORD 'node_password';
CREATE ROLE
monstersdb=# SELECT * FROM pg_user;
  usename  | usesysid | usecreatedb | usesuper | userepl | usebypassrls |  passwd  | valuntil | useconfig
-----------+----------+-------------+----------+---------+--------------+----------+----------+-----------
 postgres  |       10 | t           | t        | t       | t            | ******** |          |
 node_user |    24577 | f           | t        | f       | f            | ******** |          |
(2 rows)
monstersdb=# exit
```
3. Create bash file to execute the creation and initialization of monstersdb with user node_user and modify executable rights for the file
```
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api/bin(main)# ls -l 
total 8
-rw-rw-r-- 1 root root  385 Jan 24 13:21 configuredb.sh
drwxrwxr-x 2 root root 4096 Jan 24 12:59 sql
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api/bin(main)# chmod +x configuredb.sh
root@goorm:/workspace/tutorial_postgresql/node_postgres/monsters_api/bin(main)# ls -l 
total 8
-rwxrwxr-x 1 root root  385 Jan 24 13:21 configuredb.sh
drwxrwxr-x 2 root root 4096 Jan 24 12:59 sql

```
4. Update pg_hba.conf file to allow the server to recognise the user node_user and set 
```
root@goorm: /anyfolder# vim /etc/postgresql/14/main/pg_hba.conf
# TYPE	DATABASE 		USER	ADDRESS			METHOD

# "local" is for Unix domain socket connections only
local	all 			all						md5
# IPv4 local connections:
host	all				all		0.0.0.0/32 		md5
# IPv6 local connections:
host	all				all		::1/128			md5
# Allow replication connections from localhost, by a user with the
# replication privilege.
local 	replication		all						trust
host 	replication		all		0.0.0.0/32		trust
host	replication		all		::1/128			trust
````
5. Create a linux user with the same name node_user and password node_password
```
root@goorm: /anyfolder# sudo adduser node_user
```
6. Run the bash file 
```
root@goorm: cd /workspace/tutorial_postgresql/node_postgres/monsters_api
root@goorm: /workspace/tutorial_postgresql/node_postgres/monsters_api# npm run configure

> monsters_api@1.0.0 configure
> ./bin/configuredb.sh

CREATE TABLE
CREATE TABLE
CREATE TABLE
INSERT 0 3
INSERT 0 3
INSERT 0 3
monstersdb configured

root@goorm: /workspace/tutorial_postgresql/node_postgres/monsters_api# exit
```