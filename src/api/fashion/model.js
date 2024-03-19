import { encodeFormData } from "constant/helpers";

const MEDIAMAGIC_DEV_URL = process.env.MEDIAMAGIC_DEV_URL;

export default async function handler(req, res) {
  const requestMethod = req.method;
  req.body = JSON.parse(req.body);
  const input_image_file = req.body.input_image_file;
  const mask_image_file = req.body.mask_image_file;
  const model_id = req.body.model_id;
  const name = req.body.name;
  const type = req.body.type || "erase";
  const sess_id = req.body.sess_id;

  let args;
  if (name === "InteriorAI") {
    args = {
      image: input_image_file,
      mask: mask_image_file,
    };
  } else {
    args = {
      input_image_file,
      mask_image_file,
    };
  }
  let response = null;
  if (type === "erase") {
    const resp = await fetch(`${MEDIAMAGIC_DEV_URL}/deployments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/mediamagic.rest.v1+json",
        "x-mediamagic-key": "71e78a35-bc4e-11ed-b923-c23d2d82ba82",
      },
      body: JSON.stringify({
        args,
        model_id,
        name,
      }),
    });
    response = await resp.json();
  } else {
    const obj = {
      "/inpainting -F input_image": `@${input_image_file} -F mask_image=@${mask_image_file} -F prompt="photo of hand"`,
    };
    const encodedData = encodeFormData(obj);
        const resp = await fetch(`${process.env.CM1_BASE_URL}reroute.php?ses_id=${sess_id}&gpu=cm2&container=pingpongai/maskedinpainting:latest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: encodedData
        })
        response = await resp.json()
    }

  let data = [];
  if (type === "erase") {
    data = response?.job?.files || [];
  } else {
    data = response?.files || [];
  }
  switch (requestMethod) {
    case "POST":
      return res.status(200).json({ ...response, files: data });
    default:
      return res.status(200).json({ ...response, files: data });
  }
}
