# opontorno.github.io

Personal website of Orazio Pontorno - AI Researcher & Ph.D. in Artificial Intelligence

## 🚀 Quick Start

### For Online Viewing (GitHub Pages)
Simply visit: **https://opontorno.github.io**

### For Local Development
```bash
# Start a local server
python3 -m http.server 8000
# Then open http://localhost:8000
```

### For Offline Viewing
```bash
# Build standalone version
./build-and-open.sh
# Or manually:
python3 build.py
# Then open index-standalone.html in your browser
```

## 📁 Project Structure

This website uses a **modular architecture** for better maintainability:

```
opontorno.github.io/
├── index.html              # Main entry point (requires server)
├── index-standalone.html   # Single-file version (generated)
├── partials/               # Modular content sections
│   ├── home.html          # Home section
│   ├── cv.html            # CV section
│   └── activities.html    # Research activities
├── js/
│   ├── partials-loader.js # Dynamic content loader
│   └── script.js          # Main scripts
├── css/                    # Stylesheets
├── images/                 # Image assets
├── build.py               # Build script
└── build-and-open.sh      # Quick build & open script
```

## ⚠️ Important: Why Two Versions?

### Version 1: `index.html` (Modular - For Development)
- ✅ Easy to maintain (separated sections)
- ✅ Works on GitHub Pages
- ❌ **Requires a web server** (doesn't work with `file://`)

### Version 2: `index-standalone.html` (Compiled - For Offline)
- ✅ Works without a server (can open directly)
- ✅ Single file, easy to share
- ❌ Must be rebuilt after changes

**Why?** Browsers block Fetch API on `file://` protocol for security reasons.

## 🛠️ Development Workflow

1. **Edit content** in `partials/*.html`
2. **Test locally** with `python3 -m http.server 8000`
3. **Commit** to GitHub (modular version)
4. **Build standalone** when needed: `python3 build.py`

## 📝 Editing Content

### Modify Home Section
```bash
nano partials/home.html
```

### Modify CV Section
```bash
nano partials/cv.html
```

### Modify Research Activities
```bash
nano partials/activities.html
```

### Modify Styles
```bash
nano css/style.css
nano css/style-home.css
```

## 🌐 Deployment

### To GitHub Pages
```bash
git add index.html partials/ js/ css/
git commit -m "Update content"
git push origin main
```

### For Local Distribution
```bash
python3 build.py
# Share the generated index-standalone.html
```

## 🔍 Troubleshooting

### "Content not loading" when opening index.html directly
➡️ This is expected! Use `index-standalone.html` or start a server.

### Want to test locally?
```bash
python3 -m http.server 8000
```

### Need a standalone file?
```bash
./build-and-open.sh
```

## 📚 Documentation

For detailed information about the modular structure, see [MODULAR-STRUCTURE.md](MODULAR-STRUCTURE.md)

## 🔗 Links

- Website: https://opontorno.github.io
- LinkedIn: https://www.linkedin.com/in/opontorno
- GitHub: https://github.com/opontorno
- ORCID: https://orcid.org/0009-0009-0381-9971

---

**Last Update**: February 2026