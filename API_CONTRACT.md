## Brainstorm Application Features
For CalmNest, here are the main features you can include in your API contract:

User Authentication & Profile Management:
Register new users
Log in users
Fetch and update profile

Relaxing Content Management:
Fetch relaxing music list
Fetch peaceful quotes
Fetch fun videos
Fetch yoga exercises

Support & Help:
Submit a request to talk to a counselor/help line
View emergency resources list

## Data Models

### User
{
  "id": "string",
  "username": "string",
  "email": "string",
  "password": "string (hashed)",
  "createdAt": "date",
  "updatedAt": "date"
}

### Music
{
  "id": "string",
  "title": "string",
  "url": "string",
  "duration": "number (seconds)"
}

### Quote
{
  "id": "string",
  "text": "string",
  "author": "string"
}

### Video
{
  "id": "string",
  "title": "string",
  "url": "string",
  "duration": "number (seconds)"
}

### YogaExercise
{
  "id": "string",
  "name": "string",
  "description": "string",
  "imageUrl": "string"
}

### SupportRequest
{
  "id": "string",
  "userId": "string",
  "message": "string",
  "createdAt": "date"
}


#### API Endpoints
### User Authentication
## Feature: Register a new user
HTTP Method: POST
Endpoint Path: /api/auth/register
Description: Creates a new user account.
Request Body:
{
  "username": "string",
  "email": "string",
  "password": "string"
}

Success Response (201 Created):
{
  "message": "User registered successfully",
  "userId": "string"
}

Error Response (400 Bad Request):
{
  "error": "Email already exists"
}

## Feature: User login
HTTP Method: POST
Endpoint Path: /api/auth/login
Description: Authenticates a user and returns a token.
Request Body:
{
  "email": "string",
  "password": "string"
}

Success Response (200 OK):
{
  "message": "Login successful",
  "token": "jwt-token-string"
}

Error Response (401 Unauthorized):
{
  "error": "Invalid email or password"
}

### Relaxing Content
## Feature: Get all relaxing music
HTTP Method: GET
Endpoint Path: /api/music
Description: Retrieves a list of relaxing music.
Success Response (200 OK):
{
    "id": "1",
    "text": "Peace begins with a smile.",
    "author": "Mother Teresa"
  }

Error Response (500 Internal Server Error):
{
  "error": "Failed to fetch music"
}

## Feature: Get peaceful quotes
HTTP Method: GET
Endpoint Path: /api/quotes
Description: Retrieves peaceful and motivational quotes.
Success Response (200 OK):

  {
    "id": "1",
    "text": "Peace begins with a smile.",
    "author": "Mother Teresa"
  }

Error Response (500 Internal Server Error):
{
  "error": "Failed to fetch quotes"
}

## Feature: Get yoga exercises
HTTP Method: GET
Endpoint Path: /api/yoga
Description: Retrieves a list of yoga exercises.
Success Response (200 OK):

  {
    "id": "1",
    "name": "Tree Pose (Vrikshasana)",
    "description": "A balancing pose that strengthens the legs and improves focus.",
    "imageUrl": "https://calmnest.com/yoga/tree_pose.jpg"
  }

Error Response (500 Internal Server Error):

{
  "error": "Failed to fetch yoga exercises"
}
### Support & Help
## Feature: Submit support request
HTTP Method: POST
Endpoint Path: /api/support
Description: Allows a user to request help from a counselor.
Request Body:
{
  "userId": "string",
  "message": "string"
}

Success Response (200 OK):
{
  "message": "Your request has been submitted successfully"
}
Error Response (400 Bad Request):
{
  "error": "Message is required"
}

## Feature: Get emergency resources
HTTP Method: GET
Endpoint Path: /api/resources
Description: Retrieves emergency helpline numbers and resources.
Success Response (200 OK):
  {
    "id": "1",
    "name": "Mental Health Helpline",
    "contact": "+91-1800-123-4567",
    "available": "24/7"
  }

Error Response (500 Internal Server Error):
{
  "error": "Failed to fetch resources"
}

### Error Response Structure
All error responses follow this format:

{
  "error": "Description of the error"
}
### Success Response Structure
All success responses contain:
{
  "message": "Description of success",
  "data": "Any additional returned data"
}
