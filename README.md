# 📝 Blog API

A RESTful API for a blog platform with authentication, role-based access control, posts, and comments.

## 🌐 Base URL
```

[http://localhost:3000/api](http://localhost:3000/api)

````

---

## 🔐 Authentication

### ➕ Register
`POST /auth/register`

```json
{
  "fullname": "John Doe",
  "email": "john@example.com",
  "password": "yourpassword"
}
````

### 🔑 Login

`POST /auth/login`

```json
{
  "email": "john@example.com",
  "password": "yourpassword"
}
```

**Response:**

```json
{
  "token": "JWT_TOKEN"
}
```

Include the token in all protected routes:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 👤 Users (Admin only)

| Method | Endpoint                 | Description            |
| ------ | ------------------------ | ---------------------- |
| PATCH  | `/users/:userId/promote` | Promote user to admin  |
| DELETE | `/users/:userId`         | Delete a user          |
| GET    | `/users/admins`          | List all admins        |
| GET    | `/users/readers`         | List all regular users |

---

## 📬 Posts

| Method | Endpoint             | Description                     |
| ------ | -------------------- | ------------------------------- |
| GET    | `/posts`             | Get published posts (paginated) |
| GET    | `/posts/:postId`     | Get post by ID                  |
| POST   | `/posts`             | Create a new post               |
| PUT    | `/posts/:postId`     | Update a post                   |
| DELETE | `/posts/:postId`     | Delete a post                   |
| GET    | `/posts/unpublished` | Get drafts (admin only)         |

**Post Schema:**

```json
{
  "title": "Post Title",
  "description": "Optional summary",
  "body": "Post content",
  "image": "https://example.com/image.jpg",
  "state": "draft" // or "published"
}
```

---

## 💬 Comments

| Method | Endpoint                             | Description    |
| ------ | ------------------------------------ | -------------- |
| POST   | `/posts/:postId/comment`             | Create comment |
| PUT    | `/posts/:postId/comments/:commentId` | Update comment |
| DELETE | `/posts/:postId/comments/:commentId` | Delete comment |

**Comment Schema:**

```json
{
  "body": "This is my comment"
}
```

---

## ✅ Validation

Data is validated using **Joi** on backend.

| Action         | Validated Fields                       |
| -------------- | -------------------------------------- |
| Register       | fullname, email, password              |
| Login          | email, password                        |
| Create Post    | title, body, state, description, image |
| Update Post    | title, body, state, description, image |
| Create Comment | body                                   |
| Update Comment | body                                   |

---

## 🛑 Error Responses

All errors are returned in this format:

```json
{
  "error": "Error message here"
}
```

---

## 🔒 Authorization Logic

* Users must be logged in to access protected routes.
* Only **admins** can:

  * Promote users
  * Delete users
  * View unpublished posts

---

## 🔁 Coming Soon / Optional

* 🔍 Full-text search
* 🧪 API tests
* 📦 Postman collection
* 🌍 Deployment guide

---

## 🛠️ Technologies Used

* Node.js
* Express.js
* Prisma + PostgreSQL
* JWT Authentication
* Joi Validation

---

```

Let me know if you want me to:
- Add **setup instructions** (install, run, env setup)
- Convert this to French or Arabic
- Or generate a **Postman collection** for testing!
```
