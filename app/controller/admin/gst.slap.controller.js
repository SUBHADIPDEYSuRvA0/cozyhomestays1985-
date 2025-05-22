const gst = require("../../models/gst");



class GSTSlapController {
    create = async (req, res) => {
        try {
            const { title, value,gstrate } = req.body;
            const gstSlap = new gst({ title, value,gstrate});
            await gstSlap.save();
            res.status(201).redirect('/admin/gst');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
    update = async (req, res) => {
        try {
            const { id } = req.params;
            const { title, value,gstrate } = req.body;
            await gst.findByIdAndUpdate(id, { title, value,gstrate });
            res.redirect('/admin/gst');
        } catch (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
    }
}

module.exports = new GSTSlapController();