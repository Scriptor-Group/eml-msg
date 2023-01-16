import EmlParser from "eml-parser";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // get file in post
  const file = req.body;
  console.log(file);
  // save file
  fs.writeFileSync(path.join("/tmp", "file.eml"), file);

  const emlParser = new EmlParser(
    fs.createReadStream(path.join("/tmp", "file.eml"))
  );
  emlParser.getEmailAsHtml().then((eml) => {
    // return parsed file
    console.log("eml", eml);
    res.status(200).send(eml);
  });
}
