const axios = require('axios');

let items = [
    {
        title: '',
        description: '',
        price: '',
        image: ''
    }
];

const initStoreItems = async() => {
    for (let i = 0; i < 30; i++) {
      await axios.get(`https://fakestoreapi.com/products/${i}`).then((res) => {
        console.log(res.data);
      });
    }
    
};

initStoreItems(items);