-- MASTER QUERY
-- material
CREATE TABLE materials
(
    material VARCHAR(255) PRIMARY KEY,
    material_number VARCHAR(255),
    mapping_report VARCHAR(255),
    division VARCHAR(255)
);
-- customer
CREATE TABLE customers
(
    customer_id INT IDENTITY(1,1) PRIMARY KEY,
    customer VARCHAR (255),
    customer_name VARCHAR(255),
    company_code VARCHAR (255),
    AM VARCHAR (255)
)

-- ENTRY QUERY
-- sales entry
CREATE TABLE sales_entry
(
    id INT IDENTITY(1,1) PRIMARY KEY,
    type VARCHAR(50),
    year INT,
    company VARCHAR(50),
    month INT,
    material_code VARCHAR(50),
    products VARCHAR(50),
    product_category_detail VARCHAR(50),
    dd VARCHAR(50),
    mapping_report VARCHAR(50),
    division VARCHAR(50),
    customer_group VARCHAR(50),
    customer_code VARCHAR(50),
    customer_name VARCHAR(50),
    quantity INT,
    selling_price DECIMAL(18,2),
    currency VARCHAR(50),
    rate DECIMAL(18,2),
    total_sales DECIMAL(18,2),
    am_number INT,
    cogs DECIMAL(18,2),
    margin DECIMAL(18,2),
    log_sales_id VARCHAR(50)
);

