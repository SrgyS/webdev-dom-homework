import { fetchGet, fetchPost } from "./fetchFunctions.js";
// import { comments } from "./data.js";

const buttonElement = document.getElementById('button-send');
  const listElement = document.getElementById('list');
  const nameInputElement = document.getElementById('input-name');
  const textInputElement = document.getElementById('input-text');
  const buttonDeleteElement = document.getElementById('button-delete');

  const addCommentFormEl = document.getElementById('add-comment-form');
  const loadingEl = document.getElementById('loading-pic');
  const containerElement = document.querySelector('.container');

  const showLoading = () => { 
      addCommentFormEl.style.display = 'none';
      loadingEl.style.display = 'block'; 
  }

    const buttonDisabled = () => {
      buttonElement.setAttribute('disabled', true);
      buttonElement.style.backgroundColor = 'grey';
    };

    buttonDisabled();

  function validateForm(){
    if (nameInputElement.value.trim() === '' || textInputElement.value.trim() === '') {
      buttonElement.setAttribute('disabled', true);
    }
    else {
      buttonElement.removeAttribute('disabled');
      buttonElement.style.backgroundColor = '';
    }
  }

  nameInputElement.addEventListener("input", validateForm);
  textInputElement.addEventListener("input", validateForm);



buttonDeleteElement.addEventListener("click", (event)=>{
comments.pop();
renderComments();
event.stopPropagation(); 
})

 const initEditButtons = () => {

  const editButtonElements = document.querySelectorAll('.edit-button');
  const commentBodyElements = document.querySelectorAll('.comment-body');

  editButtonElements.forEach((editButton, index) => {
    editButton.addEventListener('click', (event) => {
      const comment = comments[index];
      event.stopPropagation(); 
      if (comment.isEdit) { 
        const newTextElement = document.querySelector('#new-text')
        const newText = newTextElement.value;
        comment.text = newText;                             
        fetch('https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments', {
          method: 'POST',
          body: JSON.stringify(
            {
            text: newText
                  .replaceAll('<', '&lt')
                  .replaceAll('>', '&gt')
                  .replaceAll('QUOTE_BEGIN', '<div class="quote">')
                  .replaceAll('QUOTE_END', '</div>'),
            name: comment.name,
            })
        }).then(() => {
              fetchGet();
              })
              .then(()=>{
                commentBodyElements[index].innerHTML = `<div class="comment-text">
                                                  ${comment.text}
                                                </div>`;
        editButton.textContent = 'Редактировать';
        comment.isEdit = false;
      })
              .catch((error)=>{
        alert ('Кажется, у вас сломался интернет, попробуйте позже');
        return;
      })
        
                } else {                 
                    editButton.textContent = 'Сохранить';
                    comment.isEdit = true;
                    commentBodyElements[index].innerHTML = `<textarea
                                                  type="textarea"
                                                  class="add-form-text"
                                                  id="new-text"
                                                  rows="4"
                                                >${comment.text}</textarea>`;                                        
                  };         
              });  
        }); 
};

const initEditComments = () => {
  const editCommentElements = document.querySelectorAll('.comment');

  editCommentElements.forEach((editComment, index) => {
    const comment = comments[index];
    
    editComment.addEventListener('click', (event) => {
      if (
    event.target.classList.contains("add-form-text") ||
    event.target.classList.contains("edit-button")
  ) {
       return;
    }
      comment.text = comment.text.replaceAll('<div class="quote">','').replaceAll('</div>','');
      textInputElement.value = (`QUOTE_BEGIN ${comment.text}\n\n${comment.name} QUOTE_END`)
       .replaceAll('&lt','<')
       .replaceAll('&gt','>');
})
  });
}
  
let comments = [];

// function fetchGet() {
//   if (comments.length === 0) {
//    containerElement.insertAdjacentHTML("afterbegin", "<span>Подождите, список загружается...</span>")
//   }

