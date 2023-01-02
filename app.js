//Event listener on add button for creating the element inside each conatiner
let addElements = document.getElementsByClassName("container__add");
for (let i = 0; i < addElements.length; i++) {
  let button = addElements[i];
  button.addEventListener("click", addElement);
  console.log("click");
}

// function to add elements onto the containers
function addElement(event) {
  let buttonClicked = event.target;
  //addidng a div element and class in that div element.classList will allow you to add class in the element
  var fallbackElement = buttonClicked.parentElement.getElementsByClassName(
    "container__fallback"
  )[0];

  if (fallbackElement != null) fallbackElement.remove();
  let addElements = document.createElement("div");
  addElements.classList.add("add__elements");
  addElements.draggable = "true";

  var containerContent = `
    <textarea class="add__elements__textbox" type="text" placeholder="Enter the content"></textarea>
    <button class="container__button">X</button>
    `;

  addElements.innerHTML = containerContent;

  addElements
    .getElementsByClassName("container__button")[0]
    .addEventListener("click", removeElement);
  addDragElement(addElements);

  buttonClicked.parentElement.append(addElements);
}

//Remove element from container
var removeElements = document.getElementsByClassName("container__button");
for (let i = 0; i < removeElements.length; i++) {
  var button = removeElements[i];
  button.addEventListener("click", removeElement);
}
function addFallbackUI(container) {
  var containerFallbackElement = document.createElement("div");
  containerFallbackElement.classList.add("container__fallback");
  containerFallbackElement.innerHTML = `<div style="margin-top:50px;text-align:center; font-size:20px">List is empty, Add task using above button</div`;
  container.append(containerFallbackElement);
}

function removeElement(event) {
  let buttonClicked = event.target;
  let storyContainer = buttonClicked.parentElement.parentElement;
  buttonClicked.parentElement.remove();

  //fallback
  console.log(storyContainer.childElementCount);

  if (storyContainer.childElementCount === 3) {
    addFallbackUI(storyContainer);
  }
}
//Adding static data over appropriate column based on column_id
function addStaticElement(container, column_id) {
  addFallbackUI(container);
}

//to drag an element

function addDragElement(element) {
  element.addEventListener("dragstart", () => {
    element.classList.add("drag-active");
  });

  element.addEventListener("dragend", () => {
    element.classList.remove("drag-active");
  });
}

//Adding drag event listener on all container elements
let containerElementsAll = document.getElementsByClassName("add__elements");
for (let i = 0; i < containerElementsAll.length; i++) {
  addDragElement(containerElementsAll[i]);
}

//Adding drag over listener on containers - to know when element is dragged over a container
var containerAll = document.getElementsByClassName("main__Wrapper__container");
for (let i = 0; i < containerAll.length; i++) {
  addStaticElement(containerAll[i], i + 1);

  containerAll[i].addEventListener("dragover", (event) => {
    //By default dropping an element is disabled and also when dropped cursor stays put
    event.preventDefault();

    //Function to get element after the cursor, when dragging elements
    const afterElement = getElementAfterCursor(containerAll[i], event.clientY);
    //Function to get the element being dragged
    const dragActiveElement = document.getElementsByClassName("drag-active")[0];

    //If element after the dragged element is null, means dragging element is at the end of the list - hence, append()
    if (afterElement == null) {
      containerAll[i].append(dragActiveElement);
    }
    //after element not null, to insert drag element before the after element
    else {
      containerAll[i].insertBefore(dragActiveElement, afterElement);
    }
  });
}

