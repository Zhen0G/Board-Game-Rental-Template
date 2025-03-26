# Import necessary modules
from flask import Flask, render_template, request, jsonify  # Import Flask framework and its components
import requests  # Import requests library for sending HTTP requests to other services

# Initialize Flask application
app = Flask(__name__)
# Set maximum content length to 10MB to allow uploading large images
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024

# Define microservice URL constants
USER_SERVICE_URL = "http://user-service:5001/users"  # User service address
PRODUCT_SERVICE_URL = "http://product-service:5002/products"  # Product service address
ORDER_SERVICE_URL = "http://order-service:5003/orders"  # Order service address

# Define user homepage route
@app.route("/")
def user_home():
    """
    User homepage route handler
    Returns: Rendered user.html template
    """
    return render_template("user.html")

# Define admin route
@app.route("/admin")
def admin_dashboard():
    """
    Admin dashboard route handler
    Returns: Rendered index.html template
    """
    return render_template("index.html")

# Create user route
@app.route("/create_user", methods=["POST"])
def create_user():
    """
    Create user route handler
    Receives JSON data from frontend and forwards to user service
    Returns: User service response and status code
    """
    try:
        response = requests.post(USER_SERVICE_URL, json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all users route
@app.route("/get_users", methods=["GET"])
def get_users():
    """
    Get all users route handler
    Retrieves user list from user service
    Returns: User service response and status code
    """
    try:
        response = requests.get(USER_SERVICE_URL)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all products route
@app.route("/get_products", methods=["GET"])
def get_products():
    """
    Get all products route handler
    Retrieves product list from product service
    Returns: Product service response and status code
    """
    try:
        response = requests.get(PRODUCT_SERVICE_URL)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create product route
@app.route("/create_product", methods=["POST"])
def create_product():
    """
    Create product route handler
    Receives JSON data from frontend and forwards to product service
    Returns: Product service response and status code
    """
    try:
        response = requests.post(PRODUCT_SERVICE_URL, json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Update product route
@app.route("/update_product", methods=["PUT"])
def update_product():
    """
    Update product route handler
    Receives JSON data from frontend and forwards to product service
    Returns: Product service response and status code
    """
    try:
        # Get product ID from request JSON
        product_id = request.json.get('id')
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400
            
        # Forward request to product service
        response = requests.put(f"{PRODUCT_SERVICE_URL}/{product_id}", json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Delete product route
@app.route("/delete_product", methods=["DELETE"])
def delete_product():
    """
    Delete product route handler
    Receives JSON data from frontend and forwards to product service
    Returns: Product service response and status code
    """
    try:
        # Get product ID from request JSON
        product_id = request.json.get('id')
        if not product_id:
            return jsonify({"error": "Product ID is required"}), 400
            
        # Forward request to product service
        response = requests.delete(f"{PRODUCT_SERVICE_URL}/{product_id}")
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Create order route
@app.route("/create_order", methods=["POST"])
def create_order():
    """
    Create order route handler
    Receives JSON data from frontend and forwards to order service
    Returns: Order service response and status code
    """
    try:
        response = requests.post(ORDER_SERVICE_URL, json=request.json)
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all orders route
@app.route("/get_orders", methods=["GET"])
def get_orders():
    """
    Get all orders route handler
    Retrieves order list from order service
    Returns: Order service response and status code without any processing
    """
    try:
        response = requests.get(ORDER_SERVICE_URL)
        # Return raw data without any processing
        return jsonify(response.json()), response.status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Application entry point
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=9000)  # Run application on all network interfaces on port 9000

