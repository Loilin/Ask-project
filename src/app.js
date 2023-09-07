import {Question} from './question'
import {createModal, isValid} from './utils'
import { authWithEmailAndPassword, getAuthForm } from './auth'
import './style.css'

const form = document.getElementById('form')
const modalBtn = document.getElementById('modal-btn')
const input = form.querySelector('#question-input')
const submitBtn = form.querySelector('#submit')


window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler)
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () =>{
    submitBtn.disabled = !isValid(input.value)
})

function submitFormHandler(event){
event.preventDefault()

if (isValid(input.value)){
   const question = {
    text: input.value.trim(),
    date: new Date().toJSON()
   } 

   submitBtn.disabled = true
   //Async request to server to save question
   Question.create(question).then(() => {
    input.value = ''
    input.className = ''
    submitBtn.disabled = false
   })
 }
}

function displayQuestionsInModal(questions) {
    const modalConten = document.getElementById('modal-content');
    modalConten.innerHTML = '';
    const ul = document.createElement('ul');
    questions.forEach(question => {
        const li = document.createElement('li');
        li.textContent = question.text;
        ul.appendChild(li);
    });
    modalConten.appendChild(ul);
    openModal();

}

function openModal(){
    createModal('Authorization', getAuthForm())
    document.getElementById('auth-form')
    .addEventListener('submit', authFromHandler, {once: true})
}


function authFromHandler(event){
    event.preventDefault()

const btn = event.target.querySelector('button')
const email = event.target.querySelector('#email').value
const password = event.target.querySelector('#password').value

btn.disabled = true
authWithEmailAndPassword(email, password)
   .then(token => {
    return Question.fetch(token)
   })
   .then (question => {
    displayQuestionsInModal(question);
   })
   .catch(error => {
    console.error('Authentication error', error)
   })
   .finally(() => {
    btn.disabled = false;
   });
}