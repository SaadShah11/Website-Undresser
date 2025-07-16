class NetworkInspector {
    constructor() {
        this.initializeElements();
        this.bindEvents();
        this.loadInformation();
    }

    initializeElements() {
        this.elements = {
            loading: document.getElementById('loading'),
            content: document.getElementById('content'),
            error: document.getElementById('error'),
            refreshBtn: document.getElementById('refreshBtn'),
            
            // Website info
            currentUrl: document.getElementById('currentUrl'),
            domain: document.getElementById('domain'),
            protocol: document.getElementById('protocol'),
            port: document.getElementById('port'),
            
            // Server info
            serverIp: document.getElementById('serverIp'),
            serverName: document.getElementById('serverName'),
            serverSoftware: document.getElementById('serverSoftware'),
            responseTime: document.getElementById('responseTime'),
            
            // User info
            userIp: document.getElementById('userIp'),
            computerName: document.getElementById('computerName'),
            browser: document.getElementById('browser'),
            operatingSystem: document.getElementById('operatingSystem'),
            
            // Security info
            sslStatus: document.getElementById('sslStatus'),
            certIssuer: document.getElementById('certIssuer'),
            certExpiry: document.getElementById('certExpiry'),
            securityHeaders: document.getElementById('securityHeaders'),
            
            // Network info
            connectionType: document.getElementById('connectionType'),
            geolocation: document.getElementById('geolocation'),
            isp: document.getElementById('isp'),
            dnsServers: document.getElementById('dnsServers')
        };
    }

    bindEvents() {
        this.elements.refreshBtn.addEventListener('click', () => {
            this.loadInformation();
        });
    }

    async loadInformation() {
        this.showLoading();
        
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab || !tab.url) {
                throw new Error('No active tab found');
            }

            const url = new URL(tab.url);
            
            // Load all information concurrently
            const [
                websiteInfo,
                serverInfo,
                userInfo,
                securityInfo,
                networkInfo
            ] = await Promise.allSettled([
                this.getWebsiteInfo(tab, url),
                this.getServerInfo(url),
                this.getUserInfo(),
                this.getSecurityInfo(tab, url),
                this.getNetworkInfo()
            ]);

            this.displayInformation({
                website: websiteInfo.status === 'fulfilled' ? websiteInfo.value : {},
                server: serverInfo.status === 'fulfilled' ? serverInfo.value : {},
                user: userInfo.status === 'fulfilled' ? userInfo.value : {},
                security: securityInfo.status === 'fulfilled' ? securityInfo.value : {},
                network: networkInfo.status === 'fulfilled' ? networkInfo.value : {}
            });

            this.showContent();
        } catch (error) {
            console.error('Error loading information:', error);
            this.showError();
        }
    }

    async getWebsiteInfo(tab, url) {
        return {
            url: url.href,
            domain: url.hostname,
            protocol: url.protocol.replace(':', ''),
            port: url.port || (url.protocol === 'https:' ? '443' : '80'),
            title: tab.title
        };
    }

    async getServerInfo(url) {
        const startTime = performance.now();
        
        try {
            // Try to get server information through content script
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(tab.id, { action: 'getServerInfo' });
            
            const endTime = performance.now();
            const responseTime = Math.round(endTime - startTime);

            return {
                ip: response?.serverIp || 'Unknown',
                name: response?.serverName || url.hostname,
                software: response?.serverSoftware || 'Unknown',
                responseTime: `${responseTime}ms`
            };
        } catch (error) {
            return {
                ip: 'Unknown',
                name: url.hostname,
                software: 'Unknown',
                responseTime: 'Unknown'
            };
        }
    }

    async getUserInfo() {
        const userAgent = navigator.userAgent;
        const platform = navigator.platform;
        
        // Get browser info
        let browser = 'Unknown';
        if (userAgent.includes('Chrome')) browser = 'Chrome';
        else if (userAgent.includes('Firefox')) browser = 'Firefox';
        else if (userAgent.includes('Safari')) browser = 'Safari';
        else if (userAgent.includes('Edge')) browser = 'Edge';

        // Get OS info
        let os = 'Unknown';
        if (platform.includes('Win')) os = 'Windows';
        else if (platform.includes('Mac')) os = 'macOS';
        else if (platform.includes('Linux')) os = 'Linux';
        else if (userAgent.includes('Android')) os = 'Android';
        else if (userAgent.includes('iPhone') || userAgent.includes('iPad')) os = 'iOS';

        // Get user IP
        let userIp = 'Loading...';
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipResponse.json();
            userIp = ipData.ip;
        } catch (error) {
            userIp = 'Unknown';
        }

        return {
            ip: userIp,
            computerName: navigator.platform || 'Unknown',
            browser: browser,
            os: os
        };
    }

    async getSecurityInfo(tab, url) {
        const isHttps = url.protocol === 'https:';
        
        try {
            const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
            const response = await chrome.tabs.sendMessage(activeTab.id, { action: 'getSecurityInfo' });
            
            return {
                sslStatus: isHttps ? 'Secure (HTTPS)' : 'Insecure (HTTP)',
                certIssuer: response?.certIssuer || (isHttps ? 'Unknown' : 'N/A'),
                certExpiry: response?.certExpiry || (isHttps ? 'Unknown' : 'N/A'),
                securityHeaders: response?.securityHeaders || 'Unknown'
            };
        } catch (error) {
            return {
                sslStatus: isHttps ? 'Secure (HTTPS)' : 'Insecure (HTTP)',
                certIssuer: isHttps ? 'Unknown' : 'N/A',
                certExpiry: isHttps ? 'Unknown' : 'N/A',
                securityHeaders: 'Unknown'
            };
        }
    }

    async getNetworkInfo() {
        let connectionType = 'Unknown';
        let geolocation = 'Unknown';
        let isp = 'Unknown';

        // Get connection type
        if ('connection' in navigator) {
            connectionType = navigator.connection.effectiveType || 'Unknown';
        }

        // Get geolocation and ISP info
        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geoData = await geoResponse.json();
            
            if (geoData.city && geoData.country_name) {
                geolocation = `${geoData.city}, ${geoData.country_name}`;
            }
            
            if (geoData.org) {
                isp = geoData.org;
            }
        } catch (error) {
            // Fallback to basic geolocation
            try {
                const fallbackResponse = await fetch('https://api.ipify.org?format=json');
                // Keep defaults if fallback fails
            } catch (fallbackError) {
                // Keep defaults
            }
        }

        return {
            connectionType: connectionType,
            geolocation: geolocation,
            isp: isp,
            dnsServers: 'System Default'
        };
    }

    displayInformation(data) {
        // Website information
        this.setElementValue('currentUrl', data.website.url);
        this.setElementValue('domain', data.website.domain);
        this.setElementValue('protocol', data.website.protocol?.toUpperCase());
        this.setElementValue('port', data.website.port);

        // Server information
        this.setElementValue('serverIp', data.server.ip);
        this.setElementValue('serverName', data.server.name);
        this.setElementValue('serverSoftware', data.server.software);
        this.setElementValue('responseTime', data.server.responseTime);

        // User information
        this.setElementValue('userIp', data.user.ip);
        this.setElementValue('computerName', data.user.computerName);
        this.setElementValue('browser', data.user.browser);
        this.setElementValue('operatingSystem', data.user.os);

        // Security information
        this.setElementValue('sslStatus', data.security.sslStatus, this.getSecurityClass(data.security.sslStatus));
        this.setElementValue('certIssuer', data.security.certIssuer);
        this.setElementValue('certExpiry', data.security.certExpiry);
        this.setElementValue('securityHeaders', data.security.securityHeaders);

        // Network information
        this.setElementValue('connectionType', data.network.connectionType);
        this.setElementValue('geolocation', data.network.geolocation);
        this.setElementValue('isp', data.network.isp);
        this.setElementValue('dnsServers', data.network.dnsServers);
    }

    setElementValue(elementId, value, className = '') {
        const element = this.elements[elementId];
        if (element) {
            element.textContent = value || 'Unknown';
            element.className = `value ${className}`.trim();
        }
    }

    getSecurityClass(sslStatus) {
        if (sslStatus && sslStatus.includes('Secure')) return 'secure';
        if (sslStatus && sslStatus.includes('Insecure')) return 'insecure';
        return '';
    }

    showLoading() {
        this.elements.loading.style.display = 'flex';
        this.elements.content.style.display = 'none';
        this.elements.error.style.display = 'none';
    }

    showContent() {
        this.elements.loading.style.display = 'none';
        this.elements.content.style.display = 'block';
        this.elements.error.style.display = 'none';
    }

    showError() {
        this.elements.loading.style.display = 'none';
        this.elements.content.style.display = 'none';
        this.elements.error.style.display = 'block';
    }
}

// Initialize the extension when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NetworkInspector();
});