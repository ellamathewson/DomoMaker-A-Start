/* eslint-disable no-console */
const models = require('../models');
const Domo = models.Domo;

const aboutPage = (req, res) => {
  res.redirect('/about');
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

module.exports.aboutPage = aboutPage;
