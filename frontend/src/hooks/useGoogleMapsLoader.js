import { useJsApiLoader } from '@react-google-maps/api';

const useGoogleMapsLoader = () => {
  return useJsApiLoader({
    googleMapsApiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg', // Replace with your actual API key
    libraries: ['places'],
  });
};

export default useGoogleMapsLoader;
