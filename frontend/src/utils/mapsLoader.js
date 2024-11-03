import { Loader } from '@googlemaps/js-api-loader';

const loaderOptions = {
  version: 'weekly',
  apiKey: 'AIzaSyAwSoEbsNk6EWrGdcaLPUxyp2FPUJ5eBQg',
  libraries: ['places'],
  language: 'en',
  region: 'US',
};

export const googleMapsLoader = new Loader(loaderOptions);
