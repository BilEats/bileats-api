const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Bileats API!');
});

app.get('/menu', (req, res) => {
  res.json({ message: 'Menu endpoint is working!' });
});


app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});


