const ProfilePicture = require('../models/ProfilePicture.js')
const multer  = require('multer');
const path = require('path');
const dotenv = require('dotenv')
const {decode} = require('base64-arraybuffer')
const {createClient} = require('@supabase/supabase-js');
dotenv.config()
const storage = multer.memoryStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname) //
    }
})
const upload = multer({ storage : storage })
const supabase = createClient(process.env.SUPABASE_PROJECT_URL, process.env.SUPABASE_ANON_KEY);

const uploadProfilePicture = async(req, res) => {
    const {userId} = req.session;
    const file = req.file;
    const allowedFileType = ['.png',  '.jpg', '.jpeg', '.webp' ]
    const isAllowed = (allowedFileType.findIndex(fileType => {
      return fileType == path.extname(file.originalname)
    }));
    if ( isAllowed == -1 ) {
        req.flash('error', 'File must be an image')
        return res.redirect('/settings')
    }

    try {
          const userProfile = await ProfilePicture.findOne({
              where : {
                  user_id : userId
              }
          }) 
      
          if(userProfile.dataValues.image != 'default.png'){
              await supabase.storage.from('profile_picture').remove([userProfile.dataValues.image]);
          }
      
          const fileBase64 = decode(file.buffer.toString('base64'));
      
          const {data, error} = await supabase.storage.from('profile_picture').upload(`${userId}-${file.originalname}`, fileBase64, {
              contentType : file.mimetype
          })
          
          // console.log(data, error);

          await ProfilePicture.update({
              image : data.path     
          }, {
              where : {
                  user_id : userId    
              }
          })
          res.redirect('/home')
    } catch (error) {
        console.log(error);
        req.flash('Error', 'Internal Server Error')
        res.redirect('/settings')     
    }
}



module.exports = {
    uploadProfilePicture,
    profileUploader : upload
}