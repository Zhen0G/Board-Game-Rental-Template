# 导入必要的库
from flask import Flask, jsonify, request  # Flask框架用于构建Web服务
import psycopg2  # PostgreSQL数据库连接器

# 初始化Flask应用
app = Flask(__name__)

# 建立与PostgreSQL数据库的连接
# host="user-db"指向Docker Compose中定义的服务名称
conn = psycopg2.connect(database="users_db", user="postgres", password="password", host="user-db", port="5432")
cursor = conn.cursor()

# 创建用户表（如果不存在）
# 表包含id（自动递增主键）、name（用户名）和email（邮箱）字段
cursor.execute("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, name TEXT, email TEXT);")
conn.commit()  # 提交事务，确保表创建

# API端点：获取所有用户
# HTTP GET方法，路径为/users
@app.route('/users', methods=['GET'])
def get_users():
    cursor.execute("SELECT * FROM users;")  # 执行SQL查询获取所有用户
    users = cursor.fetchall()  # 获取查询结果
    return jsonify(users)  # 将结果转换为JSON格式并返回

# API端点：创建新用户
# HTTP POST方法，路径为/users
@app.route('/users', methods=['POST'])
def create_user():
    data = request.json  # 获取请求中的JSON数据
    # 将用户数据插入数据库，name和email从请求数据中获取
    cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s) RETURNING id;", (data['name'], data['email']))
    conn.commit()  # 提交事务，确保数据被保存
    return jsonify({"message": "User added!"}), 201  # 返回成功消息和201状态码（资源创建成功）

# 应用入口点
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001)  # 启动服务器，监听所有网络接口的5001端口
