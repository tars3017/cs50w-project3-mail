document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  document.querySelector('#compose-form').addEventListener('submit', send_email);
  // By default, load the inbox
  load_mailbox('inbox');
});
function transferMonth(num) {
  if (num === 0) return 'Jan';
  else if (num === 1) return 'Feb';
  else if (num === 2) return 'Mar';
  else if (num === 3) return 'Apr';
  else if (num === 4) return 'May';
  else if (num === 5) return 'Jun';
  else if (num === 6) return 'Jul';
  else if (num === 7) return 'Aug';
  else if (num === 8) return 'Sep';
  else if (num === 9) return 'Oct';
  else if (num === 10) return 'Nov';
  else if (num === 11) return 'Dec';
}
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#display-mails').style.display = 'none';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}
function send_email(event) {
  event.preventDefault();
  const Recipients = document.querySelector('#compose-recipients').value;
  const Subject = document.querySelector('#compose-subject').value;    
  const Body = document.querySelector('#compose-body').value;
  console.log(Recipients, Subject, Body);
  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: Recipients,
      subject: Subject,
      body: Body
    })
  })
  .then(response => response.json())
  .then(result =>{
    console.log(result);
  });

  load_mailbox('sent');
}

function archive_mail(mail_id, ctl) {
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      archived: ctl
    })
  });
  console.log(ctl);
  load_mailbox('inbox');
}

function Reply_mail(reply_to, pre_subject, me) {
  if (!pre_subject.innerHTML.startsWith('Re: ')) {
    pre_subject = 'Re: ' + pre_subject.innerHTML;
  }
  else {
    pre_subject = pre_subject.innerHTML;
  }
  let currentDate = new Date();
  let hour = currentDate.getHours();
  let ampm = hour >= 12 ? 'p.m.' : 'a.m.';
  hour %= 12;
  hour = hour ?  hour : 12;
  let pre_body = 'On ' + transferMonth(currentDate.getMonth()) + ' ' 
                + currentDate.getDate() + ' ' 
                + currentDate.getFullYear() + ', ' 
                + hour  + ':'
                + currentDate.getMinutes() + ' '
                + ampm + ' '
                + me + ' wrote:';
  compose_email();
  document.querySelector('#compose-recipients').value = reply_to.innerHTML.slice(8, -9);
  document.querySelector('#compose-subject').value = pre_subject;
  document.querySelector('#compose-body').value = pre_body;


  // load_mailbox('sent');
}

function display_mail(mail_id, is_in_sent, is_in_inbox) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-mails').style.display = 'block';

  // mark as read
  fetch(`/emails/${mail_id}`, {
    method: 'PUT',
    body: JSON.stringify({
      read: true
    })
  });

  // display the mail
  fetch(`/emails/${mail_id}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    console.log(data);
    let title = document.createElement('h3');
    title.innerHTML = data.subject;

    let sender = document.createElement('div');
    sender.innerHTML = `<strong>${data.sender}</strong>`;

    let body = document.createElement('div');
    body.innerHTML = data.body;

    let time = document.createElement('div');
    time.innerHTML = data.timestamp;
    time.setAttribute('style', 'float: right;');

    recipient = data.recipients[0];

    let btn = document.createElement('button');
    innerHTML = "TEST";
    let ctl = false;
    if (data.archived) {
      btn.innerHTML = "Unarchive";
    }
    else {
      btn.innerHTML = "Archive";
      ctl = true;
    }
    btn.addEventListener('click', () => archive_mail(mail_id, ctl));

    let reply = document.createElement('button');
    reply.innerHTML = "Reply";
    reply.addEventListener('click', () => Reply_mail(sender, title, recipient));

    const part = document.querySelector('#display-mails');
    part.innerHTML = '';
    part.appendChild(title);
    part.appendChild(time);
    part.appendChild(sender)
    part.appendChild(body);
    if (!is_in_sent) {
      part.appendChild(btn);
    }
    if (is_in_inbox) {
      part.appendChild(reply);
    }
    
   
  })
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-mails').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  let is_in_sent = false;
  let is_in_inbox = false;

  if (mailbox === 'sent') {
    is_in_sent = true;
  }
  else if (mailbox === 'inbox') {
    is_in_inbox = true;
  }

  fetch(`/emails/${mailbox}`, {
    method: 'GET'
  })
  .then(response => response.json())
  .then(data => {
    // console.log(data);
    data.forEach(mail => {
      const sender = mail.sender;
      const subject = mail.subject;
      const timestamp = mail.timestamp;
      const read = mail.read;
      const id = mail.id;
      if (read) {
        let element = document.createElement('div');
        element.innerHTML = `<div>To ${mail.recipients[0]} <strong>${subject}</strong> at <i>${timestamp}</i></div>`;
        // element.style.color = "#D0FCB3";
        element.setAttribute('style', 'background: #FEFEFE; margin: 5px; padding: 2px; border-radius: 5px; border-style: solid; border-width: 1px;');
        element.addEventListener('click', () => display_mail(id, is_in_sent, is_in_inbox));
        document.querySelector('#emails-view').appendChild(element);
        // document.querySelector('#emails-view').setAttribute('style', 'color: #D0FCB3');
        // document.querySelector('#emails-view').innerHTML += 
        
      }
      else {
        let element = document.createElement('div');
        element.innerHTML = `<div">${sender} send <strong>${subject}</strong> at <i>${timestamp}</i></div>`;
        // element.style.color = "blue";
        element.setAttribute('style', 'background: #C9CAD9; margin: 5px; padding: 2px; border-radius: 5px; border-style: solid; border-width: 1px;');
        element.addEventListener('click', () => display_mail(id, is_in_sent, is_in_inbox));
        document.querySelector('#emails-view').appendChild(element);
        // document.querySelector('.mails').style.color = "blue";
      }
    });
    
  });
}