import { VOTE_TYPE } from "constant/fashion";
import { supabase } from "../../../supabase"


const handleUpVoteDownVote = async (req, res) => {
    req.body = JSON.parse(req.body)
    const postId = req.body.postId;
    const userId = req.body.userId;
    const type = req.body.type;

    // if post not exist than create post
    const have_posts = await supabase.from("posts").select().eq("post", postId)
    if (!have_posts.data.length) {
        const { error } = await supabase.from('posts').insert({
            post: postId,
            ...(type === VOTE_TYPE.LIKE ? { upvote: [userId] } : { downvote: [userId] })
        })
        if (error) {
            console.log(error)
            throw error
        }
        return res.send({ success: true, message: `${type} successfully` })
    }

    if (type === VOTE_TYPE.LIKE) {
        const { data: post, error } = await supabase
            .from("posts")
            .select("upvote")
            .eq("post", postId)
            .single();

        if (error) {
            console.log(error);
            throw error
        }

        const existing_post_index = post.upvote.indexOf(userId);
        const postDetail = await supabase.from("posts").select().eq("post", postId);
        let upvoteArr = postDetail.data[0].upvote
        let downvoteArr = postDetail.data[0].downvote

        if (existing_post_index !== -1) {
            // Post already exists in the array, remove it
            const { error } = await supabase
                .from("posts")
                .update({ upvote: upvoteArr.filter(x => x !== userId) })
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
                .update({ upvote: [...upvoteArr, userId], downvote: downvoteArr.filter(x => x !== userId)  })
                .eq("post", postId);
            if (error) {
                console.log(error);
                throw error
            }
            return res.send({ success: true, message: "like successfully" });
        }
    }
    else if (type === VOTE_TYPE.UNLIKE) {
        const { data: post, error } = await supabase
            .from("posts")
            .select("downvote")
            .eq("post", postId)
            .single();

        if (error) {
            console.log(error);
            throw error
        }

        const existing_post_index = post.downvote.indexOf(userId);
        const postDetail = await supabase.from("posts").select().eq("post", postId);
        let upvoteArr = postDetail.data[0].upvote
        let downvoteArr = postDetail.data[0].downvote

        if (existing_post_index !== -1) {
            // Post already exists in the array, remove it
            const { error } = await supabase
                .from("posts")
                .update({ downvote: downvoteArr.filter(x => x !== userId) })
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
                .update({ downvote: [...downvoteArr, userId], upvote: upvoteArr.filter(x => x !== userId)  })
                .eq("post", postId);
            if (error) {
                console.log(error);
                throw error
            }
            return res.send({ success: true, message: "like successfully" });
        }
    }
}



const getUserUpvoteDownvote = async (req, res) => {
    const { userId, postId } = req.query;
    console.log("🚀 ~ file: upvote-downvote.js:113 ~ getUserUpvoteDownvote ~ req.query:", req.query)

    if (postId) {
        const { data, error } = await supabase.from('posts').select().eq("post", postId)
        if (error) {
            console.error(error)
            return res.send(error)
        }
        const [detail] = data
        res.send({
            upVoteCount: (detail?.upvote || []).length,
            activeLike: userId ? (detail?.upvote || []).includes(userId) : false,
            downVoteCount: (detail?.downvote || []).length,
            activeDisLike: userId ? (detail?.downvote || []).includes(userId): false,
        })

    } else {
        const { data, error } = await supabase.from('posts').select().filter("upvote", "cs", `["${userId}"]`)
        if (error) {
            console.error(error)
            return res.send(error)
        }
        res.send(data.map(x => x.post))
    }
}


export default async function handler(req, res) {
    try {
        console.log("🚀 ~ file: likepost.js:72 ~ handler ~ req.method:", req.method)
        switch (req.method) {
            case "POST": {
                handleUpVoteDownVote(req, res)
                break;
            }
            case "GET": {
                return getUserUpvoteDownvote(req, res)
            }
            default: {
                return null
            }
        }

    } catch (err) {
        res.send({ success: false, error: err })
    }
}


