const DocumentVerification = require('../../models/documentation');
const path = require('path');
const user = require('../../models/user');

exports.createOrUpdateVerification = async (req, res) => {
  try {
    const userId = req.user.id;
    const { ownerType, accountNumber, ifsc, hasGst, gstNumber } = req.body;
    const files = req.files;

    let docData = {
      userId,
      ownerType,
      accountNumber,
      ifsc: ifsc ? ifsc.toUpperCase() : '',
      hasGst: hasGst === 'true' || hasGst === 'on' || hasGst === true,
      gstNumber: gstNumber ? gstNumber.toUpperCase() : ''
    };

    // GST Document
    if (files && files.gstDoc && files.gstDoc[0]) {
      docData.gstDoc = '/uploads/' + files.gstDoc[0].filename;
    }

    if (ownerType === 'single') {
      docData.singleOwner = {
        idType: req.body['singleOwner.idType'],
        idFront: files.idFront ? '/uploads/' + files.idFront[0].filename : '',
        idBack: files.idBack ? '/uploads/' + files.idBack[0].filename : ''
      };
      docData.multipleOwners = [];
    } else if (ownerType === 'multiple') {
      docData.singleOwner = {};
      docData.multipleOwners = [];

      // Collect all multiple owners
      // Support both array and single owner object for form posts
      let ownerIndices = [];
      Object.keys(req.body).forEach(key => {
        const match = key.match(/^multipleOwners\[(\d+)\]\.(.+)$/);
        if (match) {
          ownerIndices.push(Number(match[1]));
        }
      });
      ownerIndices = [...new Set(ownerIndices)].sort((a, b) => a - b);

      ownerIndices.forEach(idx => {
        const name = req.body[`multipleOwners[${idx}].name`] || '';
        const idType = req.body[`multipleOwners[${idx}].idType`] || '';
        const idFrontFile = files[`multipleOwners[${idx}].idFront`]?.[0];
        const idBackFile = files[`multipleOwners[${idx}].idBack`]?.[0];

        docData.multipleOwners.push({
          name,
          idType,
          idFront: idFrontFile ? '/uploads/' + idFrontFile.filename : '',
          idBack: idBackFile ? '/uploads/' + idBackFile.filename : ''
        });
      });
    }

    // Upsert: update if exists, else create
    const verification = await DocumentVerification.findOneAndUpdate(
      { userId },
      { $set: docData },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const updateuser = await user.findOneAndUpdate(
      { _id: userId },
      { $set: { documentverification: true } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

     return res.json({
      success: true,
      message: "Verification details saved successfully.",
      verification
    });
  } catch (err) {
   
   res.redirect('/host/home');
  }
};