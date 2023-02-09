import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import { readdir } from 'node:fs/promises';
import bodyParser from 'body-parser';
const hostname='0.0.0.0';



/*const videos = [
    {
        id: 0,
        poster: '/video/0/poster',
        duration: '3 mins',
        name: 'Sample 1'
    },
    {
        id: 1,
        poster: '/video/1/poster',
        duration: '4 mins',
        name: 'Sample 2'
    },
    {
        id: 2,
        poster: '/video/2/poster',
        duration: '2 mins',
        name: 'Sample 3'
    },
];
*/

//here we make list of all the video files available...
var videoList = [];
var files;
try {
    files = await readdir('./assets');
    
    for (const file of files) {
        //console.log(file);
        const videoDetail = {
            id: file.split(".")[0],
            name: `sample_${file.split(".")[0]}`,
        }
        
        console.log(videoDetail);
        videoList.push(videoDetail);
    }
    //console.log("list is inserted succesfully!");
    //console.log(videoList);

} catch (err) {
    console.error(err);
}

const myVideos ={
    videos : videoList
}
 
const app = express();
const PORT = 4000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

const __dirname = path.resolve();

// app.get('/video', (req, res) => {
//     res.sendFile('assets/vid.mp4', { root: __dirname });

// });

//First, we enable cors on the server since we’ll be making the requests from a different origin (domain).

app.use(cors());
app.get('/videos', (req, res) => {
    res.send(JSON.stringify(myVideos))
});

app.get('/video/:id/data', (req, res) => {
    const id = parseInt(req.params.id, 10);
    res.json(videos[id]);
});


// add after app.get('/video/:id/data', ...) route

app.get('/video/:id', (req, res) => {
    console.log(req.params.id);
    const path = `assets/${req.params.id}.mp4`;
    const stat = fs.statSync(path);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-");
        const start = parseInt(parts[0], 10);
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1;
        const chunksize = (end - start) + 1;
        const file = fs.createReadStream(path, { start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(206, head);
        file.pipe(res);
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        };
        res.writeHead(200, head);
        fs.createReadStream(path).pipe(res);
    }
});

app.post('/video',(req,res) => {
    
    var data = req.body.tejas; // your data 
    data=data+"\n";
	console.log("hello got the request"); 
	console.log(data); 
    fs.appendFile(`${__dirname}/BufferTimeLogs/without_cache.txt`, data, function (err) {
        if (err) throw err;
        console.log('Saved!');
      });
    res.status(200).json({ 
		message: "JSON Data received successfully" 
	}); 

   });


app.listen(PORT, () => console.log(`Server is started successfully on port : http://localhost:${PORT}`));














// import express from 'express';
// import cors from 'cors';
// // import { createRequire } from 'module';
// // const require = createRequire(import.meta.url);
// import router from 'module';


// const app = express();
// const PORT = 5000;

// //First, we enable cors on the server since we’ll be making the requests from a different origin (domain).
// app.use(cors());



// app.use('/', router);



// app.listen(PORT, () => console.log(`Server is started successfully on port : http://localhost:${PORT}`));