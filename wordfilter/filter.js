const http = require("http")
var url  = require('url');

const port = process.env.FILTER_PORT || 8080
const hostname = 'localhost'

let words;
let etag;
let lastRequested;

function getQueryParams(req){
   const urlParts = url.parse(req.url)
   if (urlParts.query==null){
      return {}
   }
   const params = urlParts.query.split("&").map(q=>{
      return q.split("=")
   })
   .reduce((agg,[k,v])=>{
      agg[k] = decodeURIComponent(v)
      return agg
   },{})
   return params
}

function makeRequest(headers){
   return new Promise((resolve,reject)=>{
      http.get('http://habit-tracker-lord8266.s3.ap-south-1.amazonaws.com/filterwords/words.txt',{
         headers:headers,
      },(response)=>{
         etag = response.headers['etag'] || etag
         lastRequested = new Date()
         let str=''
         response.on('data',(chunk)=>{
            str+=chunk
         })
         response.on('end',()=>{
            if (response.statusCode==200){
               words = str.split("\n")
            }
            resolve()
         })
         response.on('error',(err)=>{
            reject(err)
         })
      })
   })
}

async function fetchWords(){
   if (!words){
      console.log("first request")
      await makeRequest({})
   }
   else if (new Date()-lastRequested>1000*60*10){ //update after 10min
      console.log("update request")
      await makeRequest({'If-None-Match':etag})
   }
   else {
      console.log("cache request")
   }
}

function sendInvalidRequest(res){
   res.statusCode = 503
   res.setHeader("Content-Type","text/plain")
   res.end("invalid request")
}

function sendIsBadWord(res,word){
   res.statusCode = 503
   res.setHeader("Content-Type","text/plain")
   for (let w of words){
      if (w==word){
         return res.end("true");
      }
   }
   res.end("false")
}

const server = http.createServer(async (req,res)=>{
   await fetchWords()
   const params = getQueryParams(req)
   if (!params['word']){
      sendInvalidRequest(res);
   }
   else {
      sendIsBadWord(res,params['word'])
   }
})

server.listen(port,hostname,()=>{
   console.log(`Server running at http://${hostname}:${port}`)
})

