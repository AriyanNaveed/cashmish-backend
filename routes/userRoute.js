import { createUser, getUserByEmail, getUserById, updateUserPassword, deleteUser} from "../controllers/userController.js";
import express from "express";
const router = express.Router();
router.post('/create', createUser);
router.get('/email/:email', getUserByEmail);
router.get('/id/:userId', getUserById);
router.put('/update-password/:userId', updateUserPassword);
router.delete('/delete/:userId', deleteUser);
export default router;    