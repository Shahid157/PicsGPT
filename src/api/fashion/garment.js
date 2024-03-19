import { insertProducts } from "../../../models/garment"
import models from "../../../constant/models.json"

export default async function handler(req, res) {
    console.log("🚀 ~ file: garment.js:6 ~ handler ~ req.body:", req.body)
    // let a = await insertProducts('Garments', garments)
    // let b = await insertProducts('Prompts', prompt)
    let c = await insertProducts('Models', models)
    console.log('vkndkvndkvndfkvd', c)
    // let c = await insertProducts('payment_methods', newModel)

    res.send({})
}
