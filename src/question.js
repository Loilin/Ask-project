export class Question {
    static create(question) {
        return fetch('https://podcast-loilin-app-default-rtdb.firebaseio.com/questions.json',{
            method: 'POST',
            body: JSON.stringify(question),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(response => {
            question.id = response.name
            return question
        })
        .then(addToLocalStorage)
        .then(Question.renderList)
    } 

static fetch(token) {
    if (!token) {
        return Promise.resolve('<p class="error">You have no rights</p>')
    }
    return fetch(`https://podcast-loilin-app-default-rtdb.firebaseio.com/questions.json?auth=${token}`)
    .then(response => response.json())
    .then(data => {
        if (data && typeof data === 'object') {
            return Object.keys(data).map(key => ({
                ...data[key],
                id: key
            }));
        } else {
            return []; 
        }
    })
}

static renderList() {
    const questions = getQuestionsFromLocalStorage()

    const html = questions.length
    ? questions.map(toCard).join(' ')
    : `<div class="mui--text-headline">You haven't asked anything yet</div>`

    const list = document.getElementById('list')

    list.innerHTML = html

}

static listToHTML(questions){
    return questions.length
    ? `<ol>${questions.map(q => `<li>${q.text}</li>`).join('')}</ol>`
    : '<p>Have no questions</p>'
}

}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage();
    all.push(question);
    localStorage.setItem('questions', JSON.stringify(all));
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]' )
}

function toCard(question) { 
    return `
    <div class="mui--text-black-54">
        ${new Date(question.date).toLocaleDateString('en-US', {})}
        ${new Date(question.date).toLocaleTimeString('en-US', {})}
    </div>
    <div>${question.text}</div>
    <br>     
`
}
