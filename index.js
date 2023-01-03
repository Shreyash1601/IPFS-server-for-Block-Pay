import express from 'express';
import * as IPFS from 'ipfs';
import * as nodemailer from 'nodemailer';
import cors from 'cors';
const hostname='0.0.0.0';
var ipfs;


const server=express()
server.use(express.json())
server.use(cors({
  origin:"*"
}))

server.post("/data",async (req,res)=>{
  console.log("Inside /data")
  console.log(req.body)
  const stream = ipfs.cat(req.body.CID);
const decoder = new TextDecoder()
let data = ''

for await (const chunk of stream) {

  data += decoder.decode(chunk, { stream: true })
}

console.log(data)
  res.status(200).json({data:JSON.parse(data)})
})


server.post("/ipfs",async (req,res)=>{
  let mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'blockpeofficialbill@gmail.com',
        pass: 'dkcqtuicrmaiiznc'
    }
});
  const data=req.body;
    const { cid } = await ipfs.add(JSON.stringify(data));
    let mailDetails = {
      from: 'blockpeofficialbill@gmail.com',
      to: `${data.email}`,
      subject: `Your Bill for ${data.PName} purchased on ${data.DOP}`,
      text: `Product Name:${data.PName}\n
      Product Price:${data.PPrice}\n
      Aadhar Number of Owner:${data.Aadhar}\n
      Date of Manufacture:${data.DOM}\n
      Date of Purchase:${data.DOP}\n
      Last Time Serviced:${data.LTS}\n
      Servicing Details:${data.Service}\n
      Hash ID:${cid}`
  }
  mailTransporter.sendMail(mailDetails, function(err, data) {
    if(err) {
      console.log(err)
        console.log('Email Error Occurs');
    } else {
        console.log('Email sent successfully');
    }
});
  res.status(200).json({data:cid.toString()})
})


server.use(cors({
  origin:"*"
}))



server.get('/',(req,res)=>{
  res.send("Welcome to IPFS server made specifically for Block Pe")
})


server.listen(process.env.PORT||5000,hostname,async ()=>{
  ipfs=await IPFS.create()
  console.log("IPFS server is running")
  })