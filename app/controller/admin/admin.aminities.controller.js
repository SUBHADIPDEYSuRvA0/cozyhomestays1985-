const aminities = require("../../models/aminities");



class aminitiescontroller{
    create=async(req,res)=>{
      try{

        const {title,icon}=req.body;
        const aminity=new aminities({title,icon});
        await aminity.save();
        res.status(201).redirect('/admin/aminities');

      }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
      }
    }
}

module.exports=new aminitiescontroller();