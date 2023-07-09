const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');

const User = require('../models/users');
const ForgotPassword = require('../models/forgotpassword');

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const id = uuid.v4();
      const forgotPassword = await ForgotPassword.create({ id, active: true });
      user.forgotpassword.push(forgotPassword);
      await user.save();

      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: email,
        from: 'yj.rocks.2411@gmail.com',
        subject: 'Reset Password',
        text: 'Please reset your password using the link below.',
        html: `<a href="http://localhost:3000/password/resetpassword/${id}">Reset Password</a>`,
      };

      const response = await sgMail.send(msg);
      return res.status(response[0].statusCode).json({ message: 'Link to reset password sent to your email', success: true });
    } else {
      throw new Error('User does not exist');
    }
  } catch (err) {
    console.error(err);
    return res.json({ message: err, success: false });
  }
};

const resetpassword = async (req, res) => {
  const id = req.params.id;
  try {
    const forgotPassword = await ForgotPassword.findOne({ id });
    if (forgotPassword) {
      forgotPassword.active = false;
      await forgotPassword.save();

      return res.status(200).send(`
        <html>
          <script>
            function formsubmitted(e) {
              e.preventDefault();
              console.log('called');
            }
          </script>
          <form action="/password/updatepassword/${id}" method="get">
            <label for="newpassword">Enter New Password</label>
            <input name="newpassword" type="password" required></input>
            <button>Reset Password</button>
          </form>
        </html>
      `);
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err, success: false });
  }
};

const updatepassword = async (req, res) => {
  try {
    const { newpassword } = req.query;
    const { resetpasswordid } = req.params;

    const forgotPassword = await ForgotPassword.findOne({ id: resetpasswordid });
    if (forgotPassword) {
      const user = await User.findById(forgotPassword.user);

      if (user) {
        const saltRounds = 10;
        const hash = await bcrypt.hash(newpassword, saltRounds);

        user.password = hash;
        await user.save();

        return res.status(201).json({ message: 'Successfully updated the new password' });
      } else {
        return res.status(404).json({ error: 'No user exists', success: false });
      }
    } else {
      return res.status(404).json({ error: 'Invalid reset password request', success: false });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error, success: false });
  }
};

module.exports = {
  forgotpassword,
  updatepassword,
  resetpassword,
};
