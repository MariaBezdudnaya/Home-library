# Local Database

A simple and efficient JavaScript library for managing local storage in web applications.

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Installation](#installation)
-   [Usage](#usage)
-   [Code Examples](#code-examples)
-   [Testing](#testing)
-   [Contributing](#contributing)
-   [License](#license)

## Introduction

`a-local-database` is a lightweight, easy-to-use JavaScript library designed to simplify interactions with local storage in web browsers. It provides a straightforward API for storing, retrieving, and managing data efficiently.

## Features

-   **Simple API**: Easy-to-use methods for storing and retrieving data.
-   **Data Parsing**: Automatic handling of different data types.
-   **Error Handling**: Robust error management for reliable data operations.
-   **Modular Design**: Easily extendable for different storage mechanisms.

## Installation

Install the library using yarn:

```bash
yarn add a-local-database
```

Or include it directly in your HTML:

```html
<script src="path/to/localDatabase.js"></script>
```

## Usage

To start using the library, create a new `Collection` instance:

```javascript
import { Collection } from "a-local-database";

const myCollection = new Collection();
```

## Code Examples

### Setting and Getting Data

```javascript
myCollection.set({ key: "value" });
console.log(myCollection.get("key")); // Outputs: value
```

## Testing

This project uses Jest for testing. Run tests with:

```bash
yarn test
```

## Contributing

Contributions are welcome!

## License

This project is licensed under the MIT License
