import Dexie from "https://cdn.jsdelivr.net/npm/dexie@3.0.3/dist/dexie.mjs";
let db;

export default class KittensService {
  constructor() {
    this.initializeDB();
  }
  initializeDB() {
    db = new Dexie("kittensDB");
    db.version(1).stores({
      cats: "++id,url",
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

  delete(id) {
    return db.cats.delete(id);
  }

  update(url, id) {
    return db.cats.put({ url, id });
  }

  count() {
    return db.cats.count();
  }
}
