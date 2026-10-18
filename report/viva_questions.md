# Viva Questions and Answers
## Police Crime Management System Using Neo4j

---

## Section A: DBMS Concepts

**Q1. What is a Database Management System (DBMS)?**
A DBMS is software that enables users to define, create, maintain, and control access to a database. It provides an interface between the end user and the database, handling data storage, retrieval, and management. Examples: MySQL, PostgreSQL, Neo4j, MongoDB.

**Q2. What are the different types of databases?**
- **Relational (SQL):** MySQL, PostgreSQL, Oracle — data stored in tables
- **Document:** MongoDB, CouchDB — data stored as JSON documents
- **Graph:** Neo4j, Amazon Neptune — data stored as nodes and relationships
- **Key-Value:** Redis, DynamoDB — simple key-value pairs
- **Column-family:** Cassandra, HBase — data organized by columns

**Q3. What is the difference between SQL and NoSQL databases?**
SQL databases use structured tables with a fixed schema and support ACID transactions through SQL. NoSQL databases use flexible schemas and are designed for scalability, variety, and specific data models. NoSQL covers document, graph, key-value, and column-family types.

**Q4. What are ACID properties?**
- **Atomicity:** A transaction is all-or-nothing
- **Consistency:** A transaction brings the database from one valid state to another
- **Isolation:** Concurrent transactions execute as if they were sequential
- **Durability:** Committed transactions persist even after system failures

Neo4j supports full ACID transactions, which is important for criminal record integrity.

**Q5. What is referential integrity?**
Referential integrity ensures that relationships between tables/nodes remain consistent — if a record references another record, that referenced record must exist. In Neo4j, this is managed through relationship existence; you cannot create a relationship to a non-existent node.

---

## Section B: Graph Database Concepts

**Q6. What is a graph database?**
A graph database stores data as nodes (entities) and edges (relationships), along with properties on both. It is optimized for querying interconnected data through graph traversal algorithms. Neo4j is the most widely used graph database.

**Q7. What is a node in Neo4j?**
A node represents an entity or object. In our system, nodes include PoliceStation, Officer, FIR, Crime, Criminal, Victim, InvestigationCase, Evidence, Arrest, and Court. Each node has a label (type) and properties (attributes).

**Q8. What is a relationship in Neo4j?**
A relationship (edge) connects two nodes and has a direction and a type. Example: `(Officer)-[:WORKS_AT]->(PoliceStation)`. Relationships can also have properties like `assignedOn` or `joinedDate`.

**Q9. What are node properties and relationship properties?**
Properties are key-value pairs stored on nodes or relationships. Example: An Officer node has `{officerId: "OFF001", name: "Rajesh Kumar", rank: "Inspector"}`. A WORKS_AT relationship has `{joinedDate: "2010-06-15"}`.

**Q10. What is a label in Neo4j?**
A label is a name attached to a node that categorizes it. Nodes can have multiple labels. In our system, each node has one label: PoliceStation, Officer, FIR, etc. Labels allow efficient querying by type.

**Q11. Why is a graph database suitable for police crime management?**
Crime data involves complex many-to-many relationships — a criminal can be involved in multiple cases, a case can have multiple officers and evidence items, a station has multiple officers who file multiple FIRs. Relational databases handle this through junction tables and JOINs, which become expensive at depth. Graph databases store relationships directly, making traversal queries like "find all cases connected to station X through officers" natural and efficient.

**Q12. What is graph traversal?**
Graph traversal is the process of visiting nodes and following relationships in a graph to answer a query. Starting from a node, you follow edges to reach connected nodes, potentially multiple hops deep. In Cypher: `MATCH (n)-[:REL_TYPE*1..3]->(m)` traverses up to 3 hops.

---

## Section C: Neo4j and Cypher

**Q13. What is Neo4j?**
Neo4j is the world's leading graph database management system. It stores data as a property graph — nodes, relationships, and properties. It is open-source (Community Edition) with a cloud offering called AuraDB. It uses the Cypher query language.

**Q14. What is Cypher?**
Cypher is Neo4j's declarative graph query language. It uses ASCII art-style patterns to express graph queries. Example: `MATCH (o:Officer)-[:WORKS_AT]->(ps:PoliceStation) RETURN o.name, ps.name`.

**Q15. What is the difference between CREATE and MERGE in Cypher?**
- `CREATE` always creates a new node, even if one with the same properties already exists — can cause duplicates.
- `MERGE` looks for a matching pattern first; if found, it uses the existing node; if not, it creates it. `MERGE` is used for idempotent operations and safe re-runs.

In our seed scripts, we use MERGE to avoid duplicate data on re-runs.

**Q16. What is DETACH DELETE and when should you use it?**
`DETACH DELETE` removes a node and ALL its relationships. Regular `DELETE` fails if the node has relationships. `DETACH DELETE` should be used with extreme caution — it permanently removes data. In our application, we always confirm with the user before deletion and prefer safe deletion (only if no relationships exist) for critical records.

