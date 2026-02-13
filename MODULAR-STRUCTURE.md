# Modular Website Structure

## Overview
The website has been restructured into a modular architecture for better maintainability. Instead of having all HTML content in a single monolithic `index.html` file, content is now separated into individual partial files that are dynamically loaded.

## File Structure

```
opontorno.github.io/
├── index.html                 # Main entry point (shell)
├── partials/                  # HTML content partials
│   ├── home.html             # Home section content
│   ├── cv.html               # CV section content
│   └── activities.html       # Research Activities section content
├── js/
│   ├── partials-loader.js    # Dynamic loader for partials
│   └── script.js             # Main application scripts
├── css/
│   ├── style.css             # Main styles
│   ├── style-home.css        # Home section styles
│   ├── style-aside.css       # Navigation sidebar styles
│   └── style-switcher.css    # Theme switcher styles
└── images/                    # Image assets
```

## How It Works

### 1. Main Entry Point (`index.html`)
The main `index.html` file now contains only:
- HTML head with meta tags and CSS links
- Navigation sidebar (aside)
- Empty placeholder containers for content sections
- Script references

Content placeholders:
```html
<div id="home-section"></div>
<div id="cv-section"></div>
<div id="activities-section"></div>
```

### 2. Partials Loader (`js/partials-loader.js`)
Automatically loads HTML partials when the page loads:
- Fetches HTML files from `/partials/` directory
- Injects content into designated containers
- Handles loading errors gracefully
- Initializes main scripts after all content is loaded

### 3. Content Partials (`partials/*.html`)
Individual HTML files containing section content:
- **home.html**: Hero section, stats cards, research interests, social icons
- **cv.html**: Biography, education timeline, experience timeline, skills
- **activities.html**: Publications list, workshop organization, reviewing activities

## Benefits

### ✅ Maintainability
- Each section can be edited independently
- No need to scroll through 900+ lines of code
- Clear separation of concerns

### ✅ Organization
- Easier to locate specific content
- Logical grouping of related elements
- Cleaner version control diffs

### ✅ Reusability
- Sections can be reused or swapped easily
- Template-like structure for future additions
- Easy to add new sections

### ✅ Collaboration
- Multiple people can work on different sections
- Reduced merge conflicts
- Clearer code ownership

## Editing Content

### To modify the Home section:
```bash
nano partials/home.html
```

### To modify the CV section:
```bash
nano partials/cv.html
```

### To modify Research Activities:
```bash
nano partials/activities.html
```

### To add a new section:
1. Create a new partial file in `partials/` (e.g., `contact.html`)
2. Add a placeholder in `index.html`:
   ```html
   <div id="contact-section"></div>
   ```
3. Update `partials-loader.js` to load the new partial:
   ```javascript
   loadPartial('partials/contact.html', 'contact-section'),
   ```

## Testing Locally

### ⚠️ Important: File Protocol Limitation

The modular version (`index.html`) **requires a web server** to work because browsers block Fetch API requests on the `file://` protocol for security reasons.

### Option 1: Build Standalone Version (Recommended for Offline Use)
```bash
python3 build.py
# Opens index-standalone.html directly in browser
```
This creates `index-standalone.html` with all partials inlined - works without a server!

### Option 2: Python HTTP Server (For Development)
```bash
cd /home/opontorno/opontorno.github.io
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 3: VS Code Live Server
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Building for Production

### For GitHub Pages (Modular Version)
The modular version works on GitHub Pages:
```bash
git add index.html partials/ js/ css/
git commit -m "Update content"
git push origin main
```

### For Offline/Local Use (Standalone Version)
Build a single-file version:
```bash
python3 build.py
# This creates index-standalone.html that can be opened directly
```

### Which Version to Use?

| Version | Use Case | Requires Server | File Count |
|---------|----------|-----------------|------------|
| `index.html` | Development, GitHub Pages | ✅ Yes | Multiple (modular) |
| `index-standalone.html` | Offline viewing, email sharing | ❌ No | Single file |

**Tip**: Keep developing with the modular version, then run `build.py` when you need a standalone file.

## Troubleshooting

### Content not loading?
- Check browser console for errors (F12)
- Ensure partial file paths are correct
- Verify partials-loader.js is loaded before script.js

### Styles not applying?
- Confirm CSS files are linked in index.html
- Check for CSS class name conflicts
- Verify partial HTML structure matches CSS selectors

### Navigation not working?
- Ensure anchor IDs match (e.g., `id="home"` with `href="#home"`)
- Check that script.js initializes after partials load
- Verify navigation event listeners are attached

##Backup

The original monolithic file is saved as `index_backup.html` for reference.

## Future Enhancements

Potential improvements:
- Add loading animations while partials load
- Implement lazy loading for better performance
- Create a build process for production optimization
- Add content caching for faster subsequent loads
- Implement service workers for offline support

---

**Note**: This modular structure maintains all original functionality while significantly improving code organization and maintainability.
