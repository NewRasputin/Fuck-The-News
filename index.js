var Twit = require('twit')

var T = new Twit({
  consumer_key:         '...',
  consumer_secret:      '...',
  access_token:         '...-...',
  access_token_secret:  '...',
  timeout_ms:           60*1000,
})


// CNN's user id on twitter
var userid = '759251';

// Stream of tweets from CNN
var stream = T.stream('statuses/filter', { follow: userid })

/* When CNN tweets and if it is not in reply to another user and if the id of
the tweet is the same as CNN's, the bot takes the content of the tweet and
splits it into indiviual characters to get the length. If the length plus 6
(the amount of characters in "Fuck, ") is more than 140 (twitter's character
limit) the bot joins the characters back together. It then splits the content
of the tweet and splits it into words and removes the last one. This makes room
to prepend "Fuck, " and then it tweets out the edited tweet. If it's less than
140 characters it prepends "Fuck, " and tweets it out as is. */
stream.on('tweet', function (tweet) {
  if (!tweet.in_reply_to_screen_name) {
    if (tweet.user.id_str === userid) {
      console.log(tweet)
      var text = tweet.text.split('')
      console.log(text.length)
      var textlength = text.length + 6
      console.log(textlength)
      if (textlength > 140) {
        text = text.join('')
        text = text.split(' ')
        text = text.slice(0, -1)
        text = text.join(' ')
        console.log(text)
        T.post('statuses/update', { status: "Fuck, " + text }, function(err, data, response) {
          console.log(data.text)
        })
      } else {
        T.post('statuses/update', { status: "Fuck, " + tweet.text }, function(err, data, response) {
          console.log(data.text)
        })
      }
    }
  }
})
