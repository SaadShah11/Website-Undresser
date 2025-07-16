# Chrome Extension Installation Guide

## Website Undresser Extension

This guide will walk you through installing the Website Undresser Chrome extension step by step.

## Prerequisites

- Google Chrome browser (version 88 or later)
- Basic computer skills (file navigation)

## Installation Steps

### Step 1: Download the Extension Files

1. Ensure you have all the extension files in a single folder:
   ```
   website-undresser/
   ├── manifest.json
   ├── popup.html
   ├── popup.css
   ├── popup.js
   ├── content.js
   ├── background.js
   ├── icons/
   │   ├── icon16.png
   │   ├── icon32.png
   │   ├── icon48.png
   │   └── icon128.png
   └── README.md
   ```

### Step 2: Enable Developer Mode

1. **Open Chrome Extensions Page:**
   - Type `chrome://extensions/` in your address bar and press Enter
   - OR click the three dots menu → More tools → Extensions

2. **Enable Developer Mode:**
   - Look for the "Developer mode" toggle in the top-right corner
   - Click the toggle to turn it ON
   - You should see additional buttons appear

### Step 3: Load the Extension

1. **Click "Load unpacked":**
   - You'll see this button after enabling Developer mode
   - Click on it to open a file browser

2. **Select Extension Folder:**
   - Navigate to the folder containing all the extension files
   - Select the folder (not individual files)
   - Click "Select Folder" or "Open"

3. **Verify Installation:**
   - The extension should appear in your extensions list
   - You should see "Website Undresser" with a toggle switch
   - Make sure the toggle is ON (blue/enabled)

### Step 4: Pin the Extension (Recommended)

1. **Find the Extension Icon:**
   - Look for the puzzle piece icon in your Chrome toolbar
   - Click on it to see all your extensions

2. **Pin Website Undresser:**
   - Find "Website Undresser" in the dropdown
   - Click the pin icon next to it
   - The extension icon should now appear directly in your toolbar

## Using the Extension

### Basic Usage

1. **Navigate to any website**
2. **Click the Website Undresser icon** in your toolbar
3. **View the information** displayed in the popup
4. **Click the refresh icon** to update data if needed

### What Information You'll See

- **Website Info**: URL, domain, protocol, port
- **Server Info**: IP address, server software, response time
- **Your Info**: Public IP, browser, operating system
- **Security Info**: SSL status, certificates, security headers
- **Network Info**: Connection type, location, ISP

## Troubleshooting

### Extension Won't Load

**Problem**: Error when loading the extension

**Solutions**:
1. Check that all files are in the same folder
2. Verify `manifest.json` is valid (no syntax errors)
3. Make sure Developer mode is enabled
4. Try refreshing the extensions page

### Extension Icon Not Visible

**Problem**: Can't find the extension icon

**Solutions**:
1. Click the puzzle piece icon in Chrome toolbar
2. Look for "Website Undresser" and pin it
3. Check if the extension is enabled in `chrome://extensions/`

### No Data Showing

**Problem**: Extension opens but shows "Unknown" for most fields

**Solutions**:
1. Make sure you're on a real website (not chrome:// pages)
2. Check your internet connection
3. Try refreshing the extension popup
4. Some corporate networks may block external API calls

### Permission Errors

**Problem**: Extension asks for permissions or doesn't work properly

**Solutions**:
1. The extension needs permissions to work correctly
2. Click "Allow" when prompted for permissions
3. Check extension permissions in `chrome://extensions/`

## Updating the Extension

### Manual Update

1. Download new extension files
2. Replace old files with new ones
3. Go to `chrome://extensions/`
4. Click the refresh icon on the Website Undresser extension
5. Or disable and re-enable the extension

### Automatic Updates

- This extension doesn't auto-update since it's loaded unpacked
- Check for updates manually by downloading new versions

## Uninstalling the Extension

### Remove Extension

1. Go to `chrome://extensions/`
2. Find "Website Undresser"
3. Click "Remove"
4. Confirm removal

### Clean Up Files

1. Delete the extension folder from your computer
2. Clear any cached data if desired

## Security & Privacy

### What Data is Accessed

- Current website URL and basic information
- Your public IP address (via external API)
- Browser and system information (locally available)
- Network response headers (when available)

### What Data is NOT Collected

- No personal files or data
- No browsing history
- No passwords or sensitive information
- No data is sent to third parties (except public IP lookup)

### External Services Used

- **ipify.org**: For public IP address lookup
- **ipapi.co**: For geolocation and ISP information
- **Google DNS**: For domain name resolution

## Advanced Usage

### Developer Console

- Press F12 to open developer tools
- Check the Console tab for any error messages
- This can help troubleshoot issues

### Extension Storage

- The extension caches some data locally
- Data is cleared when you navigate to new websites
- No persistent personal data is stored

## Getting Help

### Common Issues

1. **"This site can't be reached"**: Check internet connection
2. **"Unknown" values**: Some information may not be available for all sites
3. **Slow loading**: Network requests may take time on slow connections

### Support Resources

1. Check this installation guide
2. Review the main README.md file
3. Check browser console for error messages
4. Ensure you're using a supported Chrome version

---

**Congratulations!** You should now have the Website Undresser extension installed and working. Enjoy revealing the hidden technical details behind the websites you visit!