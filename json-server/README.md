# JSON Server Demo

A simple JSON server for testing and development purposes.

## Features

- REST API endpoints for posts, users, products, and services
- Auto-reloading when db.json changes
- CORS enabled
- Simple and lightweight

## Available Endpoints

- **Posts**: `http://localhost:3001/posts`
- **Users**: `http://localhost:3001/users`
- **Products**: `http://localhost:3001/products`
- **Services**: `http://localhost:3001/services`

## Usage

### Start the server
```bash
cd json-server
npm start
```

### Start in development mode (accessible from external devices)
```bash
cd json-server
npm run dev
```

## Sample Data Structure

The server includes sample data for:
- **Posts**: Blog posts with title, content, author, and timestamps
- **Users**: User profiles with name, email, and role
- **Products**: Product catalog with pricing and categories
- **Services**: Service offerings with pricing and duration

## API Examples

```bash
# Get all posts
curl http://localhost:3001/posts

# Get a specific post
curl http://localhost:3001/posts/1

# Create a new post
curl -X POST http://localhost:3001/posts \
  -H "Content-Type: application/json" \
  -d '{"title": "New Post", "content": "Content here", "author": "Author Name"}'

# Update a post
curl -X PUT http://localhost:3001/posts/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Delete a post
curl -X DELETE http://localhost:3001/posts/1
```

## Integration with Module Federation

This JSON server can be used to provide mock data for your micro frontend applications. You can fetch data from these endpoints in your React components.
