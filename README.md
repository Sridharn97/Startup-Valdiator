# 🚀 **Startup Idea Validator** - Full-Stack MERN Application

## 📝 **Project Overview**
**Startup Idea Validator** is a platform where users can submit, view, update, and delete startup ideas. Each idea includes details such as title, description, category, tech stack, votes (upvotes/downvotes), comments, and status (Pending, Approved, Rejected). Users can interact with other users by voting and commenting on startup ideas. Admins have the ability to moderate ideas and comments.

### 🔥 **Features:**
- **User Authentication** 🔐: JWT-based authentication for user login and registration.
- **Role-based Access** 👥: Users and admins have different roles with specific access permissions.
- **Startup Idea Management** 💡: Users can submit, edit, delete, and interact with startup ideas.
- **Voting & Commenting** 👍💬: Users can upvote/downvote and comment on ideas.
- **Admin Panel** 🛠️: Admins can approve, reject, delete ideas, and moderate comments.
- **Real-time Voting (Optional)** ⚡: Use Socket.io to update vote counts in real time.

---

## 🖥️ **Tech Stack**
- **Frontend**: React.js (Vite for fast development)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Authentication**: JWT-based authentication
- **Styling**: Tailwind CSS (preferred) or Material UI
- **Real-time Updates**: Socket.io (optional for real-time vote count)

---

## 📁 **Project Structure**

### Frontend (React + Vite)
- **Pages**:
  - `Home`: Displays all startup ideas.
  - `Idea Details`: Displays details for a specific idea.
  - `Dashboard`: User's personal dashboard to manage their ideas.
  - `Admin Panel`: Admin-only page to manage all ideas and comments.

- **Components**:
  - `IdeaCard`: Displays the idea details with upvote/downvote buttons.
  - `IdeaForm`: Form to add or edit a startup idea.
  - `CommentBox`: Displays comments and allows users to add new ones.

### Backend (Node.js + Express)
- **Routes**:
  - `/auth/register`: Register a new user.
  - `/auth/login`: Login with credentials to get a JWT token.
  - `/ideas`: Get all startup ideas.
  - `/ideas/:id`: Get, update, or delete a specific idea by ID.
  - `/ideas/:id/vote`: Vote on a specific idea (upvote/downvote).
  - `/comments/:ideaId`: Get and post comments for a specific idea.
  - `/admin/ideas`: Admin view to see all ideas and manage them.
  - `/admin/ideas/:id/status`: Admin API to approve/reject an idea.
  - `/admin/comments/:id`: Admin API to delete a comment.

---

## 📡 **API Endpoints**

### Auth Routes:
- **POST** `/auth/register`: Registers a new user.
- **POST** `/auth/login`: Logs in a user and returns a JWT token.

### Idea Routes:
- **GET** `/ideas`: Fetches all startup ideas.
- **GET** `/ideas/:id`: Fetches a specific startup idea by ID.
- **POST** `/ideas`: Submits a new startup idea.
- **PUT** `/ideas/:id`: Edits an existing startup idea.
- **DELETE** `/ideas/:id`: Deletes a specific startup idea.
- **POST** `/ideas/:id/vote`: Votes on an idea (upvote or downvote).

### Comment Routes:
- **GET** `/comments/:ideaId`: Fetches comments for a specific idea.
- **POST** `/comments/:ideaId`: Adds a comment for a specific idea.

### Admin Routes:
- **GET** `/admin/ideas`: Admin can view all ideas.
- **PUT** `/admin/ideas/:id/status`: Admin can approve or reject an idea.
- **DELETE** `/admin/ideas/:id`: Admin can delete an idea.
- **DELETE** `/admin/comments/:id`: Admin can delete a comment.

---

## 🗂️ **Database Models**

1. **User Schema**:
   - `username`: String
   - `email`: String
   - `password`: String (hashed)
   - `role`: Enum (`user`, `admin`)

2. **Idea Schema**:
   - `title`: String
   - `description`: String
   - `category`: String
   - `techStack`: [String]
   - `votes`: Object `{ upvotes: Number, downvotes: Number }`
   - `status`: Enum (`Pending`, `Approved`, `Rejected`)
   - `userId`: ObjectId (reference to the creator)

3. **Comment Schema**:
   - `ideaId`: ObjectId (reference to the idea)
   - `userId`: ObjectId (reference to the user)
   - `content`: String
   - `timestamp`: Date

---

## 🛠️ **Running the Project**

### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/startup-idea-validator.git
   cd startup-idea-validator
