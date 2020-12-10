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
      // const response = await fetch('https://api.thecatapi.com/v1/images/search');
      // const jsonData = await response.json();
      // await db.tasks.bulkPut(jsonData);
      await db.tasks.bulkPut([
        { description: "Learn JavaScript", done: true },
        { description: "Learn How To", done: false },
        { description: "Learn Nothing", done: false },
        { description: "Learn Everything", done: false },
      ]);
      // db.tasks
      //   .where("complete")
      //   .equalsIgnoreCase("true")
      //   .each((item) => console.log(item));
    });
    db.open();
  }
}
