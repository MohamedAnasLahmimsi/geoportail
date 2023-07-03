import Layers from '../models/layers.models.js';
import Users from '../models/users.models.js';
import Role from '../models/roles.models.js';


import { ValidateLayer } from '../validation/Layers.validation.js';
export const AddLayer = async (req, res) => {
    const { errors, isValid } = ValidateLayer(req.body);
    try {
      if (!isValid) {
        res.status(404).json(errors);
      } else {
        await Layers.findOne({ url: req.body.url }).then(async (exist) => {
          if (exist) {
            errors.url = "Layer Exist";
            res.status(404).json(errors);
          } else {
            await Layers.create({ ...req.body, image: req.body.image });
            res.status(201).json({ message: "Layer added with success" });
          }
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  
  export const FindAllLayer = async (req, res) => {
    let listLayers=[];
    let userCreator={};
    let allowedRoleslist=[];
    let data=[];
    try {
         data = await Layers.find()
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
       
        listLayers = res.status(201).json(data);

    } catch (error) {
        console.log(error.message)
    }
};

export const FindSinglLayer = async (req, res) => {
    try {
        const data = await Layers.findOne({_id: req.params.id})
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const UpdateLayer = async (req, res) => {
    try {
        const data = await Layers.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new:true}
            )
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const DeleteLayer = async (req, res) => {
    try {
      const data = await Layers.findOneAndDelete({ _id: req.params.id });
      res.status(201).json({ message: "Layer deleted" });
    } catch (error) {
      console.log(error.message);
    }
  };
  

export const PaginationL = async (req, res) => {
    let listLayers = [];
    let userCreator = {};
    let LayerRoleslist = [];
    let data = [];
    let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if page parameter is not provided
    let limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default to 10 items per page if limit parameter is not provided
  
    try {
      const totalCount = await Layers.countDocuments(); // Get the total count of users
      const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages
  
      data = await Layers.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      for (let i = 0; i < data.length; i++) {
        LayerRoleslist = [];
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
              LayerRoleslist.push(userRole);
            } catch (error) {
              console.log(error.message);
            }
          }
          data[i].allowedTo = LayerRoleslist;
        }
      }
  
      listLayers = res.status(201).json({
        data,
        page,
        totalPages,
        totalCount,
      });
    } catch (error) {
      console.log(error.message);
    }
  };