# Board Game Rental System - Microservices Architecture

This is a microservices-based board game rental system with separate services for user management, product management, and order processing. Each service has its own database and API interface, allowing independent deployment and scaling.

## Architecture

The project uses the following technology stack:

- **User Service**: Python Flask framework with PostgreSQL database
- **Product Service**: Node.js Express framework with MongoDB database
- **Order Service**: Python Flask framework with PostgreSQL database
- **Frontend Service**: Python Flask with HTML, CSS, and JavaScript
- **Containerization**: Docker and Docker Compose for service orchestration

Architecture diagram:

```
                    ┌─────────────────┐
                    │   Web Browser   │
                    └────────┬────────┘
                             │ HTTP
                             ▼
┌──────────────────────────────────────────────┐
│              Frontend Service                │
│                (port:9000)                   │
│  ┌─────────────┐ ┌─────────┐ ┌───────────┐  │
│  │ User Portal │ │  Admin  │ │ API Layer │  │
│  └─────────────┘ └─────────┘ └─────┬─────┘  │
└─────────────────────────────────────┼────────┘
                                      │ HTTP REST API
                 ┌────────────────────┼────────────────────┐
                 │                    │                    │
                 ▼                    ▼                    ▼
┌─────────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│    User Service     │    │  Product Service  │    │  Order Service  │
│     (port:5001)     │    │    (port:5002)    │    │   (port:5003)   │
└──────────┬──────────┘    └────────┬──────────┘    └───────┬─────────┘
           │                        │                       │
           ▼                        ▼                       ▼
┌──────────────────┐      ┌─────────────────┐      ┌────────────────┐
│    PostgreSQL    │      │     MongoDB     │      │   PostgreSQL   │
│    (users_db)    │      │   (products)    │      │   (orders_db)  │
└──────────────────┘      └─────────────────┘      └────────────────┘
```

## Service Descriptions

### User Service (port: 5001)
- **Tech Stack**: Python Flask, PostgreSQL
- **APIs**:
  - `GET /users`: Retrieve all users
  - `POST /users`: Create a new user (requires name and email)
- **Data Storage**: User information stored in PostgreSQL database

### Product Service (port: 5002)
- **Tech Stack**: Node.js Express, MongoDB
- **APIs**:
  - `GET /products`: Retrieve all products
  - `POST /products`: Create a new product (requires name and price)
  - `PUT /products/:id`: Update a product
  - `DELETE /products/:id`: Delete a product
- **Data Storage**: Product information stored in MongoDB database

### Order Service (port: 5003)
- **Tech Stack**: Python Flask, PostgreSQL
- **APIs**:
  - `GET /orders`: Retrieve all orders
  - `POST /orders`: Create a new order (requires user_id, product, and quantity)
- **Data Storage**: Order information stored in PostgreSQL database

### Frontend Service (port: 9000)
- **Tech Stack**: Python Flask, HTML, CSS, JavaScript
- **Features**:
  - User-facing interface for browsing and renting board games
  - Admin interface for managing members, board games, and rentals
- **Endpoints**:
  - `/`: User-facing board game rental interface
  - `/admin`: Management interface for system administration

## How to Run the Project

### Prerequisites
- Install Docker and Docker Compose
- Ensure the following ports are available: 5001, 5002, 5003, 9000

### Starting the Services

```bash
# Build and start all services
docker-compose up

# Or run in the background
docker-compose up -d
```

### Using the System

#### User Interface
1. Access the user interface at: http://localhost:9000/
2. Features available:
   - Browse board games by category
   - Search for specific games
   - View game details including players supported and duration
   - Add games to cart for rental
   - Create an account or log in
   - Sync sample games to database (button available on the home page)

#### Admin Interface
1. Access the admin interface at: http://localhost:9000/admin
2. Management features:
   - Add new members (name and email)
   - Add new board games (name, price, players, duration, description, and image)
   - Edit existing board games
   - Delete board games
   - Create rental records
   - View all members, board games, and rental records

#### API Usage Examples

1. Create a user:
```bash
curl -X POST http://localhost:5001/users -H "Content-Type: application/json" -d '{"name": "John Doe", "email": "john@example.com"}'
```

2. Create a product:
```bash
curl -X POST http://localhost:5002/products -H "Content-Type: application/json" -d '{"name": "Catan", "price": 4.99, "description": "Players: 3-4 players\nDuration: 60-120 minutes\nA classic strategy game."}'
```

3. Create an order:
```bash
curl -X POST http://localhost:5003/orders -H "Content-Type: application/json" -d '{"user_id": 1, "product": "Catan", "quantity": 3}'
```

4. Query all orders:
```bash
curl http://localhost:5003/orders
```

## System Features

1. **Loosely Coupled Architecture**: Services are independent and can be developed, tested, and deployed separately
2. **Technology Diversity**: Different services use different programming languages and databases
3. **Containerized Deployment**: Docker containers ensure cross-platform consistency
4. **Service Discovery**: Service name resolution through Docker Compose
5. **Scalability**: Each service can be scaled independently as needed
6. **Responsive UI**: Mobile-friendly user interfaces for both customer and admin sides
7. **Image Storage**: Board game images stored as Base64 in the database for simplicity

## Troubleshooting

1. **Images not uploading**: If you encounter "Request entity too large" errors, ensure the image file size is reasonable (under 1MB) or try using the image compression feature
2. **Services not connecting**: Check if all containers are running with `docker-compose ps`
3. **Data not showing up**: Try restarting the services with `docker-compose restart`
4. **Browser caching issues**: Use force-refresh (Ctrl+F5 or Cmd+Shift+R) to clear browser cache

## Future Improvements

1. Add API gateway for unified request management
2. Implement service-to-service communication (e.g., order service automatically checks if user and product exist)
3. Add message queues for asynchronous communication
4. Implement service health checks and auto-restart
5. Add user authentication and account management
6. Implement a proper image storage service instead of Base64 encoding
