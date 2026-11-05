import express from 'express';

const hostname = '127.0.0.1';
const port = 3000;

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/api/v1/cats', (req, res) => {
  const cat = {
    cat_id: 1,
    name: 'Misu',
    birthdate: '2022-05-14',
    weight: 4.5,
    owner: 'Matti',
    image: 'https://loremflickr.com/320/240/cat',
  };

  res.json(cat);
});

app.use('/public', express.static('public'));

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
