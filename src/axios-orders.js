import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://band-manager-3dc9e.firebaseio.com/'

})

export default instance;
