# Trainee CRUD API with Image Upload

A simple working CRUD API built with Node.js, Express, MongoDB, Mongoose, and Multer.

## Features

- Create trainee
- Get all trainees
- Get single trainee by id
- Update trainee
- Delete trainee
- Upload trainee image to local `uploads/` folder
- Save image filename in MongoDB
- Return public image URL in API response
- Delete old image on update and delete

## Requirements

- Node.js 18+ recommended
- MongoDB local or Atlas

## Setup

```bash
npm install
```

Copy env file:

```bash
cp .env.example .env
```

Edit `.env` if needed.

## Run

Development:

```bash
npm run dev
```

Production:

```bash
npm start
```

Server default URL:

```bash
http://localhost:5000
```

## API Endpoints

### 1. Create trainee

**POST** `/api/trainees`

Body type: `form-data`

| Key    | Type | Required |
|--------|------|----------|
| name   | text | yes      |
| email  | text | yes      |
| course | text | yes      |
| age    | text | yes      |
| image  | file | no       |

### 2. Get all trainees

**GET** `/api/trainees`

### 3. Get single trainee

**GET** `/api/trainees/:id`

### 4. Update trainee

**PUT** `/api/trainees/:id`

Body type: `form-data`

You can send only the fields you want to update.

### 5. Delete trainee

**DELETE** `/api/trainees/:id`

## Example Response

```json
{
  "success": true,
  "message": "Trainee created successfully",
  "data": {
    "_id": "661e123abc456def78900011",
    "name": "Rahul",
    "email": "rahul@gmail.com",
    "course": "Node.js",
    "age": 23,
    "image": "17132456789-rahul.png",
    "imageUrl": "http://localhost:5000/uploads/17132456789-rahul.png",
    "createdAt": "2026-04-16T06:30:00.000Z",
    "updatedAt": "2026-04-16T06:30:00.000Z"
  }
}
```

## Notes

- Uploaded files are stored locally in `uploads/`
- Uploaded images are ignored by Git except `.gitkeep`
- To keep images in Git, remove the `uploads/*` rule from `.gitignore`

## Postman

A Postman collection is included:

- `postman/Trainee CRUD API.postman_collection.json`
