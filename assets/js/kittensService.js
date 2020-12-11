import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs";
let db;

export default class KittensService {
  constructor() {
    this.initializeDB();
  }
  initializeDB() {
    // start indexedDB
    db = new Dexie("kittensDB");
    db.version(1).stores({
      cats: "++id,url",
    });
    db.on("populate", async () => {
      await db.cats.bulkPut([
        { url: "https://cdn2.thecatapi.com/images/MTgzOTMyNQ.jpg" },
        { url: "https://cdn2.thecatapi.com/images/MTgxMTY1OA.jpg" },
      ]);
    });
    db.open();
  }

  getAll() {
    return db.cats.toArray();
  }

  get(id) {
    return db.cats.get(id);
  }

  save(cat) {
    return db.cats.put(cat);
  }

  saveNew(CatUrl) {
    return db.cats.add({url: CatUrl});
  }

  findByUrl(url) {
    return db.cats.where("url").equalsIgnoreCase(url);
  }

  delete(id) {
    return db.cats.delete(id);
  }
}
