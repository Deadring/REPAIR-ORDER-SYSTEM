/**
 * Network Configuration for Repair Order System
 * 
 * Gunakan untuk mengatur custom API URL untuk akses dari jaringan
 */

/**
 * Set custom API URL untuk network access
 * Gunakan IP address server, bukan localhost
 * 
 * @param {string} ipAddress - IP address server (e.g., "192.168.1.100")
 * @param {number} port - Port server (default: 8000)
 */
export const setNetworkApiUrl = (ipAddress, port = 8000) => {
  const apiUrl = `http://${ipAddress}:${port}/api`;
  localStorage.setItem('customApiUrl', apiUrl);
  console.log('✅ Network API URL set to:', apiUrl);
  // Reload page untuk apply configuration
  window.location.reload();
};

/**
 * Reset ke localhost configuration
 */
export const resetToLocalhost = () => {
  localStorage.removeItem('customApiUrl');
  console.log('✅ Reset to localhost configuration');
  window.location.reload();
};

/**
 * Get current API URL
 */
export const getCurrentApiUrl = () => {
  return localStorage.getItem('customApiUrl') || 'localhost:8000';
};

/**
 * Check if using network access
 */
export const isNetworkAccess = () => {
  return !!localStorage.getItem('customApiUrl');
};
