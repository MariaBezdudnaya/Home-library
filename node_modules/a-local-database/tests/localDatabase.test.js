import Collection from "../js/localDatabase.js";

describe("Collection", () => {
    beforeEach(() => {
        // Clear localStorage before each test
        localStorage.clear();
    });
    test("set and get method", () => {
        let myCollection = new Collection("test");
        myCollection.set({ test: 2323, gra: 23 });
        expect(myCollection.get("test")).toBe(2323);
    });
    test('should handle non-existent item retrieval', () => {
        const collection = new Collection();
        expect(collection.get('nonExistentKey')).toBeNull();
    });
});
