# HTML Block Editor

A modern web-based block-style HTML editor with drag-and-drop functionality and real-time preview.

![HTML Block Editor](https://img.shields.io/badge/HTML-Block%20Editor-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🚀 Features

- **Block-Based Editing**: Create websites without writing code using a block-based interface
- **Drag & Drop**: Easily rearrange blocks to structure your page
- **Real-Time Preview**: See how your webpage looks as you build it
- **Responsive Testing**: Preview your design across desktop, tablet, and mobile devices
- **Local Storage**: Work offline with browser-based storage
- **Export to HTML**: Download your design as a complete HTML file
- **Advanced Blocks**: Use the "Add source directly" block for custom HTML when needed

## 📋 Block Categories

- **Text**: Headings, paragraphs, and lists
- **Media**: Images and videos
- **Structure**: Containers, sections, and rows for layout
- **Forms**: Inputs, buttons, and complete forms
- **Advanced**: Custom HTML and links

## 🛠️ Installation

```bash
# Clone the repository
git clone https://github.com/PrakharDoneria/WebScratchBuilder.git

# Navigate to the project directory
cd WebScratchBuilder

# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🔧 Usage

1. **Projects Page**: View and manage your saved projects
2. **Editor Page**: Build your webpage by adding and arranging blocks
3. **Preview Page**: See the final result and export to HTML

### Adding Blocks

1. Select a block type from the palette on the left
2. Drag it to the desired position on the canvas
3. Click on a block to edit its properties in the panel on the right

### Previewing Your Design

1. Click "Preview" to see how your webpage looks
2. Use the device toggle buttons to check responsiveness
3. Export the result as an HTML file when you're satisfied

## 🧪 Development

This project is built with:

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **State Management**: React Query, React Hooks
- **Drag & Drop**: react-beautiful-dnd, react-dnd
- **Storage**: Browser LocalStorage with server sync capability

### Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript definitions
├── server/                 # Express server
├── shared/                 # Shared types and schemas
└── README.md
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

### Development Guidelines

- Follow the existing code style and patterns
- Write clean, maintainable, and typed code
- Update documentation for any new features
- Test thoroughly across different browsers and devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Replit](https://replit.com) - Development platform
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [React Beautiful DnD](https://github.com/atlassian/react-beautiful-dnd) - Drag and drop functionality
- [TailwindCSS](https://tailwindcss.com/) - CSS framework