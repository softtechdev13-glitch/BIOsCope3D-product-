// Configure your backend API base URL here.

// ⚠️ CHANGE THIS IP TO YOUR COMPUTER'S ACTUAL IPv4 ADDRESS
// 1. Open Command Prompt on your computer
// 2. Type: ipconfig
// 3. Find "IPv4 Address" (e.g., 192.168.1.x or 192.168.0.x)
// 4. Replace 192.168.1.100 below with that address

export const API_CONFIG = {
  // Live Vercel Production Backend URL
  BASE_URL: 'https://bi-os-cope3-d-product.vercel.app/api', 
  
  // Local fallback URLs for offline testing
  // BASE_URL: 'http://192.168.1.41:8080/api', 
  // BASE_URL: 'http://10.0.2.2:8080/api', 
};
