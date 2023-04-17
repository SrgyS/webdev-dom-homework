import { nameInputElement,textInputElement, addCommentFormEl, loadingEl } from "./api.js";

const buttonElement = document.getElementById("button-send");
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const buttonDisabled = (btnEl) => {
    btnEl.disabled = true;
    btnEl.style.backgroundColor = "grey";
  };
const initLikeButton = (comments, element, btnEl) => {
    const likeButtonElements = document.querySelectorAll(".like-button");
    for (const likeButton of likeButtonElements) {
      likeButton.addEventListener("click", (event) => {
        event.stopPropagation();
        const index = likeButton.dataset.index;
        likeButton.classList.add("-loading-like");

        delay(2000).then(() => {
          if (comments[index].likeButton == "-active-like") {
            comments[index].likeButton = "";
            comments[index].likeCounter--;
          } else {
            comments[index].likeButton = "-active-like";
            comments[index].likeCounter++;
          }
          renderComments(comments, element, btnEl);
        });
      });
    }
  };
  const initEditButtons = (comments) => {
    const editButtonElements = document.querySelectorAll(".edit-button");
    const commentBodyElements = document.querySelectorAll(".comment-body");

    editButtonElements.forEach((editButton, index) => {
      editButton.addEventListener("click", (event) => {
        const comment = comments[index];
        event.stopPropagation();
        if (comment.isEdit) {
          const newTextElement = document.querySelector("#new-text");
          const newText = newTextElement.value;
          comment.text = newText;

          fetch(
            "https://webdev-hw-api.vercel.app/api/v1/sergei-stepanov/comments",
            {
              method: "POST",
              body: JSON.stringify({
                text: newText
                  .replaceAll("<", "&lt")
                  .replaceAll(">", "&gt")
                  .replaceAll("QUOTE_BEGIN", '<div class="quote">')
                  .replaceAll("QUOTE_END", "</div>"),
                name: comment.name,
              }),
            }
          )
            .then(() => {
              fetchGet(comments, element);
            })
            .then(() => {
              commentBodyElements[
                index
              ].innerHTML = `<div class="comment-text">
                                                ${comment.text}
                                              </div>`;
              editButton.textContent = "Редактировать";
              comment.isEdit = false;
            })
            .catch((error) => {
              alert("Кажется, у вас сломался интернет, попробуйте позже");
              return;
            });
        } else {
          editButton.textContent = "Сохранить";
          comment.isEdit = true;
          commentBodyElements[index].innerHTML = `<textarea
                                                type="textarea"
                                                class="add-form-text"
                                                id="new-text"
                                                rows="4"
                                              >${comment.text}</textarea>`;
        }
      });
    });
  };

  const initEditComments = (comments) => {
    const editCommentElements = document.querySelectorAll(".comment");

    editCommentElements.forEach((editComment, index) => {
      const comment = comments[index];

      editComment.addEventListener("click", (event) => {
        if (
          event.target.classList.contains("add-form-text") ||
          event.target.classList.contains("edit-button")
        ) {
          return;
        }
        comment.text = comment.text
          .replaceAll('<div class="quote">', "")
          .replaceAll("</div>", "");
        textInputElement.value =
          `QUOTE_BEGIN ${comment.text}\n\n${comment.name} QUOTE_END`
            .replaceAll("&lt", "<")
            .replaceAll("&gt", ">");
      });
    });
  };
const renderComments = (comments, element, btnEl) => {
    const commentsHTML = comments
      .map((comment, index) => {
        return `<li class="comment">
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
      .join("");

    element.innerHTML = commentsHTML;
    nameInputElement.value = "";
    textInputElement.value = "";

    buttonDisabled(btnEl);
    initLikeButton(comments, element, btnEl);
    initEditComments(comments);
    initEditButtons(comments);
    addCommentFormEl.style.display = "flex";
    loadingEl.style.display = "none";
  };

  export {renderComments, buttonDisabled, buttonElement};