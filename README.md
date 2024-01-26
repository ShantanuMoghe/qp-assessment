# qp-assessment
Respository for Groceries API

replace <Your_SA_Password> with your DB SA user password.

To docker compose:
use:
1. docker-compose build
2. then proceed with docker-compose up

Internal DB change script will create data base and tables itself.

Following parts covered:
1. Roles for login:
   - Admin
   - User
2. Admin Responsibilities:
   - Add new grocery items to the system
   - View existing grocery items
   - Remove grocery items from the system
   - Update details (e.g., name, price) of existing grocery items
   - Manage inventory levels of grocery items
3. User Responsibilities:
   - View the list of available grocery items
   - Ability to book multiple grocery items in a single order
   
4. Containerized the application using Docker for ease of deployment and scaling.
5. Database used mssql.
