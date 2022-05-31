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


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  if (mailbox === 'inbox') {
    fetch('/emails/inbox', {
      methond: 'GET'
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      data.forEach(mail => {
        const sender = mail.sender;
        const subject = mail.subject;
        const timestamp = mail.timestamp;
        const read = mail.read;

        if (read) {
          document.querySelector('#emails-view').setAttribute('style', 'color: #D0FCB3');
          document.querySelector('#emails-view').innerHTML += `<div background="#D0FCB3">${sender} <strong>${subject}</strong> <span color="blue">at ${timestamp}</span></div>`;
          
        }
        else {
          document.querySelector('#emails-view').innerHTML += `<div background="#D0FCB3">${sender} <strong>${subject}</strong> <span color="blue">at ${timestamp}</span></div>`;
        }
      })
      
    });
    const mails = document.createElement('div');

  }
  else if (mailbox === 'sent') {

  } 
  else { // archieved

  }
}