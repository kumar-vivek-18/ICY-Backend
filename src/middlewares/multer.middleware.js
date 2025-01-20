import express from 'express';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
         cb(null,'../uploads/');
    },
    filename:function(req,file,cb){
        const uniqueVal= Date.now()+'-'+Math.round(Math.random()*1e9);
        cb(null,`${file.originalname}-${uniqueVal}${path.extname(file.originalname)}`);
    }
});

export const uploads = multer({
    storage:storage,
    limits:{fileSize:1024*1024*50}
}).fields([
    {name:'images',maxCount:2},
    {name:"videos",maxCount:2}
]);