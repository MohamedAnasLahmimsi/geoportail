import Role from '../models/roles.models.js';
import { ValidateRole } from '../validation/Roles.validation.js';
export const AddRole = async (req, res) => {
    const { errors, isValid } = ValidateRole(req.body);
    try {
      if (!isValid) {
        res.status(404).json(errors);
      } else {
        const existingRole = await Role.findOne({ name: req.body.name });
        if (existingRole) {
          errors.name = "Role already exists";
          res.status(404).json(errors);
        } else {
          await Role.create(req.body);
          res.status(201).json({ message: 'Role added successfully' });
        }
      }
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

export const FindAllRole = async (req, res) => {
    try {
        const data = await Role.find()
        res.status(201).json(data)
    } catch (error) {
        console.log(error.message)
    }
};

export const FindSinglRole = async (req, res) => {
    try {
        const data = await Role.findOne({_id: req.params.id})
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const UpdateRole = async (req, res) => {
    try {
        const data = await Role.findOneAndUpdate(
            {_id: req.params.id},
            req.body,
            {new:true}
            )
        res.status(201).json(data)
        
    } catch (error) {
        console.log(error.message)
    }
};

export const DeleteRole = async (req, res) => {
    const {errors, isValid} = ValidateRole(req.body);
    try {
        if(!isValid){
            res.status(404).json(errors);
        }else {
        const data = await Role.findOneAndDelete({_id: req.params.id})
        res.status(201).json({message: "Role deleted"})
        }
    } catch (error) {
        console.log(error.message)
    }
};
