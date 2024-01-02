import bcrypt from 'bcrypt';
export const demoget = () => async(req, res) => {

  try {
    // do what you used to do in the previous way.
    const pass = await bcrypt.hash('Admin#1234', 8);
    res.status(200).send(pass);
  }
  catch (err) {
    console.log(err);
    res.status(500).send('Don"t connect with me');
  }
};