import express from "express";
import jwt from "jsonwebtoken";
import { prismaClient } from "@repo/prisma/client";
import bcrypt from "bcrypt";
import { JWT_PASSWORD } from "./config";

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    bcrypt.hash(password, 10, async (err, hashedPw) => {
        try {
            await prismaClient.user.create({
                data: {
                    username,
                    password: hashedPw,
                }
            })
            res.json({
                message: "You have signed up"
            })
        } catch(e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }

    });
});

app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await prismaClient.user.findFirst({
        where: {
            username: username
        }
    })

    if (!user) {
        res.status(403).json({
            message: "Incorrect creds"
        })
        return
    }

    if (await bcrypt.compare(user?.password, password)) {
        const token = jwt.sign({
            userId: user.id,
        }, JWT_PASSWORD);
        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Cant log in"
        })
    }
});

app.post("/sheet", (req, res) => {

});

app.put("/sheet", (req, res) => {

});

app.get("/sheet", (req, res) => {

});

app.get("/sheets", (req, res) => {

});


