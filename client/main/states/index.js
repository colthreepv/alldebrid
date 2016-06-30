import navbar from './navbar';
import footer from './footer';
import torrents from './torrents';
import unrestrict from './unrestrict';

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
    name: 'home.unrestrict',
    url: '/links',
    views: {
      navbar,
      footer,
      '': unrestrict
    },
    params: {
      links: undefined
    }
  },
  {
    name: 'home',
    abstract: true,
    template: require('./index.html')
  }
];

export default states;
