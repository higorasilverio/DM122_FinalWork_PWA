const selected = 'selected';
const previousLi = null;

export default class HtmlService {
  constructor(kittensService) {
    this.kittensService = kittensService;
    this.bindImgEvent();
    this.listCats();
    this.requestNewCat();
  }

  async bindImgEvent() {
    var img = document.querySelector("img");
    var singleCat = await this.viewSingleCat();
    img.src = singleCat.url;
  }

  async viewSingleCat() {
    const anyCat = await this.kittensService.getAll();
    const numberOfCats = await this.kittensService.count();
    if (numberOfCats == 0) {
      anyCat[0] = {
        url:
          "https://thumbs.dreamstime.com/t/o-%C3%ADcone-do-gato-no-c%C3%ADrculo-vermelho-da-proibi%C3%A7%C3%A3o-nenhuns-animais-de-estima%C3%A7%C3%A3o-proibe-sinal-s%C3%ADmbolo-proibido-112129289.jpg",
      };
      return anyCat[0];
    }
    return anyCat[numberOfCats - 1];
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
        if (url.includes(".gif")) {
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
    const cat = { url };
    const catId = await this.kittensService.save(cat);
    cat.id = catId;
    this.addToHtmlList(cat);
    this.bindImgEvent();
  }

  async deleteCat(catId, li) {
    await this.kittensService.delete(catId);
    li.remove();
    this.bindImgEvent();
  }

  async selectCat(li, catId) {
    if (this.previousLi != null) {
      this.previousLi.classList.remove(selected);
    }
    li.classList.add(selected);
    this.previousLi = li;
    const cat = await this.kittensService.get(catId);
    var img = document.querySelector("img");
    img.src = cat.url;
  }

  addToHtmlList(cat) {
    const ul = document.querySelector("ul");
    const li = document.createElement("li");
    const span = document.createElement("span");
    const button = document.createElement("button");
    li.addEventListener("click", () => this.selectCat(li, cat.id));
    span.textContent = cat.id;
    button.textContent = "x";
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      this.deleteCat(cat.id, li);
    });
    li.appendChild(span);
    li.appendChild(button);
    ul.appendChild(li);
  }
}
