const router = require('express').Router();
const { User } = require('../../models');

// URL: /api/user
router.post('/', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    
      req.session.save(() => {
        req.session.user_id = newUser.id;
        req.session.logged_in = true;
        req.session.username = newUser.username;

      res.json(newUser);
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


// URL: /api/user/login
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        username: req.body.username,
      },
    });

    if (!user) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    const validPassword = user.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'No user account found!' });
      return;
    }

    req.session.save(() => {
      req.session.id = user.id;
      req.session.logged_in = true;
      // TODO: SET USERID userId IN REQUEST SESSION TO ID RETURNED FROM DATABASE

      // TODO: SET USERNAME username IN REQUEST SESSION TO USERNAME RETURNED FROM DATABASE

      // TODO: SET LOGGEDIN loggedIn TO TRUE IN REQUEST SESSION

      res.json({ user, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json({ message: 'No user account found!' });
  }
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
