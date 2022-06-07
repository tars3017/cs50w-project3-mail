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

function archive_mail(mail_id) {
  // TODO
}

function display_mail(mail_id) {
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

    let btn = document.createElement('button');
    innerHTML = "TEST";
    if (data.archived) {
      btn.innerHTML = "Unarchive";
    }
    else {
      btn.innerHTML = "Archive";
    }
    btn.addEventListener('click', () => archive_mail(mail_id));

    const part = document.querySelector('#display-mails');
    part.innerHTML = '';
    part.appendChild(title);
    part.appendChild(time);
    part.appendChild(sender)
    part.appendChild(body);
    part.appendChild(btn);
   
  })
  
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#display-mails').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

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
        element.innerHTML = `<div>${sender} send <strong>${subject}</strong> at <i>${timestamp}</i></div>`;
        // element.style.color = "#D0FCB3";
        element.setAttribute('style', 'background: #FEFEFE; margin: 5px; padding: 2px; border-radius: 5px; border-style: solid; border-width: 1px;');
        element.addEventListener('click', () => display_mail(id));
        document.querySelector('#emails-view').appendChild(element);
        // document.querySelector('#emails-view').setAttribute('style', 'color: #D0FCB3');
        // document.querySelector('#emails-view').innerHTML += 
        
      }
      else {
        let element = document.createElement('div');
        element.innerHTML = `<div">${sender} send <strong>${subject}</strong> at <i>${timestamp}</i></div>`;
        // element.style.color = "blue";
        element.setAttribute('style', 'background: #C9CAD9; margin: 5px; padding: 2px; border-radius: 5px; border-style: solid; border-width: 1px;');
        element.addEventListener('click', () => display_mail(id));
        document.querySelector('#emails-view').appendChild(element);
        // document.querySelector('.mails').style.color = "blue";
      }
    });
    
  });
}