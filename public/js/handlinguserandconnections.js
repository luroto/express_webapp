const request = require('request');
const username = $(this).attr(username);
const skillsforsearch = process.argv.slice(0);
skillsforsearch.splice(0, 3);
let queryto = '';
let limitto = '';
for (let i = 0; i < process.argv.length; i++) {
  if (process.argv[i].includes('q=') == true) {
    queryto = process.argv[i];
  } else if (process.argv[i].includes('limit=') == true) {
    limitto = process.argv[i];
  }
}

// setting up urls
const urluserdata = 'https://torre.bio/api/bios/';
let urluserconnections = 'https://bio.torre.co/api/people/' + username + '/connections';
let usersearch = 'https://torre.bio/api/people?';
if (queryto != '') {
  // usersearch = usersearch.concat(queryto);
  urluserconnections = urluserconnections.concat('?', queryto);
}
if (limitto != '') {
  if (urluserconnections.includes('q=') == true) {
    // usersearch = usersearch.concat("&",limitto);
    urluserconnections = urluserconnections.concat('&', limitto);
  } else {
    usersearch = usersearch.concat(limitto);
  }
}

// dictionaries for the dynamic content section:
const initialUserdata = { name: username, skills: [], interested_in: skillsforsearch, photo_url: '' };
const possibleCandidates = [];
/// Functions section:

function gettingInitialUserdata (username) {
  // This function gets all the required data of the initial user
  const urlusername = ''.concat(urluserdata, username);
  const userdata = request.get(urlusername, 'utf8', function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      body = JSON.parse(body);
      initialUserdata.photo_url = body.person.picture;
      for (const item in body.strengths) {
        delete body.strengths[item].id;
        delete body.strengths[item].media;
        delete body.strengths[item].created;
        initialUserdata.skills.push(body.strengths[item]);
      }
    }
    console.log(initialUserdata);
    return (initialUserdata);
  });
}

function gettingconnections (username) {
  // This function handles the initial username connections
  const userconnections = request.get(urluserconnections, 'utf8', function (error, response, body) {
    if (error) {
      console.log(error);
    } else {
      body = JSON.parse(body);
      for (let i = 0; i < body.length; i++) {
        if (body[i].person.professionalHeadline.includes('Software') || body[i].person.professionalHeadline.includes('software') || body[i].person.professionalHeadline.includes('Full stack') || body[i].person.professionalHeadline.includes('full stack') || body[i].person.professionalHeadline.includes('developer') || body[i].person.professionalHeadline.includes('Full Stack') && body[i].degrees <= 2) {
          possibleCandidates.push({ person: body[i].person.publicId });
        }
      }
    }
    console.log(possibleCandidates);
  });
}

