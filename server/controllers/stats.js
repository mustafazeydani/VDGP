import {db} from "../db.js"
import jwt from "jsonwebtoken"

export const addStats = (req, res) => {
    const q = "INSERT INTO user_stats VALUES(?)"

    const values = [
        req.body.uuid,
        0,
        0,
        0
    ]

    db.query(q, [values], (err, data) => {
        if(err) return res.status(500).json(err)
        return res.json("Stats has been added!")
    })
}

export const getStats = (req, res) => {
    const token = req.cookies.access_token
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")
        const q = "SELECT * FROM user_stats WHERE `user_uuid` = ?"

        db.query(q, [userInfo.uuid], (err, data)=>{
            if(err) return res.send(err)
            const {user_uuid, ...other} = data[0]
            return res.status(200).json(other)
        })
    })
}

export const setStats = (req, res) => {
    const token = req.cookies.access_token
    jwt.verify(token, "jwtkey", (err, userInfo)=>{
        if(err) return res.status(403).json("Token is not valid!")
        const {curr, stat, op, count} = req.body
        let q
        if(stat==="comp_task") {
            q = "UPDATE user_stats SET completed_tasks = ? WHERE user_uuid = ?"
        }
        else if (stat==="comp_proj") {
            q = "UPDATE user_stats SET completed_projects = ? WHERE user_uuid = ?"
        }
        else if(stat==="ongo") {
            q = "UPDATE user_stats SET ongoing_tasks = ? WHERE user_uuid = ?"
        }

        db.query(q, [op==="incr"?curr+count:curr-count, userInfo.uuid], (err)=>{
            if(err) return res.status(500).json({ error: "An error occurred while updating stats" });
            return res.json("Stats has been updated")
        })
    })
}