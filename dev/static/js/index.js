import Post from './Post'
import '../style/style.css'
import json from '../files/json'
import Logo from '../images/logo.png'

const post = new Post('Webpuck Post title', Logo);

console.log('Post to String!', post.toString());

console.log('JSON:', json);