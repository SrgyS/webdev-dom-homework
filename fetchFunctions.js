// import { comments } from "./data.js";

function fetchGet() {
  // if (comments.length === 0) {
  //  containerElement.insertAdjacentHTML("afterbegin", "<span>Подождите, список загружается...</span>")
  // }

   fetch('https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments', {
      method: "GET",
    }).then((response) => {
          return response.json()
    })
      .then((responseData) => {
        comments = responseData.comments.map((comment) => {
            return {
              name: comment.author.name,
              date: new Date(comment.date).toLocaleString().slice(0, -3).replace(',', ''),
              // ('ru-RU', dateOptions).replace(',', ''),
              text: comment.text,
              likeCounter: comment.likes,
              likeButton: comment.isLiked,
              isEdit: false,
            }
          })
          renderComments();
          const span = containerElement.querySelector("span");
          span.remove();
    } )
   
  } 
function fetchPost() {

  fetch('https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments', {
    method: 'POST',
    body: JSON.stringify({
       text: textInputElement.value
             .replaceAll('<', '&lt')
             .replaceAll('>', '&gt')
             .replaceAll('QUOTE_BEGIN', '<div class="quote">')
             .replaceAll('QUOTE_END', '</div>'),
        name: nameInputElement.value
                              .replaceAll('<', '&lt')
                              .replaceAll('>', '&gt'),
                              forceError: true,
       })
  })    
    .then((response) => {
      if (response.status === 400) {
        throw new Error('400');
      }
      if (response.status === 500) {

        throw new Error('Сервер сломался');
      }
      fetchGet();
      })
      .catch((error)=>{
       if (error.message === '400') {
        alert ('Имя и комментарий должны быть не короче 3 символов');
       }
       else if (error.message === 'Сервер сломался') {
        console.log('Сервер сломался')
         buttonElement.click();
      }
      else {
        alert ('Кажется, у вас сломался интернет, попробуйте позже');
          }
          addCommentFormEl.style.display = 'flex';
          loadingEl.style.display = 'none';
          const spanElement = listElement.lastChild;
          spanElement.remove();
        })
  }

 
export { fetchGet, fetchPost };
    
