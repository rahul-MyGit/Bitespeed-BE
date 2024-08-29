import { Request, Response, NextFunction } from 'express';
import { identifyContact } from '../services/contactServices';

export const identify = async (req: Request, res: Response) => {
  try {
    const { email, phoneNumber } = req.body;
    const result = await identifyContact(email, phoneNumber);
    res.json({ contact: result });
  } catch (error) {
    console.log(error);
    
  }
};