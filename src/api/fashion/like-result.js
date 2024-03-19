import { supabase } from "../../../supabase"
export default async function handler(req, res) {
    try {
        req.body = JSON.parse(req.body)
        const result_id = req.body.result_id;
        const user_id = req.body.user_id;
        const mode = req.body.mode;
        console.log("🚀 ~ file: like-result.js:7 ~ handler ~ result_id: ", result_id)
        const { data: alreadyExists } = await supabase.from('result_likes').select('*').eq("user_id", user_id).eq("result_id", result_id)
        if (mode === "update") {
            if (alreadyExists.length) {
                const updateLikeStatus = await handleUpdate(result_id, user_id, alreadyExists[0].status)
                res.send(updateLikeStatus)
            }
            else {
                const likedresult = await handleLike(result_id, user_id)
                res.send(likedresult)
            }
        }
        else {
            res.send(alreadyExists)
        }
    } catch (error) {
        res.send({ success: false, error: error })
    }
}
const handleUpdate = async (result_id, user_id, status) => {
    try {
        const response = await supabase.from('result_likes').update({
            status: { ...status, isliked: !status.isliked }
        }).eq("result_id", result_id).eq("user_id", user_id)
        return response
    }
    catch (error) {
        return ({ error: true })
    }
}
const handleLike = async (result_id, user_id) => {
    try {
        console.log('like')
        const response = await supabase.from('result_likes').insert({
            result_id: result_id,
            user_id: user_id,
            status: { isliked: true }
        }).select('*')
        return response
    }
    catch (error) {
        return ({ error: true })
    }
}