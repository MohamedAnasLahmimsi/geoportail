import Users from '../models/users.models.js';
import Role from '../models/roles.models.js';
import { check, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ValidateUser } from '../validation/Users.validation.js';
export const AddUser = async (req, res) => {
    const {errors, isValid} = ValidateUser(req.body);
    try {
        if(!isValid){
            res.status(404).json(errors);
        }else {
            await Users.findOne({email: req.body.email}).then(async (exist)=> {
                if ((exist)){
                    errors.email = "User Exist";
                    res.status(404).json(errors);
                }else{
                     await Users.create(req.body)
                    res.status(201).json({message: 'User added with success'});
                }
            });
        }
       
    } catch (error) {
        console.log(error.message)
    }
};

export const FindAllUser = async (req, res) => {
    let listUsers=[];
    let userCreator={};
    let userRoleslist=[];
    let data=[];
    try {
         data = await Users.find()
        for(let i=0;i<data.length;i++){
            userRoleslist=[];
           if(data[i].createdBy){
                try {
                    userCreator = await Users.findOne({_id: data[i].createdBy})
                    data[i].createdBy=userCreator;
                
                } catch (error) {
                console.log(error.message)
                }
            }
          
            if(data[i].roles){
               
                for(let j=0;j<data[i].roles.length;j++){  
            try{
               let userRole = await Role.findOne({_id: data[i].roles[j]})
               console.log(userRole);
               userRoleslist.push(userRole);
               
            } catch (error) {
                console.log(error.message)
                }
                
            }
            data[i].roles= userRoleslist;
        }

        }
       
        listUsers = res.status(201).json(data);

    } catch (error) {
        console.log(error.message)
    }
};

export const FindSinglUser = async (req, res) => {
    try {
        const data = await Users.findOne({_id: req.params.id})
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const UpdateUser = async (req, res) => {
    const {errors, isValid} = ValidateUser(req.body);

    try {
        if(!isValid){
            res.status(404).json(errors);
        }else {
        const data = await Users.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new:true}
            )
        res.status(201).json(data)
        }
    } catch (error) {
        console.log(error.message)
    }
};

export const DeleteUser = async (req, res) => {
    try {
       
        const data = await Users.findOneAndDelete({_id: req.params.id})
        res.status(201).json({message: "User deleted"})
        
    } catch (error) {
        console.log(error.message)
    }
};

export const Login = async (req, res) => {
    const { errors, isValid } = ValidateUser(req.body);
  
    check("email", "Please enter a valid email").isEmail();
    check("password", "Please enter a valid password").isLength({
      min: 6,
    });
  
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array(),
      });
    }
  
    const { email, password } = req.body;
  
    try {
      let user = await Users.findOne({ email });
  
      if (!user) {
        return res.status(400).json({
          msg: "User Not Registered",
        });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({
          msg: "Incorrect Password",
        });
      }
  
      const payload = {
        user: {
          id: user.id,
        },
      };
  
      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 3600,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Server Error");
    }
  };

  export const Register = async (req, res) => {
    const { errors, isValid } = ValidateUser(req.body);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res.status(400).json({
        errors: validationErrors.array(),
      });
    }

    const { name, email, password, roles, question, answer } = req.body;

    try {
      let user = await Users.findOne({ email });

      if (user) {
        return res.status(400).json({
          msg: "User Already Exists",
        });
      }

      user = new Users({
        name,
        email,
        password,
        roles,
        question,
        answer,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        "randomString",
        {
          expiresIn: 10000,
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({
            token,
          });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send("Error in Saving");
    }
};

export const Pagination = async (req, res) => {
    let listUsers = [];
    let userCreator = {};
    let userRoleslist = [];
    let data = [];
    let page = req.query.page ? parseInt(req.query.page) : 1; // Default to page 1 if page parameter is not provided
    let limit = req.query.limit ? parseInt(req.query.limit) : 10; // Default to 10 items per page if limit parameter is not provided
  
    try {
      const totalCount = await Users.countDocuments(); // Get the total count of users
      const totalPages = Math.ceil(totalCount / limit); // Calculate the total number of pages
  
      data = await Users.find()
        .skip((page - 1) * limit)
        .limit(limit);
  
      for (let i = 0; i < data.length; i++) {
        userRoleslist = [];
        if (data[i].createdBy) {
          try {
            userCreator = await Users.findOne({ _id: data[i].createdBy });
            data[i].createdBy = userCreator;
          } catch (error) {
            console.log(error.message);
          }
        }
  
        if (data[i].roles) {
          for (let j = 0; j < data[i].roles.length; j++) {
            try {
              let userRole = await Role.findOne({ _id: data[i].roles[j] });
              console.log(userRole);
              userRoleslist.push(userRole);
            } catch (error) {
              console.log(error.message);
            }
          }
          data[i].roles = userRoleslist;
        }
      }
  
      listUsers = res.status(201).json({
        data,
        page,
        totalPages,
        totalCount,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  