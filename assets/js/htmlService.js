export default class HtmlService {
  constructor(kittensService) {
    this.kittensService = kittensService;
    this.bindDivEvent();
    this.listCats();
    this.requestNewCat();
  }

  async bindDivEvent() {
    
    try {
      const img = document.querySelector("img");
      img.remove();
    } catch (error) {
      var div = document.getElementById("img");
      var singleCat = await this.addSingleCat();
      var img = document.createElement("img");
    }
    img.src = singleCat.url;
    div.appendChild(img);
  }

  async addSingleCat() {
    const anyCat = await this.kittensService.getAll();
    return anyCat[0];
  }

  async listCats() {
    const cats = await this.kittensService.getAll();
    cats.forEach((cat) => this.addToHtmlList(cat));
  }

  requestNewCat() {
    const buttonAdd = document.getElementById("buttonAdd");
    buttonAdd.addEventListener("click", () => this.getNewCatObject());
  }

  getNewCatObject() {
    let vm = this;
    axios
      .get("https://api.thecatapi.com/v1/images/search")
      .then(function (response) {
        const url = JSON.parse(response.request.response)[0].url;
        if (url.includes('.gif')) {
          vm.getNewCatObject();
          return;
        }
        vm.saveNewCat(url);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async saveNewCat(url) {
    await this.kittensService.saveNew(url);
    const cat = await this.kittensService.findByUrl(url);
    console.log(cat);
    this.addToHtmlList(cat);
  }

  // async deleteTask(taskId, li) {
  //   await this.kittensService.delete(taskId);
  //   li.remove();
  // }

  // async saveTask(taskId, isDone) {
  //   const task = await this.kittensService.get(taskId);
  //   task.done = isDone;
  //   await this.kittensService.save(task);
  // }

  // toggleTask(li, taskId) {
  //   li.classList.toggle(doneCssClass);
  //   const isDone = li.classList.contains(doneCssClass);
  //   this.saveTask(taskId, isDone);
  // }

  addToHtmlList(cat) {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    //li.addEventListener("click", () => this.toggleTask(li, task.id));
    // if (task.done) {
    //   li.classList.add(doneCssClass);
    // }
    span.textContent = cat.id;
    button.textContent = "x";
    // button.addEventListener("click", (event) => {
    //   event.stopPropagation();
    //   this.deleteTask(task.id, li);
    // });
    li.appendChild(span);
    li.appendChild(button);
    ul.appendChild(li);
    this.bindDivEvent();
  }
  
}
