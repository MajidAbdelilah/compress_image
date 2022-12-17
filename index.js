const express = require("express");
const multer = require("multer");
const { exec } = require('child_process');
var fs = require('fs');

app = express();
upload = multer({dest: '/tmp/'});

let number_of_uses = 0;

app.post("/compress_image", upload.single("img"), async (req, res)=>{
	let file = req.file.path;
	await	exec("./magick "+file+
	" -strip -interlace Plane  -quality 70% -define jpeg:dct-method=float "
	+file+".jpg", async (err, stdout, stderr) => {

		number_of_uses++;
		console.log("number_of_uses = "+number_of_uses);
		
		if (err) {
			// node couldn't execute the command
			console.log("exec err = "+err);
			return;
		}

		res.setHeader('Content-disposition', 'attachment; filename=' + req.file.originalname+".jpg");
		res.setHeader('Content-type', "image/*");
		
		var filestream = fs.createReadStream(file+".jpg");
		filestream.pipe(res);
	
	// the *entire* stdout and stderr (buffered)
	console.log(`stdout: ${stdout}`);
	console.log(`stderr: ${stderr}`);
	});	
	
});


app.get("/", (req, res)=>{
	res.send("GET OUT OF HERE!");	
});


app.listen(3000, ()=>{"app is listening at 9000"});
