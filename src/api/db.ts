import mongoose from 'mongoose';
mongoose.connect('mongodb://127.0.0.1:27017/estr2106-g2').catch((err) => {
  console.error(err);
});

const db = mongoose.connection;

db.on('error', () => {
  console.error('An error occurred');
});

export { db };
