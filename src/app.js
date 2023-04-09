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

    if(username === "" || typeof(username) !== "string" || avatar === "" || typeof(avatar) !== "string"){
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    res.status(201).send("OK");
});

app.post("/tweets",(req, res) => {
    const { username, tweet } = req.body;
    const user = users.find((user) => user.username === username);
    
    if(username === "" || typeof(username) !== "string" || tweet === "" || typeof(tweet) !== "string"){
        res.status(400).send("Todos os campos são obrigatórios!");
        return;
    }

    if(user){
        tweets.push({ username, tweet });
        res.status(201).send("OK");
    }else{
        res.status(401).send("UNAUTHORIZED");
    }
});

app.get("/tweets",(req, res) => {
    const page = Number(req.query.page);
    const lastTweets = [];
    const tweetsSize = tweets.length;


    if(page){
        let start = 0;
        let end  = 10;
        if(page < 1){
            res.status(400).send("Informe uma página válida!");
            return;
        }
        if(page > 1){
            start = 10*(page-1)
            end = 10*page;
        }
        for(let i = start; i < end; i++){
            if(i < tweetsSize){
                const user = users.find((user) => user.username === tweets[i].username);
                const tweet = { 
                    username: tweets[i].username,
                    avatar: user.avatar,
                    tweet: tweets[i].tweet
                };
                lastTweets.push(tweet);
            }else{
                break
            }
        }
    
        res.status(201).send(lastTweets);
    }else{
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
    
        res.status(201).send(lastTweets);
    }
});

app.get("/tweets/:username", (req, res) => {
    const user = req.params.username;
    const userTweets = [];
    const userAvatar = users.find((userNow) => userNow.username === user);
    for(let i = 0; i < tweets.length; i++){
        if(tweets[i].username === user){
            const tweet = { 
                username: tweets[i].username,
                avatar: userAvatar.avatar,
                tweet: tweets[i].tweet
            };
            userTweets.push(tweet);
        }
    }

    res.send(userTweets);
});

app.listen(5000);