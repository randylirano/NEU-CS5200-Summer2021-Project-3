# NEU-CS5200-Summer2021-Project-2
This project handles the same business requirements as project 1. The only difference is that MongoDB will be used as NoSQL database.

# Files and Directories

1) ./Project Report.pdf: PDF file containing the business requirements as well as the logical and document model diagram.
2) ./jsonHierarchy.txt: A text file containing a couple JSON examples demonstrating the hierarchy of the document model.
3) ./applicationManager/db: contains 2 main collections
    a) Posting.json: Contain documents of job posting data.
    b) Application.json: Contain documents of applications linked to existing posting documents in Posting collection.
4) ./applicationManager/QueryExamples: contains 5 query examples.

# Importing Database and Collections
Run these lines in terminal to create ApplicationManager database and import the collections:
mongoimport -h localhost:27017 -d ApplicationManager -c Posting --drop --jsonArray --file ./db/Posting.json
mongoimport -h localhost:27017 -d ApplicationManager -c Application --drop --jsonArray --file ./db/Application.json

# Using it

1) Clone the repo
2) Install the dependencies

```
npm install
```

3) Start mongo server

4) Start the server

```
npm start
```

5) Point your browser to http://locahost:3000
