# 🤖 AI Content Generator

A powerful, modern web application built with **Next.js 14** and **React** that generates high-quality content using AI. Create blog posts, social media content, emails, and product descriptions instantly with customizable tone and length options.

![AI Content Generator](https://img.shields.io/badge/Next.js-14-black) ![React](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-cyan)

## ✨ Features

- **🎨 Multiple Content Types**
  - Blog Posts
  - Social Media Content
  - Email Templates
  - Product Descriptions

- **⚙️ Customization Options**
  - 6 Different Tones (Professional, Casual, Friendly, Formal, Humorous, Persuasive)
  - 3 Length Options (Short, Medium, Long)
  - Real-time Content Preview

- **💫 User Experience**
  - Beautiful, Modern UI with Gradient Backgrounds
  - Responsive Design (Mobile, Tablet, Desktop)
  - Copy to Clipboard Functionality
  - Download Generated Content as Text Files
  - Loading States and Animations

- **🔧 Technical Features**
  - Built with Next.js 14 App Router
  - TypeScript for Type Safety
  - Tailwind CSS for Styling
  - API Route Integration
  - OpenAI API Support (Optional)
  - Mock Content Generation for Demo

## 🚀 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript
- **UI Library:** React 18
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI:** OpenAI API (Optional)

## 📦 Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ai-content-generator.git
cd ai-content-generator
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables (Optional)**
```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your OpenAI API key:
```env
OPENAI_API_KEY=your_api_key_here
```

> **Note:** The app works perfectly without an API key using high-quality mock content for demonstrations!

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**

Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 Usage

1. **Select Content Type**
   - Choose from Blog Post, Social Media, Email, or Product Description

2. **Enter Your Prompt**
   - Describe what content you want to generate
   - Example: "Write about the benefits of morning exercise"

3. **Customize Settings**
   - Select your preferred tone (Professional, Casual, etc.)
   - Choose content length (Short, Medium, Long)

4. **Generate Content**
   - Click "Generate Content" button
   - Wait for AI to create your content

5. **Use Your Content**
   - Copy to clipboard with one click
   - Download as a text file
   - Edit or refine as needed

## 📁 Project Structure

```
ai-content-generator/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint for content generation
│   ├── layout.tsx                # Root layout component
│   ├── page.tsx                  # Main application page
│   └── globals.css               # Global styles
├── public/                       # Static assets
├── .env.example                  # Environment variables template
├── next.config.js                # Next.js configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Project dependencies
└── README.md                     # Project documentation
```

## 🎨 Screenshots

### Home Page
Beautiful gradient interface with content type selection and customization options.

### Generated Content
Real-time preview of AI-generated content with copy and download features.

## 🔑 API Integration

### OpenAI API (Optional)

To use real AI generation instead of mock content:

1. Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
2. Add it to your `.env.local` file
3. The app will automatically use GPT-3.5-turbo for content generation

### Mock Content Mode

Without an API key, the app uses intelligent mock content generation that:
- Adapts to your selected content type
- Respects tone and length preferences
- Provides realistic, high-quality examples
- Perfect for demonstrations and testing

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project on [Vercel](https://vercel.com)
3. Add environment variables (if using OpenAI)
4. Deploy!

### Other Platforms

The app can be deployed on any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Render

## 🛠️ Development

### Running Tests
```bash
npm run test
```

### Building for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## 📝 Future Enhancements

- [ ] Save generated content history
- [ ] User authentication and accounts
- [ ] More content types (scripts, ad copy, etc.)
- [ ] SEO optimization suggestions
- [ ] Multi-language support
- [ ] Batch content generation
- [ ] Export to multiple formats (PDF, DOCX)
- [ ] Content templates library
- [ ] A/B testing variations

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Name](https://linkedin.com/in/yourname)
- Portfolio: [yourportfolio.com](https://yourportfolio.com)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Lucide](https://lucide.dev/)
- AI powered by [OpenAI](https://openai.com/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Contact me via email: your.email@example.com

---

⭐ Star this repository if you find it helpful!
