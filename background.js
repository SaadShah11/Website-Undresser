// Background service worker for Website Undresser extension
class BackgroundService {
    constructor() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Handle extension installation
        chrome.runtime.onInstalled.addListener((details) => {
            if (details.reason === 'install') {
                console.log('Website Undresser extension installed');
                this.setDefaultSettings();
            } else if (details.reason === 'update') {
                console.log('Website Undresser extension updated');
            }
        });

        // Handle tab updates to refresh data
        chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (changeInfo.status === 'complete' && tab.url) {
                this.handleTabUpdate(tabId, tab);
            }
        });

        // Handle messages from popup or content scripts
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            this.handleMessage(request, sender, sendResponse);
            return true; // Keep message channel open for async responses
        });
    }

    setDefaultSettings() {
        // Set default extension settings
        chrome.storage.local.set({
            autoRefresh: true,
            showNotifications: false,
            cacheTimeout: 300000 // 5 minutes
        });
    }

    handleTabUpdate(tabId, tab) {
        // Clear cached data when tab URL changes
        const url = new URL(tab.url);
        const cacheKey = `cache_${url.hostname}`;
        
        chrome.storage.local.remove(cacheKey);
    }

    async handleMessage(request, sender, sendResponse) {
        try {
            switch (request.action) {
                case 'getNetworkInfo':
                    const networkInfo = await this.getNetworkInfo(request.url);
                    sendResponse({ success: true, data: networkInfo });
                    break;
                
                case 'getCachedData':
                    const cachedData = await this.getCachedData(request.key);
                    sendResponse({ success: true, data: cachedData });
                    break;
                
                case 'setCachedData':
                    await this.setCachedData(request.key, request.data);
                    sendResponse({ success: true });
                    break;
                
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        } catch (error) {
            console.error('Background script error:', error);
            sendResponse({ success: false, error: error.message });
        }
    }

    async getNetworkInfo(url) {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            
            // Check cache first
            const cacheKey = `network_${hostname}`;
            const cached = await this.getCachedData(cacheKey);
            
            if (cached && Date.now() - cached.timestamp < 300000) { // 5 minutes cache
                return cached.data;
            }

            // Gather network information
            const networkInfo = {
                hostname: hostname,
                port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
                protocol: urlObj.protocol.replace(':', ''),
                timestamp: Date.now()
            };

            // Try to get additional DNS information
            try {
                const dnsResponse = await fetch(`https://dns.google/resolve?name=${hostname}&type=A`);
                const dnsData = await dnsResponse.json();
                
                if (dnsData.Answer && dnsData.Answer.length > 0) {
                    networkInfo.ipAddress = dnsData.Answer[0].data;
                }
            } catch (error) {
                console.log('DNS lookup failed:', error);
                networkInfo.ipAddress = 'Unknown';
            }

            // Cache the result
            await this.setCachedData(cacheKey, {
                data: networkInfo,
                timestamp: Date.now()
            });

            return networkInfo;
        } catch (error) {
            console.error('Error getting network info:', error);
            throw error;
        }
    }

    async getCachedData(key) {
        return new Promise((resolve) => {
            chrome.storage.local.get([key], (result) => {
                resolve(result[key] || null);
            });
        });
    }

    async setCachedData(key, data) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ [key]: data }, () => {
                resolve();
            });
        });
    }

    // Utility method to check if URL is valid for inspection
    isValidUrl(url) {
        try {
            const urlObj = new URL(url);
            return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
        } catch (error) {
            return false;
        }
    }

    // Method to handle web request events (if needed)
    setupWebRequestListeners() {
        chrome.webRequest.onHeadersReceived.addListener(
            (details) => {
                // Store response headers for analysis
                const headers = {};
                details.responseHeaders?.forEach(header => {
                    headers[header.name.toLowerCase()] = header.value;
                });
                
                // Cache headers for popup to use
                const cacheKey = `headers_${new URL(details.url).hostname}`;
                this.setCachedData(cacheKey, {
                    headers: headers,
                    timestamp: Date.now()
                });
            },
            { urls: ["<all_urls>"] },
            ["responseHeaders"]
        );
    }
}

// Initialize background service
new BackgroundService();