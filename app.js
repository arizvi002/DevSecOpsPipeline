const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello, World! This is a Node.js app running in a container! Checking if webhook is working again');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
