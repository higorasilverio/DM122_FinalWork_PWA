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
      tasks: "++id,description",
    });
    db.on("populate", async () => {
      await db.tasks.bulkPut([
        { description: "Learn JavaScript", done: true },
        { description: "Learn How To", done: false },
        { description: "Learn Nothing", done: false },
        { description: "Learn Everything", done: false },
      ]);
    });
    db.open();
  }

  getAll() {
    return db.tasks.toArray();
  }

  get(id) {
    return db.tasks.get(id);
  }

  save(task) {
    return db.tasks.put(task);
  }

  delete(id) {
    return db.tasks.delete(id);
  }
}
