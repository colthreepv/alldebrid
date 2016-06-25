import navbar from './navbar';
import footer from './footer';

const states = [
  {
    name: 'home.torrents',
    url: '/',
    views: { navbar, footer }
  },
  {
    name: 'home',
    abstract: true,
    template: require('./index.html')
  }
];

export default states;