**Q17. What are constraints in Neo4j?**
Constraints enforce data integrity rules. In our schema, we created uniqueness constraints on identifiers like `stationId`, `officerId`, `firNumber`. This ensures no two police stations can have the same ID. Neo4j AuraDB Free supports uniqueness constraints.

**Q18. What are indexes in Neo4j?**
Indexes improve query performance by creating an internal structure for fast lookups on specific properties. We created indexes on `status`, `priority`, `crimeType`, and `name` to speed up filtering queries.

**Q19. What is OPTIONAL MATCH?**
OPTIONAL MATCH is like a LEFT JOIN in SQL — it returns null for non-matching patterns instead of excluding the row. Used when a relationship may or may not exist. Example: finding all cases with or without evidence.

**Q20. What is parameterized Cypher?**
Instead of embedding values directly in a query string (which risks injection attacks), parameterized queries use `$parameter` placeholders. The Neo4j Python driver separates parameters from query text. Example: `MATCH (o:Officer {officerId: $id}) RETURN o` with `parameters={"id": "OFF001"}`.

---

## Section D: FastAPI and Backend

**Q21. What is FastAPI?**
FastAPI is a modern Python web framework for building REST APIs. It provides automatic OpenAPI/Swagger documentation, type validation via Pydantic, async request handling, and high performance. We use it to expose CRUD endpoints for all 10 entities.

**Q22. What is Pydantic?**
Pydantic is a Python library for data validation using type annotations. In FastAPI, Pydantic models define the shape of request bodies and response schemas. Invalid data is automatically rejected with helpful error messages.

**Q23. What are REST API methods and when are they used?**
- `GET` — retrieve data (no side effects)
- `POST` — create new records
- `PUT` — update existing records (full replacement)
- `PATCH` — partial update
- `DELETE` — remove records

Our API follows REST conventions: `POST /api/officers` creates an officer, `GET /api/officers/OFF001` retrieves one, `PUT /api/officers/OFF001` updates it.

**Q24. What is CORS and why is it needed?**
CORS (Cross-Origin Resource Sharing) is a browser security mechanism that blocks requests from a different origin (domain/port) than the server. Our frontend (port 5173) and backend (port 8000) are different origins. We configure FastAPI's CORS middleware to allow requests from the frontend URL.

**Q25. What is the offline demo mode and why did you implement it?**
Neo4j AuraDB has a known connection issue in our environment. Rather than block all development, we implemented a demo mode that uses an in-memory Python data store with the same data as the Cypher seed scripts. The mode is clearly labeled in the UI. Demo mode allows full CRUD demonstration without a network dependency. This is also useful for presenting in a classroom without internet access.

---

## Section E: React Frontend

**Q26. What is React?**
React is a JavaScript library for building user interfaces. It uses a component-based architecture where UI is broken into reusable pieces. State management with hooks (useState, useEffect) makes UIs reactive to data changes.

**Q27. What is Vite?**
Vite is a fast build tool and development server for modern JavaScript projects. It uses native ES modules for instant hot-reload during development and Rollup for production builds. It replaces Create React App in modern projects.

**Q28. What is React Router?**
React Router is a library for client-side navigation in React applications. It maps URL paths to React components without full page reloads. We use it to navigate between Dashboard, Officers, Cases, etc.

---

## Section F: Design Decisions

**Q29. Why did you choose Neo4j over MongoDB for this project?**
Both are NoSQL databases, but MongoDB is document-oriented — it stores data as JSON documents with nested data. Relationships between documents are handled by embedding or referencing (manual foreign keys). Neo4j stores relationships as first-class graph edges, making relationship traversal natural and efficient. For crime data where inter-entity connections are the core queries (e.g., "who is connected to this case, and through what path?"), a graph model is fundamentally more appropriate.

**Q30. What are the limitations of your implementation?**
1. Neo4j AuraDB connection has not been verified due to a connectivity issue
2. The demo mode uses in-memory storage (not persistent — resets on server restart)
3. No user authentication (would require JWT implementation)
4. No pagination for large datasets
5. AuraDB Free has 1GB storage limit
6. Real-time graph visualization (like D3.js) is not implemented — would enhance the demo

---

## Tips for Answering Unknown Questions

- "That's a good question. My implementation handles it by... [describe what you built]"
- "I focused on the core functionality. [feature] would be a future enhancement."
- "In our case, [explain how it relates to your implementation]."
- If unsure about Neo4j internals: "Neo4j uses B+ tree indexes internally for property lookups and maintains an adjacency list for relationship traversal."

---

## Key Numbers to Remember

| Fact | Value |
|------|-------|
| Node types | 10 |
| Relationship types | 12 |
| Sample police stations | 5 |
| Sample officers | 8 |
| Sample FIRs | 6 |
| Sample cases | 5 |
| Sample criminals | 5 |
| Sample evidence items | 6 |
| API endpoints | ~50+ |
| Backend test files | 3 |
| Documented Cypher queries | 20 |
