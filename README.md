# DevConnect

DevConnect is a full-stack developer social platform where developers can create posts, interact with other developers, like posts, and add comments.

## Features

- User registration and login
- JWT-based authentication
- Access token and refresh token authentication
- Create posts
- View posts from other developers
- Edit and delete your own posts
- Like and unlike posts
- Add comments to posts
- View comments on posts
- Search for users by username
- View public user profiles
- Protected routes
- Real-time email availability checking during registration
- Password validation during registration

## Tech Stack

### Frontend

- React
- React Router
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

## Project Structure

```text
devconnect/
├── backend/
│   └── src/
│       ├── config/
│       ├── controller/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── app.js
│       └── index.js
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── utils/
│       ├── App.jsx
│       ├── App.css
│       └── main.jsx
├── .gitignore
├── package.json
└── README.md