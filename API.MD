# QKSS MAP API Documentation

## Overview

The QKSS MAP backend serves geolocated news “pins” via a REST interface under `/api`. The HTML/JavaScript frontend:

1. Fetches pin data on page load.
2. Renders markers on a Leaflet map.
3. Populates a sidebar with pin details.

## Authentication

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Request Body** (JSON):

```json
{
  "username": "admin",
  "password": "secret"
}
```

**Successful Response** (`200 OK`):

```json
{
  "token": "<JWT>"
}
```

> Protected endpoints require the HTTP header:
> `Authorization: Bearer <JWT>`



## Data Model

### Pin Object Schema

```json
{
  "id": "string",           // UUID or MongoDB ObjectId
  "title": "string",        // Short headline
  "description": "string",  // Detailed narrative (optional)
  "lat": number,              // Latitude
  "lng": number,              // Longitude
  "articleUrl": "string",   // External “read more” link
  "timestamp": "ISO-8601 string" // Event time
}
```

## Endpoints

### Public (No Authentication)

#### `GET /api/pins`

* **Query Parameters**:

  * `since` (optional): ISO-8601 timestamp to filter pins on or after this time.
* **Response** (`200 OK`): Array of `Pin` objects.

```http
GET /api/pins?since=2025-06-01T00:00:00Z
```

#### `GET /api/pins/{id}`

* **Path Parameter**:

  * `id`: Pin identifier (UUID or ObjectId).
* **Response** (`200 OK`): Single `Pin` object.

```http
GET /api/pins/60f5b7f8a2e6c12d4b8e1234
```

### Protected (Requires JWT)

Add header: `Authorization: Bearer <JWT>`
All request and response bodies are JSON.

#### `POST /api/pins`

* **Purpose**: Create a new pin.
* **Request Body**:

  ```json
  {
    "title": "string",
    "description": "string",
    "lat": number,
    "lng": number,
    "articleUrl": "string",
    "timestamp": "ISO-8601 string"
  }
  ```
* **Response**:

  * `201 Created` with `Location: /api/pins/{newId}`
  * Body: Created `Pin` object.

#### `PUT /api/pins/{id}`

* **Purpose**: Update an existing pin.
* **Path Parameter**: `id` of the pin.
* **Request Body**: Full `Pin` schema (including `id`).
* **Response**: `200 OK` with updated `Pin` object.

#### `DELETE /api/pins/{id}`

* **Purpose**: Remove a pin.
* **Path Parameter**: `id` of the pin.
* **Response**: `204 No Content`

## Error Handling

All errors return a JSON structure:

```json
{
  "timestamp": "ISO-8601 string",
  "status": number,
  "error": "string",
  "message": "string",
  "path": "string"
}
```

| HTTP Status | Condition                       |
| ----------- | ------------------------------- |
| 400         | Bad Request (validation failed) |
| 401         | Unauthorized (no/invalid JWT)   |
| 403         | Forbidden (insufficient rights) |
| 404         | Not Found (resource missing)    |
| 500         | Internal Server Error           |


## Frontend Interaction

1. **Load Map & List**:

   ```js
   fetch(`${API_BASE_URL}/pins`)
     .then(res => res.json())
     .then(pins => { /* render map and sidebar */ });
   ```
2. **Language Switcher**: Client-side filter by language code in `title`/`description`.
3. **Admin Panel** (`/admin`):

   * Obtain JWT via login form (`POST /api/auth/login`).
   * Store token in `localStorage`.
   * Use `fetch` with `Authorization` header for CRUD ops on `/api/pins`.
4. **Configuration**:

   * File: `static/config.js`

     ```js
     const API_BASE_URL = "https://imap.qkss.org/api/";
     ```