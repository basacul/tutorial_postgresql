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
root@goorm:/anyfolder# vim /etc/postgresql/14/bin/postgresql.conf

...
# - Connection Settings -

listen_address = '0.0.0.0'
...
````
6. Furthermore in the same folder update the configuration file pg_hba.conf using vim such that
- IPv4 local connections is set to 0.0.0.0/32
- Allow replication connections from localhost, by a user with the replication privilege is set to 0.0.0.0/32 (only one value)
````
root@goorm:/anyfolder# vim /etc/postgresql/14/bin/pg_hba.conf

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
