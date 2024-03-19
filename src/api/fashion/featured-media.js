export default async function handler(req, res) {
    try {
        const response = await fetch(`https://compy.mediamagic.ai/gpu/cm2/cm2_featured_media.json`)
        if (response.ok) {
            const data = await response.json()
            res.json(data)
        } else {
            res.status(response.status).send(await response.text()) 
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}
