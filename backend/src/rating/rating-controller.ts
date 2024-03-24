import { Request, Response } from "express";

// Dummy route
export const dummyTest = async (req: Request, res: Response) => {
  return res.send("Hello, World");
};
