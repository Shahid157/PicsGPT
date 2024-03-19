import { supabase } from "../../../supabase"


const handleLikeUnlike = async(req, res) => {
    req.body = JSON.parse(req.body)
    const postId = req.body.postId;
    const userId = req.body.userId;
    // if post not exist than create post
    const have_posts = await supabase.from("posts").select().eq("post", postId)
    if (!have_posts.data.length) {
        const { error } = await supabase.from('posts').insert({
            post: postId,
            users: [userId]
        })
        if (error) {
            console.log(error)
            throw error
        }
        return res.send({ success: true, message: "like successfully" })
    }
    const { data: post, error } = await supabase
        .from("posts")
        .select("users")
        .eq("post", postId)
        .single();

    if (error) {
        console.log(error);
        throw error
    }

    const existing_post_index = post.users.indexOf(userId);
    const postDetail = await supabase.from("posts").select().eq("post", postId);
    let arr = postDetail.data[0].users

    if (existing_post_index !== -1) {
        // Post already exists in the array, remove it
        const { error } = await supabase
            .from("posts")
            .update({ users: arr.filter(x => x !== userId) })
            .eq("post", postId);
        if (error) {
            console.log(error);
            throw error
        }
        return res.send({ success: true, message: "unlike successfully" });
    } else {
        // Post doesn't exist in the array, add it
        const { error } = await supabase
            .from("posts")
            .update({ users: [...arr, userId] })
            .eq("post", postId);
        if (error) {
            console.log(error);
            throw error
        }
        return res.send({ success: true, message: "like successfully" });
    }
}



const getUserLikeUnlike = async (req, res) => {
    const { userId, postId } = req.query;

    if(postId){
        const {data, error} = await supabase.from('posts').select().eq("post", postId)
        if(error){
            console.error(error)
            return res.send(error)
        }
        const [ detail ] = data
        res.send({
            isLiked: (detail?.users || []).includes(userId),
            count: (detail?.users || []).length,
        })
        
    } else {
    const {data, error} = await supabase.from('posts').select().filter("users", "cs", `["${userId}"]`)
    if(error){
        console.error(error)
        return res.send(error)
    }
    res.send(data.map(x => x.post))
}
}


export default async function handler(req, res) {
    try {
        console.log("🚀 ~ file: likepost.js:72 ~ handler ~ req.method:", req.method)
        switch(req.method){
            case "POST": {
                handleLikeUnlike(req, res)
                break;
            }
            case "GET": {
                return getUserLikeUnlike(req, res)
            }
            default:{
                return null
            }
        }

    } catch (err) {
        res.send({ success: false, error: err })
    }
}


