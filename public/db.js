const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
|| window.shimIndexedDB;

let db;
const request = window.indexedDB.open("budget", 1);

request.onupgradeneeded = ({ target }) => {
    let db = request.result;
    db.createObjectStore("pending", { autoIncrement: true });
}

request.onsuccess = ({ target }) => {
    db = request.result;
    if (navigator.onLine) {
        checkDatabase();
    }
    console.log("test");
}

request.onerror = function(event) {
    console.log("error" + event.target.errorCode);
}

function saveRecord(record) {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    store.add(record);
}

function checkDatabase() {
    const transaction = db.transaction(["pending"], "readwrite");
    const store = transaction.objectStore("pending");
    const getAll = store.getAll();

    getAll.onsuccess = function() {
        if (getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method:"post",
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: "application/JSON, text/plain, */*",
                    "content-type": "application/JSON"
                }
            })
            .then(response => {
                return response.JSON();
            })
            .then(() => {
                const transaction = db.transaction(["pending"], "readwrite");
                const store = transaction.objectStore("pending");
                store.clear();
            })
        }
    }
}
window.addEventListener("online", checkDatabase);