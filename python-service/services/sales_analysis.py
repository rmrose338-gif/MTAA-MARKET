import os
import sqlite3
from contextlib import closing
from pathlib import Path


def analyze_sales(database_path=None):
    if database_path is None:
        database_path = os.environ.get(
            "MTAA_DATABASE_PATH",
            Path(__file__).resolve().parents[2] / "database" / "mtaa_market.db",
        )
    database_path = Path(database_path)
    if not database_path.is_file():
        raise FileNotFoundError(f"Market database does not exist: {database_path}")

    with closing(sqlite3.connect(database_path)) as connection:
        connection.row_factory = sqlite3.Row
        totals = connection.execute(
            """
            SELECT COUNT(DISTINCT o.id) AS order_count,
                   COALESCE(SUM(oi.price * oi.quantity), 0) AS gross_sales,
                   COALESCE(SUM(oi.quantity), 0) AS units_sold
            FROM orders o
            JOIN order_items oi ON oi.order_id = o.id
            """
        ).fetchone()
        by_category = connection.execute(
            """
            SELECT c.name AS category,
                   COALESCE(SUM(oi.price * oi.quantity), 0) AS sales,
                   COALESCE(SUM(oi.quantity), 0) AS units_sold
            FROM categories c
            LEFT JOIN products p ON p.category_id = c.id
            LEFT JOIN order_items oi ON oi.product_id = p.id
            GROUP BY c.id, c.name
            ORDER BY sales DESC, c.name
            """
        ).fetchall()

    return {
        "order_count": totals["order_count"],
        "gross_sales": round(totals["gross_sales"], 2),
        "units_sold": totals["units_sold"],
        "by_category": [dict(row) for row in by_category],
    }
