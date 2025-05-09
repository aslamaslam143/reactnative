import express from 'express';
import User from '../models/User.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { json } from 'stream/consumers';

const router = express.Router();

// Create 'uploads' directory if it doesn't exist
const uploadPath = path.resolve('uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}

// ✅ Store images to disk, not memory
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const uploads = multer({ storage: storage });

// ✅ GET user by phone
router.get('/:phone', async(req, res) => {
    const { phone } = req.params;
    try {
        const user = await User.findOne({ phone }).select('-__v');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ✅ POST create user with profile picture
router.post('/', uploads.single("profilePic"), async(req, res) => {
    const { name, number } = req.body;

    try {
        const existingUser = await User.findOne({ phone: number });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const profilePic = req.file ? `/uploads/${req.file.filename}` : null;

        const user = new User({ name, phone: number, profilePic });
        await user.save();

        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.put('/:id', uploads.single("profilePic"), async(req, res) => {
    const { name } = req.body;

    try {
        let user = await User.findById(req.params.id)
        if (!user) {
            res.status(404).json({ message: "user not found " })
            if (req.file) {
                if (user.profilePic) {
                    const oldImage = path.join(process.cwd(), user.profilePic);
                    if (fs.existsSync(oldImage)) {
                        fs.unlinkSync(oldImage);
                    }
                }


            }

        }
        user.profilePic = `/uploads/${req.file.filename}`
            // update name you provide
        if (name) {
            user.name = name
        }
        await user.save()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message });

    }
})

export default router;