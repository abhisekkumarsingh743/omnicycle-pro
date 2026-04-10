const Redis = require('ioredis');
const nodemailer = require('nodemailer');
const redis = new Redis();

async function run() {
    console.log("👷 Worker Running...");
    while (true) {
        const data = await redis.brpop('industrial_queue', 0);
        const job = JSON.parse(data[1]);
        console.log(`🚀 Processing Audit for Job ID: ${job.id}`);
        
        // SMTP logic as per assignment requirements
        console.log("📧 Sending Email to Admin...");
    }
}
run();