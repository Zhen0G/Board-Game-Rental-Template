# 导入必要的库
from flask import Flask, jsonify, request  # Flask框架用于构建Web服务
import psycopg2  # PostgreSQL数据库连接器

# 初始化Flask应用
app = Flask(__name__)

# 连接到PostgreSQL数据库
# host="order-db"指向Docker Compose中定义的服务名称
conn = psycopg2.connect(database="orders_db", user="postgres", password="password", host="order-db", port="5432")
cursor = conn.cursor()

# 创建订单表（如果不存在）
# 表包含id（自动递增主键）、user_id（用户ID）、product（产品名称）和quantity（数量）字段
cursor.execute("CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INT, product TEXT, quantity INT);")
conn.commit()  # 提交事务，确保表创建

# API端点：获取所有订单
# HTTP GET方法，路径为/orders
@app.route('/orders', methods=['GET'])
def get_orders():
    cursor.execute("SELECT * FROM orders;")  # 执行SQL查询获取所有订单
    orders = cursor.fetchall()  # 获取查询结果
    return jsonify(orders)  # 将结果转换为JSON格式并返回

# API端点：创建新订单
# HTTP POST方法，路径为/orders
@app.route('/orders', methods=['POST'])
def create_order():
    data = request.json  # 获取请求中的JSON数据
    # 将订单数据插入数据库，user_id、product和quantity从请求数据中获取
    cursor.execute("INSERT INTO orders (user_id, product, quantity) VALUES (%s, %s, %s) RETURNING id;", 
                   (data['user_id'], data['product'], data['quantity']))
    conn.commit()  # 提交事务，确保数据被保存
    return jsonify({"message": "Order placed!"}), 201  # 返回成功消息和201状态码（资源创建成功）

# 应用入口点
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5003)  # 启动服务器，监听所有网络接口的5003端口
