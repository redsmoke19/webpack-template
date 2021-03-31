import Post from './Post';
import './babel';
import '../style/style.css';
import '../style/less.less';
import '../style/scss.scss';
import json from '../files/json';
import Logo from '../images/logo.png';

const post = new Post('Webpuck Post title', Logo);

console.log('Post to String!', post.toString());

console.log('JSON:', json);
const getElem = 32;