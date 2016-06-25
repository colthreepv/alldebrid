import navbar from './navbar';
import footer from './footer';
import torrents from './torrents';

const states = [
  {
    name: 'home.torrents',
    url: '/',
    views: {
      navbar,
      footer,
      '': torrents
    }
  },
  {
    name: 'home',
    abstract: true,
    template: require('./index.html')
  }
];

export default states;
