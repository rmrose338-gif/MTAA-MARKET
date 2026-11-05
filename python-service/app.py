from flask import Flask, jsonify

from services.sales_analysis import analyze_sales

app = Flask(__name__)


@app.get("/health")
def health():
    return jsonify({"status": "ok"})


@app.get("/analysis/sales")
def sales_analysis():
    try:
        return jsonify(analyze_sales())
    except (OSError, ValueError) as error:
        app.logger.exception("Could not analyze sales data")
        return jsonify({"message": str(error)}), 500


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8000, debug=False)
