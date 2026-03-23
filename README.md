# 🏛️ ClubNest

**ClubNest** is a full-stack club management platform where users can discover, join, and manage clubs across various categories. Club managers can create and manage their own clubs, while admins oversee the entire platform.

🔗 **Live Site:** [https://clubnest.netlify.app](https://clubnest.netlify.app)

---

## ✨ Features

### 👤 Member
- Register & login with email/password or Google
- Browse and discover clubs by category
- Join clubs and manage memberships
- Profile photo upload via Cloudinary

### 🧑‍💼 Club Manager
- Create new clubs (submitted for admin approval)
- Edit club details — name, description, category, location, banner, membership fee
- Upload banner images directly via Cloudinary
- Track club status (Pending / Approved / Rejected)

### 🔐 Admin
- Review and approve/reject club submissions
- Manage all clubs and users on the platform

---

## 🗂️ Club Categories

Photography · Sports · Music · Technology · Art · Literature · Science · Business · Gaming · Books · Cooking · Fitness · Travel · Other

---

## 🛠️ Tech Stack

### Frontend
| Tech | Usage |
|---|---|
| [React](https://react.dev) | UI framework |
| [Tailwind CSS](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion) | Animations |
| [React Router](https://reactrouter.com) | Client-side routing |
| [TanStack Query](https://tanstack.com/query) | Server state management |
| [React Hook Form](https://react-hook-form.com) | Form handling & validation |
| [SweetAlert2](https://sweetalert2.github.io) | Alerts & confirmations |
| [React Hot Toast](https://react-hot-toast.com) | Toast notifications |
| [Lucide React](https://lucide.dev) | Icons |
| [React Helmet Async](https://github.com/staylor/react-helmet-async) | Dynamic page titles |

### Backend
| Tech | Usage |
|---|---|
| [Node.js](https://nodejs.org) | Runtime environment |
| [Express.js](https://expressjs.com) | Web framework |
| [MongoDB](https://www.mongodb.com) | Database (raw driver) |

### Services
| Service | Usage |
|---|---|
| [Firebase](https://firebase.google.com) | Authentication |
| [Cloudinary](https://cloudinary.com) | Image uploads |
| [Netlify](https://netlify.com) | Frontend deployment |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- A Firebase project
- A Cloudinary account
- A MongoDB cluster

### Installation

```bash
# Clone the repository
git clone https://github.com/kamrulhasanbullet/ClubNest.git

# Install frontend dependencies
cd client
npm install
```

### Frontend Environment Variables

Create a `.env` file inside the `client` directory:

```env
VITE_API_URL=your_backend_api_url

VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_STRIPE_PK=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=
```

### Running the App

```bash
# Start frontend (separate terminal)
cd client
npm run dev
```

---


## 📦 Deployment

The frontend is deployed on **Netlify** with automatic deployments from the main branch.

---

## 📄 License

This project is for educational purposes.
