// 导入必要的包
const express = require('express');  // Express框架用于构建Web服务
const mongoose = require('mongoose');  // MongoDB的ODM（对象文档映射）库

// 初始化Express应用
const app = express();
app.use(express.json());  // 中间件：解析JSON请求体

// 连接 MongoDB
// 'mongodb://product-db:27017/products'中的product-db指向Docker Compose中定义的服务名称
mongoose.connect('mongodb://product-db:27017/products', { useNewUrlParser: true, useUnifiedTopology: true });

// 定义产品的数据模型
// 创建Schema（模式）：定义产品有name和price两个字段
const ProductSchema = new mongoose.Schema({ name: String, price: Number });
// 创建Model：将Schema转换为可操作的Model对象
const Product = mongoose.model('Product', ProductSchema);

// API端点：获取所有产品
// HTTP GET方法，路径为/products
app.get('/products', async (req, res) => {
    const products = await Product.find();  // 使用Mongoose查询所有产品
    res.json(products);  // 将结果转换为JSON格式并返回
});

// API端点：创建新产品
// HTTP POST方法，路径为/products
app.post('/products', async (req, res) => {
    const product = new Product(req.body);  // 使用请求体创建新的产品对象
    await product.save();  // 将产品保存到数据库
    res.json({ message: "Product added!" });  // 返回成功消息
});

// 启动服务器
app.listen(5002, () => console.log("Product Service running on port 5002"));  // 监听5002端口