import navbar from './navbar';

const states = [
  {
    name: 'home.torrents',
    url: '/',
    views: { navbar }
  },
  {
    name: 'home',
    abstract: true,
    template: require('./index.html')
  }
];

export default states;
