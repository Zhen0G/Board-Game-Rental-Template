# 使用Python 3.9作为基础镜像
FROM python:3.9

# 设置容器内的工作目录为/app
WORKDIR /app

# 将当前目录下的所有文件复制到容器中的工作目录
COPY . .

# 安装项目所需的Python依赖
RUN pip install -r requirements.txt

# 启动应用的命令
CMD ["python", "app.py"]

