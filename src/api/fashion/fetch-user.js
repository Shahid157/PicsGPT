import { supabase } from "../../../supabase"
import { generateFromEmail } from "unique-username-generator"
export default async function handler(req, res) {
    try {
        req.body = JSON.parse(req.body)
        const user = req.body.user
        const data = await fetchUser(user.id)
        if (!data.length) {
            const createdData = await createUser(user)
            res.send(createdData)
        } else {
            res.send(data)
        }
    } catch (error) {
        res.status(500).json({ error: true })
    }
}
const fetchUser = async (user_id) => {
    try {
        const { data: user_details } = await supabase.from('Users').select('*').eq("user_id", user_id)
        if (user_details.length) {
            const { data: likes } = await supabase.from('result_likes').select('*').eq("user_id", user_id)
            const { data: saved } = await supabase.from('saved_collection').select('*').eq('user_id', user_id).order('id', { ascending: false })
            return [{ ...user_details[0], likes, saved }]
        }
        else return []
    } catch (error) {
        return
    }
}
const createUser = async (user) => {
    try {
        const new_user = {
            user_id: user.id,
            full_name: user.email.split('@')[0],
            user_name: '@' + generateFromEmail(user.email, 4),
            avtar_url: 'https://cdn.mediamagic.dev/media/fbf1d05d-75c1-11ee-95a6-d6ec333d3c78.png',
            email : user.email,
            default: true
        }
        const isAlreadyExists = await alreadyExists(new_user.user_name,)
        if (!isAlreadyExists) {
            const { data: alreadyExists } = await supabase.from('Users').select('*').eq("email", user.email)
            if(!alreadyExists.length){
                await supabase.from('Users').insert(new_user).select('*')
            }
            return await fetchUser(user.id)
        } else {
            await createUser(user)
        }
    } catch (error) {
        console.error("Error creating user", error)
    }
}
export const alreadyExists = async (user_name, user_id) => {
    try {
        const { data: alreadyExists } = await supabase.from('Users').select('*').eq("user_name", user_name)

        if (alreadyExists.length > 0) {
            if (alreadyExists[0].user_id === user_id) {
                return false
            }
            else return true
        }
        return false
    } catch (error) {
        console.error("Error checking if user already exists:", error)
    }
}
