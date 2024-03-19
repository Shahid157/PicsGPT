import formidable from "formidable";
import axios from "axios";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  let response = { success: false }
  try {
    const fs = await require("fs");
    const data = await new Promise(
      (resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.keepExtensions = true;
        form.parse(req, (err, fields, files) => {
          if (err) reject({ err });
          resolve({ fields, files });
        });
      }
    );
    const session = 'f0bf219d-a69e-11ed-9677-d8bbc109c436'
    const extension = data.files.file.originalFilename?.includes('.') ? data.files.file.originalFilename : `object-removal-${new Date().getTime()}.jpg`
    let config = {
      method: "post",
      url: `${process.env.CM1_BASE_URL}post.php?token=${session}&file=${extension}`,
      data: fs.createReadStream(data.files.file.filepath)
    };
    response = await axios(config);
    return res.status(200).json(response.data)
  } catch (err) {
    return res.status(500).json(err)
  }
}
