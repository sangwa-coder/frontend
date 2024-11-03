// loadGoogleMapsScript.js
const loadGoogleMapsScript = () => {
    const apiKey = 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg';
  
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="https://maps.googleapis.com/maps/api/js?key=${apiKey}"]`)) {
        resolve();
        return;
      }
  
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
  
      script.onload = () => {
        console.log('Google Maps API script loaded successfully.');
        resolve();
      };
  
      script.onerror = () => {
        console.error('Error loading Google Maps API script.');
        reject(new Error('Error loading Google Maps API script.'));
      };
  
      document.head.appendChild(script);
    });
  };
  
  export default loadGoogleMapsScript;
  