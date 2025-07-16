# Website Undresser Chrome Extension

A professional Chrome extension that reveals the hidden technical details and comprehensive information behind any website you visit.

## Features

### Website Information
- Current URL and domain
- Protocol (HTTP/HTTPS)
- Port number
- Page title

### Server Information
- Server IP address
- Server name/hostname
- Server software (when available)
- Response time

### User Information
- Your public IP address
- Computer/platform name
- Browser type and version
- Operating system

### Security Information
- SSL certificate status
- Certificate issuer (when available)
- Certificate expiry date
- Security headers detection

### Network Information
- Connection type
- Geolocation (city, country)
- Internet Service Provider (ISP)
- DNS server information

## Installation Instructions

### Method 1: Load Unpacked Extension (Developer Mode)

1. **Enable Developer Mode in Chrome:**
   - Open Chrome and navigate to `chrome://extensions/`
   - Toggle the "Developer mode" switch in the top-right corner

2. **Load the Extension:**
   - Click the "Load unpacked" button
   - Navigate to the folder containing the extension files
   - Select the folder and click "Select Folder"

3. **Verify Installation:**
   - The extension should appear in your extensions list
   - You should see the Website Undresser icon in your Chrome toolbar
   - If the icon isn't visible, click the puzzle piece icon and pin Website Undresser

### Method 2: Pack and Install (Optional)

1. **Pack the Extension:**
   - In `chrome://extensions/`, click "Pack extension"
   - Select the extension folder as the root directory
   - Click "Pack Extension" to create a `.crx` file

2. **Install the Packed Extension:**
   - Drag and drop the `.crx` file onto the `chrome://extensions/` page
   - Click "Add extension" when prompted

## Usage

1. **Open the Extension:**
   - Click the Website Undresser icon in your Chrome toolbar
   - Or use the keyboard shortcut (if configured)

2. **View Information:**
   - The extension will automatically load information about the current website
   - Information is organized into clear sections for easy reading

3. **Refresh Data:**
   - Click the refresh icon in the header to update information
   - Data is automatically refreshed when you navigate to a new website

## Permissions Explained

The extension requires the following permissions:

- **activeTab**: To access information about the currently active tab
- **storage**: To cache data and store user preferences
- **webRequest**: To analyze network requests and response headers
- **host_permissions**: To make requests to external APIs for IP and geolocation data

## Privacy & Security

- The extension only accesses information about the currently active tab
- No personal data is stored or transmitted to third parties
- External API calls are made only to public services for IP and geolocation lookup
- All data processing happens locally in your browser

## Troubleshooting

### Extension Not Loading
- Ensure all files are in the same directory
- Check that manifest.json is valid JSON
- Verify Developer Mode is enabled

### Missing Information
- Some information may not be available for certain websites
- Local/file:// URLs have limited information available
- Some corporate networks may block external API calls

### Performance Issues
- The extension caches data to minimize API calls
- Refresh the extension if data seems outdated
- Check browser console for any error messages

## Technical Details

### Architecture
- **Manifest V3**: Uses the latest Chrome extension architecture
- **Service Worker**: Background script for data caching and API calls
- **Content Script**: Injected script for webpage-specific information
- **Popup Interface**: Clean, responsive UI for displaying information

### APIs Used
- **Chrome Extensions API**: For tab management and storage
- **ipify.org**: For public IP address lookup
- **ipapi.co**: For geolocation and ISP information
- **Google DNS**: For domain name resolution

### Browser Compatibility
- Chrome 88+ (Manifest V3 support required)
- Chromium-based browsers (Edge, Brave, etc.)

## Development

### File Structure
```
network-inspector/
├── manifest.json          # Extension configuration
├── popup.html            # Main UI interface
├── popup.css             # Styling for the popup
├── popup.js              # Main popup logic
├── content.js            # Content script for webpage data
├── background.js         # Service worker for background tasks
├── icons/                # Extension icons (16, 32, 48, 128px)
└── README.md            # This file
```

### Building
No build process required - the extension runs directly from source files.

### Contributing
1. Fork the repository
2. Make your changes
3. Test thoroughly with different websites
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console for error messages
3. Ensure you're using a supported Chrome version
4. Verify all extension files are present and unmodified

---

**Note**: This extension is designed for educational and informational purposes. Always respect website terms of service and privacy policies when using network analysis tools.