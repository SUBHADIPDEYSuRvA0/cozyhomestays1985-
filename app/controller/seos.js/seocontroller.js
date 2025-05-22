const Seo = require('../../models/seos/model2');

// Render SEO page with existing keywords (for main page)
exports.getSeo = async (req, res) => {
  try {
    const user = req.user?.id;
    let seo = await Seo.findOne();
    if (!seo) seo = { seokeywords: [] };
    res.render('Seo/manege', { seo, user });
  } catch (error) {
    res.status(500).send('Error loading SEO keywords page');
  }
};

// Add a single new keyword (from main form)
exports.addSeoKeyword = async (req, res) => {
  try {
     const user = req.user?.id;
    let { seokeywords } = req.body;
    // Only one input expected (string)
    if (!seokeywords || !seokeywords.trim()) {
      return res.redirect('/seos/get');
    }
    const newKeyword = seokeywords.trim();
    let seo = await Seo.findOne();
    if (seo) {
      // prevent duplicates
      if (!seo.seokeywords.includes(newKeyword)) {
        seo.seokeywords.push(newKeyword);
        await seo.save();
      }
    } else {
      seo = new Seo({ seokeywords: [newKeyword] });
      await seo.save();
    }
    res.redirect('/seos/get');
  } catch (error) {
    res.status(500).send('Error adding SEO keyword');
  }
};

// Edit all keywords (from modal)
exports.editSeoKeywords = async (req, res) => {
  try {
     const user = req.user?.id;
    let { seokeywords } = req.body;
    if (!seokeywords) seokeywords = [];
    if (typeof seokeywords === 'string') {
      seokeywords = [seokeywords];
    }
    seokeywords = Array.from(new Set(seokeywords.map(k => k.trim()).filter(Boolean)));
    let seo = await Seo.findOne();
    if (seo) {
      seo.seokeywords = seokeywords;
      await seo.save();
    } else {
      seo = new Seo({ seokeywords });
      await seo.save();
    }
    res.redirect('/seos/get');
  } catch (error) {
    res.status(500).send('Error editing SEO keywords');
  }
};