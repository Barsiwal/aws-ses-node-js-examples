// Require objects.
var express = require('express');
var app     = express();
var aws     = require('aws-sdk');

// Edit this with YOUR email address.
var email   = "k.barsiwal03@gmail.com";
    
// Load your AWS credentials and try to instantiate the object.
aws.config.loadFromPath('./config.json');

// Instantiate SES.
var ses = new aws.SES();

// Verify email addresses.
app.get('/verify', function (req, res) {
    var params = {
        EmailAddress: email
    };
    
    ses.verifyEmailAddress(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Listing the verified email addresses.
app.get('/list', function (req, res) {
    ses.listVerifiedEmailAddresses(function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Deleting verified email addresses.
app.get('/delete', function (req, res) {
    var params = {
        EmailAddress: email
    };

    ses.deleteVerifiedEmailAddress(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        } 
    });
});

// Sending RAW email including an attachment.
app.get('/send', function (req, res) {
    var ses_mail = "From: 'ssiot data' <" + email + ">\n";
    ses_mail = ses_mail + "To: " + email + "\n";
    ses_mail = ses_mail + "Subject: car\n";
    ses_mail = ses_mail + "MIME-Version: 1.0\n";
    ses_mail = ses_mail + "Content-Type: multipart/mixed; boundary=\"NextPart\"\n\n";
    ses_mail = ses_mail + "--NextPart\n";
    ses_mail = ses_mail + "Content-Type: text/html; charset=us-ascii\n\n";
    ses_mail = ses_mail + "slot has been occupied\n\n";
    ses_mail = ses_mail + "--NextPart";
    
    var params = {
        RawMessage: { Data: new Buffer(ses_mail) },
        Destinations: [ email ],
        Source: "'ssiot data' <" + email + ">'"
    };
    
    ses.sendRawEmail(params, function(err, data) {
        if(err) {
            res.send(err);
        } 
        else {
            res.send(data);
        }           
    });
});

// Start server.
var server = app.listen(8000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('AWS SES example app listening at http://%s:%s', host, port);
});
