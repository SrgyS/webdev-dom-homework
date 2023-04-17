import { fetchGet, fetchPost, nameInputElement,textInputElement} from "./api.js";
 import { buttonDisabled, buttonElement } from "./render.js";

const listElement = document.getElementById("list");
const buttonDeleteElement = document.getElementById("button-delete");

const addCommentFormEl = document.getElementById("add-comment-form");
const loadingEl = document.getElementById("loading-pic");

let comments = [];

// лоадер при загрузке страницы
listElement.insertAdjacentHTML(
            "afterbegin",
            "<span>Подождите, список загружается...</span>")
//гиф лоадер при добавлении комментария
const showLoading = () => {
      addCommentFormEl.style.display = "none";
      loadingEl.style.display = "block";
    };

    // кнопка отключена
    buttonDisabled(buttonElement);

    // проверка форм ввода на наличие текста
    function validateForm() {
      if (
        nameInputElement.value.trim() === "" ||
        textInputElement.value.trim() === ""
      ) {
        buttonElement.setAttribute("disabled", true);
      } else {
        buttonElement.removeAttribute("disabled");
        buttonElement.style.backgroundColor = "";
      }
    }
    nameInputElement.addEventListener("input", validateForm);
    textInputElement.addEventListener("input", validateForm);

    // удаление последнего комментария
    buttonDeleteElement.addEventListener("click", (event) => {
      listElement.lastElementChild.remove();
      event.stopPropagation();
    });

    
// получаем данные с сервера
    fetchGet(comments, listElement, buttonElement);

// добавляем комментарий 
    buttonElement.addEventListener("click", () => {
    listElement.insertAdjacentHTML(
        "beforeend",
        "<span>Комментарий загружается...</span>"
      );
      fetchPost(comments, listElement, buttonElement);
      showLoading();
    });
// добавление нажатием кнопки "ввод"
    document.addEventListener("keyup", (e) => {
      if (e.code == "Enter") {
        buttonElement.click();
      }
    });
    