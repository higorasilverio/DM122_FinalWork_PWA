const selected = "selected";
const noCats =
  "https://aspectodecor.com.br/wp-content/uploads/2020/04/click.png";
const getUrl = "https://api.thecatapi.com/v1/images/search";
var previousLi = null;
var previousCat = null;

export default class HtmlService {
  constructor(kittensService) {
    this.kittensService = kittensService;
    this.bindImgEvent();
    this.listCats();
    this.requestNewCat();
    this.requestUpdateCat();
  }

  async bindImgEvent() {
    var img = document.querySelector("img");
    var singleCat = await this.viewSingleCat();
    img.src = singleCat.url;
    this.previousCat = singleCat;
  }

  async viewSingleCat() {
    const anyCat = await this.kittensService.getAll();
    const numberOfCats = await this.kittensService.count();
    if (numberOfCats == 0) {
      anyCat[0] = {
        url: noCats,
        id: 1,
      };
      return anyCat[0];
    }
    return anyCat[numberOfCats - 1];
  }

  async listCats() {
    const cats = await this.kittensService.getAll();
    cats.forEach((cat) => this.addToHtmlList(cat));
    if (cats.length > 0) {
      const lastCat = document.querySelector("ul").lastElementChild;
      lastCat.classList.add(selected);
      this.previousLi = lastCat;
    }
  }

  requestNewCat() {
    const buttonAdd = document.getElementById("buttonAdd");
    buttonAdd.addEventListener("click", () => this.getCatImage());
  }

  getCatImage() {
    let vm = this;
    axios
      .get(getUrl)
      .then(function (response) {
        const url = JSON.parse(response.request.response)[0].url;
        vm.saveNewCat(url);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  async saveNewCat(url) {
    const cat = { url };
    const catId = await this.kittensService.save(cat);
    cat.id = catId;
    this.addToHtmlList(cat);
    this.bindImgEvent();
  }

  requestUpdateCat() {
    const buttonUpdate = document.getElementById("buttonUpdate");
    buttonUpdate.addEventListener("click", () => this.updateCat());
  }

  async updateCat() {
    let vm = this;
    const src = document.querySelector("img").src;
    if (src == noCats) {
      return;
    }
    let cat = vm.previousCat;
    try {
      await axios
        .get(getUrl)
        .then(function (response) {
          const url = JSON.parse(response.request.response)[0].url;
          cat.url = url;
          vm.kittensService.update(cat.url, cat.id);
        })
        .catch(function (error) {
          console.error(error);
        })
        .then(function () {
          var img = document.querySelector("img");
          img.src = cat.url;
        });
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCat(catId, li) {
    var control = false;
    const liToEvaluate = this.previousLi;
    if (li == liToEvaluate) {
      const catsRemaining = await this.kittensService.count();
      if (catsRemaining > 0) {
        control = true;
      }
    }
    await this.kittensService.delete(catId);
    li.remove();
    if (control == true) {
      var img = document.querySelector("img");
      img.src = noCats;
    } else {
      this.bindImgEvent();
    }
  }

  async selectCat(li, catId) {
    if (this.previousLi != null) {
      this.previousLi.classList.remove(selected);
    }
    li.classList.add(selected);
    this.previousLi = li;
    const cat = await this.kittensService.get(catId);
    this.previousCat = cat;
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
    this.selectCat(li, cat.id);
    this.previousCat = cat;
    ul.appendChild(li);
  }
}
