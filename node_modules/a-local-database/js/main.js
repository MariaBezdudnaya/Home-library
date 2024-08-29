// import Collection from "./localDatabase";
import Collection from "../release/localDatabase";

let myCollection = new Collection("test");
//
// // myCollection
// /**
//  * Global Vars
//  */
//
// $(function() {
//     $("body").append(`<div id="review">Hellow</div>`);
myCollection.set({ test: 2323, gra: 23 });
// console.log("--- INFO ", myCollection.remove("test"));
console.log("--- 22 ", myCollection.get("test"));
// });
