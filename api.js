import { renderComments } from "./render.js";

const nameInputElement = document.getElementById("input-name");
const textInputElement = document.getElementById("input-text");
const buttonElement = document.getElementById("button-send");
const addCommentFormEl = document.getElementById("add-comment-form");
const loadingEl = document.getElementById("loading-pic");

function fetchGet(comments, element, btnEl) {
    fetch(
      "https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments",
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        comments = responseData.comments.map((comment) => {
          return {
            name: comment.author.name,
            date: new Date(comment.date)
              .toLocaleString()
              .slice(0, -3)
              .replace(",", ""),
            text: comment.text,
            likeCounter: comment.likes,
            likeButton: comment.isLiked,
            isEdit: false,
          };
        });
        renderComments(comments, element, btnEl);
      });
  }

  function fetchPost(comments, element, btnEl) {
    fetch(
      "https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments",
      {
        method: "POST",
        body: JSON.stringify({
          text: textInputElement.value
            .replaceAll("<", "&lt")
            .replaceAll(">", "&gt")
            .replaceAll("QUOTE_BEGIN", '<div class="quote">')
            .replaceAll("QUOTE_END", "</div>"),
          name: nameInputElement.value
            .replaceAll("<", "&lt")
            .replaceAll(">", "&gt"),
          forceError: true,
        }),
      }
    )
      .then((response) => {
        if (response.status === 400) {
          throw new Error("400");
        }
        if (response.status === 500) {
          throw new Error("Сервер сломался");
        }
        fetchGet(comments, element, btnEl);
      })
      .catch((error) => {
        if (error.message === "400") {
          alert("Имя и комментарий должны быть не короче 3 символов");
        } else if (error.message === "Сервер сломался") {
          console.log("Сервер сломался");
          buttonElement.click();
        } else {
          alert("Кажется, у вас сломался интернет, попробуйте позже");
        }
        addCommentFormEl.style.display = "flex";
        loadingEl.style.display = "none";
        const spanElement = element.lastChild;
        spanElement.remove();
      });
  }
  export {fetchGet, fetchPost, nameInputElement, textInputElement, addCommentFormEl, loadingEl}