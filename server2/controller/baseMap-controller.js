import BaseMaps from '../models/BaseMaps.models.js';
import Users from '../models/users.models.js';
import Role from '../models/roles.models.js';


import { ValidateBaseMap } from '../validation/BaseMaps.validation.js';
export const AddBaseMap = async (req, res) => {
    const { errors, isValid } = ValidateBaseMap(req.body);
    try {
      if (!isValid) {
        res.status(404).json(errors);
      } else {
        await BaseMaps.findOne({ url: req.body.url }).then(async (exist) => {
          if (exist) {
            errors.url = "BaseMap Exist";
            res.status(404).json(errors);
          } else {
            await BaseMaps.create({ ...req.body, image: req.body.image });
            res.status(201).json({ message: "BaseMap added with success" });
          }
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export const FindAllBaseMap = async (req, res) => {
    let listBaseMaps=[];
    let userCreator={};
    let allowedRoleslist=[];
    let data=[];
    try {
         data = await BaseMaps.find()
        for(let i=0;i<data.length;i++){
            allowedRoleslist=[];
           if(data[i].createdBy){
                try {
                    userCreator = await Users.findOne({_id: data[i].createdBy})
                    data[i].createdBy=userCreator;
                
                } catch (error) {
                console.log(error.message)
                }
            }
          
            if(data[i].allowedTo){
               
                for(let j=0;j<data[i].allowedTo.length;j++){  
            try{
               let userRole = await Role.findOne({_id: data[i].allowedTo[j]})
               console.log(userRole);
               allowedRoleslist.push(userRole);
               
            } catch (error) {
                console.log(error.message)
                }
                
            }
            data[i].allowedTo= allowedRoleslist;
        }

        }
       
        listBaseMaps = res.status(201).json(data);

    } catch (error) {
        console.log(error.message)
    }
};

export const FindSinglBaseMap = async (req, res) => {
    try {
        const data = await BaseMaps.findOne({_id: req.params.id})
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const UpdateBaseMap = async (req, res) => {
    try {
        const data = await BaseMaps.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new:true}
            )
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const DeleteBaseMap = async (req, res) => {
    try {
      const data = await BaseMaps.findOneAndDelete({ _id: req.params.id });
      res.status(201).json({ message: "BaseMap deleted" });
    } catch (error) {
      console.log(error.message);
    }
  };
  

export const PaginationL = async (req, res) => {
    let listBaseMaps = [];
    let userCreator = {};
    let BaseMapRoleslist = [];
    let data = [];
    let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if page parameter is not provided
    let limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default to 10 items per page if limit parameter is not provided
  
    try {
      const totalCount = await BaseMaps.countDocuments(); // Get the total count of users
      const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages
  
      data = await BaseMaps.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      for (let i = 0; i < data.length; i++) {
        BaseMapRoleslist = [];
        if (data[i].createdBy) {
          try {
            userCreator = await Users.findOne({ _id: data[i].createdBy });
            data[i].createdBy = userCreator;
          } catch (error) {
            console.log(error.message);
          }
        }
  
        if (data[i].allowedTo) {
          for (let j = 0; j < data[i].allowedTo.length; j++) {
            try {
              let userRole = await Role.findOne({ _id: data[i].allowedTo[j] });
              console.log(userRole);
              BaseMapRoleslist.push(userRole);
            } catch (error) {
              console.log(error.message);
            }
          }
          data[i].allowedTo = BaseMapRoleslist;
        }
      }
  
      listBaseMaps = res.status(201).json({
        data,
        page,
        totalPages,
        totalCount,
      });
    } catch (error) {
      console.log(error.message);
    }
  };