//y:coordinate
function getElementAfterCursor(container, y) {
  const containerElements = [
    ...container.querySelectorAll(".add__elements:not(.drag-active)"),
  ];
  // Destructuring to get result as an array, query selecting all elements in the container except the dragging element

  // .reduce() is used to return the element after the dragging eleemnt which is closest to it
  return containerElements.reduce(
    (closest, child) => {
      //closest is the return value from reduce and child is each element in the containerEleemnts array, the callback function is applied on

      //Function gets the dimensions of the container element
      const box = child.getBoundingClientRect();

      //Difference between the cursorY point and the centre point of the container element
      const offset = y - box.top - box.height / 2;

      //Retrun new offset value if it is closer to 0 than the previous offset value
      //More the offset closer to 0, offset between cursor & element is more less
      //-ve value offset is for elements after the drag element/cursor point
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
  //Setting the initial value of offset to as max negative number possible, to keep the offset maximum
}

//changes
var removeContainerButton =
  document.getElementsByClassName("container__remove");
for (let i = 0; i < removeContainerButton.length; i++) {
  var button = removeContainerButton[i];
  button.addEventListener("click", removeContainer);
}

function removeContainer(event) {
  var container = event.target.parentElement;
  container.remove();
  // updateModalSelect();
}

//while clicking on the button we need to add new container
function addContainer(title) {
  var containers = document.getElementsByClassName("main__wrapper")[0];

  var containerElement = document.createElement("div");
  containerElement.classList.add("main__Wrapper__container");

  containerElement.innerHTML = ` 
  <h1  class="container__title">${title}</h1>
  <button class="container__add">ADD CONTENT</button>
  <button class="container__remove">DELETE</button>`;

  var buttonAdd = containerElement.getElementsByClassName("container__add")[0];
  buttonAdd.addEventListener("click", addElement);
  var removeButton =
    containerElement.getElementsByClassName("container__remove")[0];
  removeButton.addEventListener("click", removeContainer);

  //draging over that element
  containerElement.addEventListener("dragover", (event) => {
    //By default dropping an element is disabled and also when dropped cursor stays put
    event.preventDefault();

    //Function to get element after the cursor, when dragging elements
    const afterElement = getElementAfterCursor(containerElement, event.clientY);
    //Function to get the element being dragged
    const dragActiveElement = document.getElementsByClassName("drag-active")[0];

    //If element after the dragged element is null, means dragging element is at the end of the list - hence, append()
    if (afterElement == null) {
      containerElement.append(dragActiveElement);
    }
    //after element not null, to insert drag element before the after element
    else {
      containerElement.insertBefore(dragActiveElement, afterElement);
    }
  });

  // containerElement.addEventListener("input", updateModalSelect);
  addFallbackUI(containerElement);
  containers.append(containerElement);
  // updateModalSelect();
}

// function addstory(parent, text) {
//   //   var containerElement = document.createElement("div");
//   //   //container_element
//   //   containerElement.classList.add("container__elements");
//   //   containerElement.draggable = "true";
//   //   var containerContent = `
//   //   <textarea class="add__elements__textbox" type="text" placeholder="">${text}</textarea>
//   //   <button class="container__button">X</button>
//   //   `;
//   //   containerElement.innerHTML = containerContent;
//   //   containerElement
//   //     .getElementsByClassName("container__button")[0]
//   //     .addEventListener("click", removeElement);
//   //   addDragElement(containerElement);
//   //   parent.append(containerElement);
// }
function addStoryElement(text) {
  var containers = document.getElementsByClassName("main__wrapper")[0];

  var containerElement = document.createElement("div");
  containerElement.classList.add("main__Wrapper__container");

  containerElement.innerHTML = ` 
<h1 contenteditable="true" class="container__title">${text}</h1>
<button class="container__add">ADD CONTENT</button>
<button class="container__remove">DELETE</button>`;

  var buttonAdd = containerElement.getElementsByClassName("container__add")[0];
  buttonAdd.addEventListener("click", addElement);
  var removeButton =
    containerElement.getElementsByClassName("container__remove")[0];
  removeButton.addEventListener("click", removeContainer);

  //draging over that element
  containerElement.addEventListener("dragover", (event) => {
    //By default dropping an element is disabled and also when dropped cursor stays put
    event.preventDefault();

    //Function to get element after the cursor, when dragging elements
    const afterElement = getElementAfterCursor(containerElement, event.clientY);
    //Function to get the element being dragged
    const dragActiveElement = document.getElementsByClassName("drag-active")[0];

    //If element after the dragged element is null, means dragging element is at the end of the list - hence, append()
    if (afterElement == null) {
      containerElement.append(dragActiveElement);
    }
    //after element not null, to insert drag element before the after element
    else {
      containerElement.insertBefore(dragActiveElement, afterElement);
    }
  });

  containerElement.addEventListener("input", updateModalSelect);

  containers.append(containerElement);
  //updateModalSelect();
}

// const modalText = document.querySelector(".modal_text");
// modalText.addEventListener("input", modalTextChange);

function modalTextChange(event) {
  if (event.target.value.length !== 0) {
    modalSubmitButton.disabled = false;
  } else modalSubmitButton.disabled = true;
}

const modalContainerButton = document.querySelector(".header__add__container");
const modalContainerMenu = document.querySelector(".add_container_modal_menu");
const modalContainerText = document.querySelector(".modal_container_text");

modalContainerText.addEventListener("input", modalConatinerTextChange);

function modalConatinerTextChange(event) {
  if (event.target.value.length !== 0) {
    modalContainerSubmitButton.disabled = false;
  } else modalContainerSubmitButton.disabled = true;
}

modalContainerButton.addEventListener("click", function () {
  modalContainerMenu.classList.toggle("active");
});

var modalContainerSubmitButton = document.getElementsByClassName(
  "modal_container_submit"
)[0];
modalContainerSubmitButton.addEventListener("click", modalContainerHandle);
modalContainerSubmitButton.disabled = true;

function modalContainerHandle() {
  modalContainerMenu.classList.toggle("active");

  var textArea = modalContainerMenu.getElementsByClassName(
    "modal_container_text"
  )[0];

  if (textArea.value) addContainer(textArea.value);
}
