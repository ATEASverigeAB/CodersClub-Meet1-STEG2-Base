/* app.js */

//load modules
var express = require('express');
var bodyParser = require('body-parser');
var app = express();


//set view engine to ejs
app.set('view engine', 'ejs');

//set upp public directory to serve static files
app.use(express.static('public'));

//Initiate bodyParser to parse request body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());


//Dummy data
var meetings = [
    {
        ID: 3466,
        date: "2016-11-26",
        title: "Möte om codersclub",
        completed: false,
        rating: 0,
        numVotes: 0,
        votes: [],
        comments: []
    },
    {
        ID: 3532,
        date: "2016-11-27",
        title: "Träffa kunden XX",
        completed: false,
        rating: 0,
        numVotes: 0,
        votes: [],
        comments: []
    },
    {
        ID: 8863,
        date: "2016-11-22",
        title: "Ska vi ha fika?",
        completed: true,
        rating: 2.8,
        numVotes: 5,
        votes: [2,3,3,2,4],
        comments: ["Hej hopp"]
    }    

]

function getDate(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    return yyyy+"-"+mm+"-"+dd
}


//Define routes

//Define the root route
app.get('/',(req, res) => {

    //render home.ejs
    var notCompletedMeetings = [];
    meetings.filter((meeting) => {
        today = new Date(getDate());
        meetingDate = new Date(meeting.date);
        if (meetingDate > today) {
            notCompletedMeetings.push(meeting);
        }
    })    
    res.render('home', {meetings: notCompletedMeetings});
});

app.post('/', (req, res) => {
    meetings.push({ID:Math.floor((Math.random() * 9999) + 1), title:req.body.titel, date: req.body.date, completed: false, rating: 0, numVotes: 0, comments: [], votes: []})
    
    //render home.ejs    
    var notCompletedMeetings = [];
    meetings.filter((meeting) => {
        today = new Date(getDate());
        meetingDate = new Date(meeting.date);
        if (meetingDate > today) {
            notCompletedMeetings.push(meeting);
        }
    })   
    res.render('home', {meetings: notCompletedMeetings});
});

app.get('/history',(req, res) => {
    //render history.ejs for completed meetings
    var completedMeetings = [];
    meetings.filter((meeting) => {
        today = new Date(getDate());
        meetingDate = new Date(meeting.date);
        
        if (meetingDate <= today) {
            completedMeetings.push(meeting);
        }
    })
    res.render('history', {meetings: completedMeetings})
});

app.get('/details/:id', (req, res) => {
    //render details.ejs for specific meeting
    var meeting = meetings.filter((meeting) => {
        return meeting.ID == req.params.id
    })[0]
    res.render('details', {
        date: meeting.date,
        title: meeting.title,
        completed: meeting.completed,
        rating: meeting.rating,
        numVotes: meeting.numVotes,
        votes: meeting.votes,
        comments: meeting.comments

    });
});

app.get('/vote/:id', (req, res) => {
    //render vote.ejs for specific meeting
    var meeting = meetings.filter((meeting) => {
        return meeting.ID == req.params.id
    })[0]
    res.render('vote', {
        id: meeting.ID,
        title: meeting.title,
        date: meeting.date
    });

});

app.post('/doVote/:id', (req, res) => {
    meetings.filter((meeting) => {
        if(meeting.ID == req.params.id){
            meeting.numVotes++;
            meeting.votes.push(req.body.rating);

            tempRating = 0
            for(var i=0;i<meeting.votes.length;i++){
                tempRating = parseFloat(tempRating) + parseFloat(meeting.votes[i])
            }

            meeting.rating = (tempRating / meeting.numVotes).toPrecision(2);
            if(req.body.comment != ''){
                meeting.comments.push('"'+req.body.comment+'"')
            }
        }
    })

    res.render('doVote');
});

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));