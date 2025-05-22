const category=require('../../models/category');


class categorycontroller {
   createcategory=async(req,res)=>{
    try{


        const {title,icon}=req.body;
        const categoris=new category({title,icon});
        await categoris.save();

       res.status(201).redirect('/admin/category');

    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
   }
   updatecategory=async(req,res)=>{
    try{
        const {id}=req.params;
        const {title,icon}=req.body;
        await category.findByIdAndUpdate(id,{title,icon});
        res.redirect('/admin/category');
    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
   }
   deletecategory=async(req,res)=>{
    try{
        const {id}=req.params;
        await category.findByIdAndDelete(id);
        res.redirect('/admin/category');
    }catch(err){
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
   }
}

module.exports=new categorycontroller();