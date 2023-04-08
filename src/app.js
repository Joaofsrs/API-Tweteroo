import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const users = []
const tweets = [];

app.post("/sign-up",(req, res) => {
    const { username, avatar } = req.body;
    users.push({ username, avatar });

    res.send("OK");
});

app.post("/tweets",(req, res) => {
    const { username } = req.body;
    console.log(res)
    tweets.push(req.body);

    res.send("OK");
});

app.get("/tweets",(req, res) => {
    const lastTweets = [];
    const tweetsSize = tweets.length;

    for(let i = 1; i <= 10; i++){
        if(tweetsSize - i >= 0){
            const user = users.find((user) => user.username === tweets[tweetsSize - i].username);
            const tweet = { 
                username: tweets[tweetsSize - i].username,
                avatar: user.avatar,
                tweet: tweets[tweetsSize - i].tweet
            };
            lastTweets.push(tweet);
        }else{
            break
        }
    }

    res.send(lastTweets);
});

app.listen(5000);