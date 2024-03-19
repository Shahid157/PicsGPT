import { alreadyExists } from "./fetch-user";
export default async function handler(req, res) {
  try {
    req.body = JSON.parse(req.body)
    const user_name = req.body.user_name
    const user_id = req.body.user_id

    const isalreadyExists = await alreadyExists(user_name , user_id)
    return res.send(isalreadyExists)
  } catch (error) {
    return res.status(500).json({error})
  }
}