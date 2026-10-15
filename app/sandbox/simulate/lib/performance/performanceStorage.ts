import type {
  PerformanceRecord,
} from "./performanceTypes";


//------------------------------------------------------------
// Constants
//------------------------------------------------------------

const DATABASE_NAME =
  "carevr_performance";

const DATABASE_VERSION =
  1;

const STORE_NAME =
  "navigation_performance";


//------------------------------------------------------------
// Open Database
//------------------------------------------------------------

function openDatabase():
  Promise<IDBDatabase> {

  return new Promise(
    (
      resolve,
      reject
    ) => {

      const request =
        indexedDB.open(
          DATABASE_NAME,
          DATABASE_VERSION
        );


      request.onupgradeneeded =
        () => {

          const database =
            request.result;

          if (
            !database.objectStoreNames.contains(
              STORE_NAME
            )
          ) {

            const store =
              database.createObjectStore(
                STORE_NAME,
                {
                  keyPath: "id",
                }
              );

            store.createIndex(
              "journeyId",
              "journeyId",
              {
                unique: false,
              }
            );

            store.createIndex(
              "toPath",
              "toPath",
              {
                unique: false,
              }
            );

            store.createIndex(
              "completedAt",
              "completedAt",
              {
                unique: false,
              }
            );

          }

        };


      request.onsuccess =
        () => {

          resolve(
            request.result
          );

        };


      request.onerror =
        () => {

          reject(
            request.error
          );

        };

    }
  );

}


//------------------------------------------------------------
// Save Performance Record
//------------------------------------------------------------

async function save(
  record: PerformanceRecord
): Promise<void> {

  if (
    typeof indexedDB ===
    "undefined"
  ) {

    return;

  }


  const database =
    await openDatabase();


  return new Promise(
    (
      resolve,
      reject
    ) => {

      const transaction =
        database.transaction(
          STORE_NAME,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );


      store.put(
        record
      );


      transaction.oncomplete =
        () => {

          database.close();

          resolve();

        };


      transaction.onerror =
        () => {

          database.close();

          reject(
            transaction.error
          );

        };


      transaction.onabort =
        () => {

          database.close();

          reject(
            transaction.error
          );

        };

    }
  );

}


//------------------------------------------------------------
// Get All Performance Records
//------------------------------------------------------------

async function getAll():
  Promise<PerformanceRecord[]> {

  if (
    typeof indexedDB ===
    "undefined"
  ) {

    return [];

  }


  const database =
    await openDatabase();


  return new Promise(
    (
      resolve,
      reject
    ) => {

      const transaction =
        database.transaction(
          STORE_NAME,
          "readonly"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );

      const request =
        store.getAll();


      request.onsuccess =
        () => {

          const records =
            (
              request.result as
                PerformanceRecord[]
            )
              .sort(
                (
                  first,
                  second
                ) =>
                  second.completedAt.localeCompare(
                    first.completedAt
                  )
              );

          database.close();

          resolve(
            records
          );

        };


      request.onerror =
        () => {

          database.close();

          reject(
            request.error
          );

        };

    }
  );

}


//------------------------------------------------------------
// Clear Performance Records
//------------------------------------------------------------

async function clear():
  Promise<void> {

  if (
    typeof indexedDB ===
    "undefined"
  ) {

    return;

  }


  const database =
    await openDatabase();


  return new Promise(
    (
      resolve,
      reject
    ) => {

      const transaction =
        database.transaction(
          STORE_NAME,
          "readwrite"
        );

      const store =
        transaction.objectStore(
          STORE_NAME
        );


      store.clear();


      transaction.oncomplete =
        () => {

          database.close();

          resolve();

        };


      transaction.onerror =
        () => {

          database.close();

          reject(
            transaction.error
          );

        };

    }
  );

}


//------------------------------------------------------------
// Export
//------------------------------------------------------------

export const performanceStorage = {

  save,

  getAll,

  clear,

};