//    fetch('https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments', {
//       method: "GET",
//     }).then((response) => {
//           return response.json()
//     })
//       .then((responseData) => {
//         comments = responseData.comments.map((comment) => {
//             return {
//               name: comment.author.name,
//               date: new Date(comment.date).toLocaleString().slice(0, -3).replace(',', ''),
//               // ('ru-RU', dateOptions).replace(',', ''),
//               text: comment.text,
//               likeCounter: comment.likes,
//               likeButton: comment.isLiked,
//               isEdit: false,
//             }
//           })
//           renderComments();
//           const span = containerElement.querySelector("span");
//           span.remove();
//     } )
   
//   }

fetchGet();

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const initLikeButton = () => {
  const likeButtonElements = document.querySelectorAll('.like-button');
  for (const likeButton of likeButtonElements) {
    
    likeButton.addEventListener('click', (event) => {
      event.stopPropagation(); 
      const index = likeButton.dataset.index;
      likeButton.classList.add('-loading-like');

  delay(2000).then(()=>{
     if (comments[index].likeButton =='-active-like') {
      comments[index].likeButton = '';
      comments[index].likeCounter--;
     }  else {
      comments[index].likeButton = '-active-like';
     comments[index].likeCounter++;
     } 
     renderComments();     
    }) 
    }
    )
  }}


const renderComments = () => {
  const commentsHTML = comments.map((comment, index) => {
    return  `<li class="comment">
                <div class="comment-header">
                  <div>${comment.name}</div>
                  <div>${comment.date}</div>
                </div>
                <div class="comment-body">
                  <div class="comment-text"> 
                   ${comment.text}
                  </div>
                </div>
                <div class="comment-footer">
                  <div class="likes">
                    <span class="likes-counter">${comment.likeCounter}</span>
                    <button class="like-button ${comment.likeButton}" data-index="${index}"></button>
                  </div>
                </div>
                <button class="add-form-button edit-button">Редактировать</button>
        </li>`;
      })
      .join('');

      listElement.innerHTML = commentsHTML;
      nameInputElement.value = '';
      textInputElement.value = '';
      
      buttonDisabled();
      initLikeButton();
      initEditComments();
      initEditButtons();
      addCommentFormEl.style.display = 'flex';
      loadingEl.style.display = 'none';
  }

  
// function fetchPost() {

//   fetch('https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments', {
//     method: 'POST',
//     body: JSON.stringify({
//        text: textInputElement.value
//              .replaceAll('<', '&lt')
//              .replaceAll('>', '&gt')
//              .replaceAll('QUOTE_BEGIN', '<div class="quote">')
//              .replaceAll('QUOTE_END', '</div>'),
//         name: nameInputElement.value
//                               .replaceAll('<', '&lt')
//                               .replaceAll('>', '&gt'),
//                               forceError: true,
//        })
//   })    
//     .then((response) => {
//       if (response.status === 400) {
//         throw new Error('400');
//       }
//       if (response.status === 500) {

//         throw new Error('Сервер сломался');
//       }
//       fetchGet();
//       })
//       .catch((error)=>{
//        if (error.message === '400') {
//         alert ('Имя и комментарий должны быть не короче 3 символов');
//        }
//        else if (error.message === 'Сервер сломался') {
//         console.log('Сервер сломался')
//          buttonElement.click();
//       }
//       else {
//         alert ('Кажется, у вас сломался интернет, попробуйте позже');
//           }
//           addCommentFormEl.style.display = 'flex';
//           loadingEl.style.display = 'none';
//           const spanElement = listElement.lastChild;
//           spanElement.remove();
//         })
//   }
  
    
  

buttonElement.addEventListener("click", () => {
  listElement.insertAdjacentHTML("beforeend", "<span>Комментарий загружается...</span>")
  
  fetchPost();
  showLoading();
  })

  document.addEventListener("keyup", (e)=> {
 if (e.code == 'Enter') {
  buttonElement.click();
 }
});

initEditComments();
renderComments();