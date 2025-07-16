// Content script to gather additional information from the webpage
class ContentScriptInspector {
    constructor() {
        this.setupMessageListener();
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'getServerInfo') {
                this.getServerInfo().then(sendResponse);
                return true; // Keep message channel open for async response
            } else if (request.action === 'getSecurityInfo') {
                this.getSecurityInfo().then(sendResponse);
                return true;
            }
        });
    }

    async getServerInfo() {
        try {
            // Try to get server information from response headers
            const serverInfo = {
                serverIp: 'Unknown',
                serverName: window.location.hostname,
                serverSoftware: 'Unknown'
            };

            // Try to resolve IP using DNS lookup (limited in browser)
            try {
                // This is a workaround - we'll try to get IP from a DNS service
                const response = await fetch(`https://dns.google/resolve?name=${window.location.hostname}&type=A`);
                const dnsData = await response.json();
                
                if (dnsData.Answer && dnsData.Answer.length > 0) {
                    serverInfo.serverIp = dnsData.Answer[0].data;
                }
            } catch (error) {
                console.log('Could not resolve IP:', error);
            }

            // Try to get server software from headers (limited access in content script)
            try {
                const testResponse = await fetch(window.location.href, { method: 'HEAD' });
                const server = testResponse.headers.get('server');
                if (server) {
                    serverInfo.serverSoftware = server;
                }
            } catch (error) {
                console.log('Could not get server headers:', error);
            }

            return serverInfo;
        } catch (error) {
            console.error('Error getting server info:', error);
            return {
                serverIp: 'Unknown',
                serverName: window.location.hostname,
                serverSoftware: 'Unknown'
            };
        }
    }

    async getSecurityInfo() {
        try {
            const securityInfo = {
                certIssuer: 'Unknown',
                certExpiry: 'Unknown',
                securityHeaders: []
            };

            // Check for security-related meta tags
            const metaTags = document.querySelectorAll('meta[http-equiv]');
            const securityHeaders = [];

            metaTags.forEach(meta => {
                const httpEquiv = meta.getAttribute('http-equiv').toLowerCase();
                if (httpEquiv.includes('security') || 
                    httpEquiv.includes('csp') || 
                    httpEquiv.includes('content-security-policy')) {
                    securityHeaders.push(httpEquiv);
                }
            });

            // Check for HTTPS and certificate info (limited in content script)
            if (window.location.protocol === 'https:') {
                try {
                    // Try to get certificate info through a test request
                    const response = await fetch(window.location.origin, { method: 'HEAD' });
                    
                    // Check common security headers
                    const commonSecurityHeaders = [
                        'strict-transport-security',
                        'content-security-policy',
                        'x-frame-options',
                        'x-content-type-options',
                        'x-xss-protection'
                    ];

                    commonSecurityHeaders.forEach(header => {
                        if (response.headers.get(header)) {
                            securityHeaders.push(header);
                        }
                    });
                } catch (error) {
                    console.log('Could not check security headers:', error);
                }
            }

            securityInfo.securityHeaders = securityHeaders.length > 0 
                ? securityHeaders.join(', ') 
                : 'None detected';

            return securityInfo;
        } catch (error) {
            console.error('Error getting security info:', error);
            return {
                certIssuer: 'Unknown',
                certExpiry: 'Unknown',
                securityHeaders: 'Unknown'
            };
        }
    }

    // Additional utility methods
    getPagePerformanceInfo() {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            return {
                loadTime: Math.round(navigation.loadEventEnd - navigation.loadEventStart),
                domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart),
                responseTime: Math.round(navigation.responseEnd - navigation.requestStart)
            };
        }
        return null;
    }

    getResourceInfo() {
        const resources = performance.getEntriesByType('resource');
        const resourceSummary = {
            totalResources: resources.length,
            scripts: resources.filter(r => r.name.includes('.js')).length,
            stylesheets: resources.filter(r => r.name.includes('.css')).length,
            images: resources.filter(r => r.name.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)).length,
            fonts: resources.filter(r => r.name.match(/\.(woff|woff2|ttf|otf)$/i)).length
        };
        return resourceSummary;
    }
}

// Initialize content script
new ContentScriptInspector();