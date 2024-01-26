USE master
go

if not exists (select 1 from sys.databases where name = 'ShopDB')
BEGIN
	CREATE DATABASE ShopDB;
END
go

if exists (select 1 from sys.databases where name = 'ShopDB')
BEGIN
	Use ShopDB
	
	if not exists (SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
				WHERE TABLE_SCHEMA = 'dbo' 
				AND  TABLE_NAME = 'User_Details')
	BEGIN
		CREATE TABLE User_Details (
		user_id INT PRIMARY KEY,
		user_name VARCHAR(100) UNIQUE NOT NULL,
		password VARCHAR(500) NOT NULL,
		first_name VARCHAR(500),
		last_name VARCHAR(500),
		user_role INT NOT NULL,
		date_of_creation DATETIMEOFFSET,
		active_status BIT)
	END

	if not exists(SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
				WHERE TABLE_SCHEMA = 'dbo' 
				AND  TABLE_NAME = 'Grocery_Items')
	BEGIN
	CREATE TABLE Grocery_Items (
			grocery_number INT IDENTITY(1,1),
			grocery_name VARCHAR(255) NOT NULL,
			price MONEY NOT NULL,
			inventory_quantity INT NOT NULL,
			is_grocery_available BIT NOT NULL,
			added_by_user_id INT NOT NULL,
			date_added DATETIMEOFFSET NOT NULL,
			active_status BIT NOT NULL,
			uid UNIQUEIDENTIFIER DEFAULT NEWID() PRIMARY KEY,
			updated_by_user_id INT,
			date_updated DATETIMEOFFSET,
			deleted_by_user_id INT,
			date_deleted DATETIMEOFFSET,
			CONSTRAINT FK_AddedByUser FOREIGN KEY (added_by_user_id) REFERENCES User_Details(user_id),
			CONSTRAINT FK_UpdatedByUser FOREIGN KEY (updated_by_user_id) REFERENCES User_Details(user_id),
			CONSTRAINT FK_DeletedByUser FOREIGN KEY (deleted_by_user_id) REFERENCES User_Details(user_id)
			);

		-- Unique key for grocery_number
	CREATE UNIQUE INDEX UQ_GroceryNumber ON Grocery_Items(grocery_number);
	END

	if not exists(SELECT 1 FROM INFORMATION_SCHEMA.TABLES 
			WHERE TABLE_SCHEMA = 'dbo' 
			AND  TABLE_NAME = 'Order_Details')
	BEGIN
		CREATE TABLE Order_Details (
		uid UNIQUEIDENTIFIER PRIMARY KEY,
		grocery_item_uid UNIQUEIDENTIFIER REFERENCES Grocery_Items(uid),
		user_id INT REFERENCES User_Details(user_id),
		order_date DATETIMEOFFSET NOT NULL,
		item_quantity INT NOT NULL,
		total_amount money NOT NULL,
		rate_per_item money NOT NULL,
		active_status BIT NOT NULL
		);
	END
END
