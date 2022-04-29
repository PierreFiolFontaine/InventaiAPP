CREATE TABLE IF NOT EXISTS stock_inventory_line(
    lineId INTEGER PRIMARY KEY,
    inventory INTEGER,
    product INTEGER,
    expected_quantity INTEGER,
    quantity INTEGER
)WITHOUT ROWID;