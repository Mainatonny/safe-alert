const express = require('express');
const userRoutes = require('./routes/userRoutes'); // adjust the path accordingly
const app = express();

app.use(express.json());
app.use('/api/users', userRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});
