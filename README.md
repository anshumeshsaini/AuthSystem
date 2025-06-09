

This project is a Next.js dashboard application for proPAL AI, featuring authentication and agent configuration management. The initial setup and boilerplate code were generated with AI assistance.

## 🚀 Features

- **Authentication System**
  - User signup and login
  - Form validation
  - Protected routes
- **Dashboard**
  - Profile management
  - Agent configuration
  - Responsive sidebar
- **STT Configuration**
  - Interdependent dropdowns (Provider → Model → Language)
  - Configuration summary card
- **Extras**
  - Dark mode toggle
  - Form success/error feedback
  - LocalStorage persistence
  - Smooth UI animations

## 🛠 Tech Stack

- ⚛️ Next.js (App Router)
- 🎨 Tailwind CSS
- 🏷 TypeScript
- 🗄 JSON-based data storage
- 🌓 Dark mode support

## 🏁 Getting Started

### Prerequisites
- Node.js v18+
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/propal-ai-dashboard.git
   cd propal-ai-dashboard
   ```

2. Install dependencies:
   ```bash
   bun install
   # or
   yarn install
   ```

3. Set up the data files:
   - Create `public/users.json` with initial content:
     ```json
     []
     ```
   - The `public/stt.json` is already provided in the repository

4. Run the development server:
   ```bash
   bun run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧩 Project Structure


```

## 🤖 AI-Assisted Development

This project was initially set up with AI assistance for:
- Boilerplate code generation
- Component structure suggestions
- Form validation logic
- State management patterns
- Tailwind CSS utility class recommendations

All generated code has been reviewed and modified to fit the project requirements.

## 📝 Notes

- For production use, consider:
  - Replacing JSON storage with a proper database
  - Implementing more secure authentication
  - Adding proper error boundaries
  - Setting up environment variables

## 📜 License

MIT

---

**Built with AI assistance** 🤖 + **human refinement** 👩💻
