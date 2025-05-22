const service = require("../../models/service.host");



class serviceController {
   updateService = async (req, res) => {
  try {
    const { id } = req.params; // Or from req.body
    const { servicerate } = req.body;

    await service.findByIdAndUpdate(id, { servicerate });
    
    res.redirect("/admin/servicehost"); // or send a success message
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating service.");
  }
};
}

module.exports = new serviceController();