// A simple promise
const simplePromiseExample = () => {
	const simplePromise = new Promise((resolve, reject) => {
		// Do Something....
		// And resolve with a successs
		resolve("SUCCESS!");
		// And reject the promise with a failure
		// reject("FAILURE!");
		// It can also happen with an Exception.
		// throw new Error("threw Error() to FAIL!");
	});

	simplePromise
		.then(console.log)
		.catch((error) => console.error(`Failed with: ${error}`))
		.finally(console.log("Finished the calls"));
};

// TODO: simplePromiseExample();

// pyramid of doom example
const callbacksExample = () => {
	/**
	 * A fake login endpoint that allows users to login.
	 * This mocks an asynchronous process and causes a random failure or return a success.
	 * @param action 'login' to first login the user, 'get' to check their state, 'update' to update thier state to logged in.
	 * @param callback function to process results, shouldn't be NULL.
	 * @throws Error with a 20% probability.
	 */
	function mockFetchWithCallback(action, callback) {
		// A random 1billion statements and 80% chance to succeed.
		let randomNumber = Math.floor(Math.random() * 100000000);
		let shouldItSucceed = Math.random() < 0.9;

		// A random iteration to simulate processing time.
		while (randomNumber > 0) {
			randomNumber -= 1;
		}

		// A naive user Log in.
		if (shouldItSucceed) {
			switch (action) {
				case "login":
					callback("Login was a success!");
					break;
				case "get":
					callback(JSON.stringify({ user: "joe", state: "was logged out" }));
					break;
				case "update":
					callback(JSON.stringify({ user: "joe", state: "is logged in" }));
					break;
			}
		} else {
			throw new Error("threw Error() to FAIL!");
		}
	}

	// Call the mock fetch up to 3 times if the previous succeeds.
	// We create code bloat to process these callback or errors
	try {
		mockFetchWithCallback("login", (result) => {
			console.log(`login completed with: ${result}. Now get previous state.`);
			mockFetchWithCallback("get", (user) => {
				console.log(`Pulling previous user state: ${user}.`);
				mockFetchWithCallback("update", (user) => {
					console.log(`Updated user state: ${user}.`);
				});
			});
		});
	} catch (error) {
		console.log(`We failed :(, with message: ${error}`);
	}
};

// TODO: callbacksExample();

const cleanPromiseExample = () => {
	/**
	 * A fake login endpoint that allows users to login.
	 * This mocks an asynchronous process and causes a random failure or return a success.
	 * @param action 'login' to first login the user, 'get' to check their state, 'update' to update thier state to logged in.
	 * @throws Error with a 20% probability.
	 */
	function mockFetchWithPromise(action) {
		return new Promise((resolve, reject) => {
			// A random 1billion statements and 80% chance to succeed.
			let randomNumber = Math.floor(Math.random() * 100000000);
			let shouldItSucceed = Math.random() < 0.9;

			// A random iteration to simulate processing time.
			while (randomNumber > 0) {
				randomNumber -= 1;
			}

			// A naive user Log in.
			if (shouldItSucceed) {
				switch (action) {
					case "login":
						resolve("Login was a success!");
						break;
					case "get":
						resolve(JSON.stringify({ user: "joe", state: "was logged out" }));
						break;
					case "update":
						resolve(JSON.stringify({ user: "joe", state: "is logged in" }));
						break;
				}
			} else {
				throw reject("We FAILED!");
			}
		});
	}

	// Test the promise here.
	mockFetchWithPromise("login")
		.then((result) => {
			console.log(`login completed with: ${result}. Now get previous state.`);
			return mockFetchWithPromise("get");
		})
		.then((user) => {
			console.log(`Pulling previous user state: ${user}.`);
			return mockFetchWithPromise("update");
		})
		.then((user) => {
			console.log(`Updated user state: ${user}.`);
			return mockFetchWithPromise();
		})
		.catch((cause) => {
			console.log(`Exception with promise as caused by: ${cause}`);
		});
};

// TODO = cleanPromiseExample();

// Orchestration with any(), race(), all(), allSettled()
const orchestratedPromiseExample = () => {
	/**
	 * A fake server endpoint call.
	 * This mocks an asynchronous process and causes a random failure or return a success.
	 * @param action 'login', 'ads', 'analytics'.
	 * @throws Error with a 20% probability.
	 */
	function mockAction(action) {
		return new Promise((resolve, reject) => {
			// A random 1billion statements and 80% chance to succeed.
			let randomNumber = Math.floor(Math.random() * 100000000);
			let shouldItSucceed = Math.random() < 0.9;

			// A random iteration to simulate processing time.
			while (randomNumber > 0) {
				randomNumber -= 1;
			}

			// A naive user Log in.
			if (shouldItSucceed) {
				resolve(`Action: ${action} Succeeded`);
			} else {
				throw reject(`Action: ${action} Failed`);
			}
		});
	}

	// Test the promise here.
	let adsPromises = Promise.any([
		mockAction("ad1"),
		mockAction("ad2"),
		mockAction("ad2"),
	]);
	let requiredPromises = Promise.all([
		mockAction("login"),
		mockAction("analytics"),
		adsPromises,
	]);

	requiredPromises
		.then((result) => {
			console.log(`Result: ${result}`);
		})
		.catch((cause) => {
			console.log(`Exception with promise as caused by: ${cause}`);
		});
};

// TODO: orchestratedPromiseExample();

// Using cleaner await and asyc instructions.
const awaitExample = () => {
	/**
	 * A fake server endpoint call.
	 * This mocks an asynchronous process and causes a random failure or return a success.
	 * @param action 'login', 'ads', 'analytics'.
	 * @throws Error with a 20% probability.
	 */
	function mockAction(action) {
		return new Promise((resolve, reject) => {
			// A random 1billion statements and 80% chance to succeed.
			let randomNumber = Math.floor(Math.random() * 100000000);
			let shouldItSucceed = Math.random() < 0.9;

			// A random iteration to simulate processing time.
			while (randomNumber > 0) {
				randomNumber -= 1;
			}

			// A naive user Log in.
			if (shouldItSucceed) {
				resolve(`Action: ${action} Succeeded`);
			} else {
				throw reject(`Action: ${action} Failed`);
			}
		});
	}

	let requiredPromises = async () => console.log(await mockAction("login"));

	requiredPromises();

	let someFunction = async () => "nothing really";
	someFunction().then((result) =>
		console.log(`What did it do asynchronously: ${result}`)
	);
};

// TODO: awaitExample();

// The promisify pattern
const promisifyExample = () => {
	/**
	 * A fake server endpoint call.
	 * @param callback The callback to be called.
	 */
	function mockFetchWithCallback(callback) {
		// Do something (err, value)
		callback(null, "success");
	}

	mockFetchPromisified = () => {
		return new Promise((resolve, reject) => {
			mockFetchWithCallback((error, result) => {
				if (error) {
					reject(`had an error!`);
				} else {
					resolve(`Result: ${result}`);
				}
			});
		});
	};

	mockFetchPromisified().then(console.log);

	const util = require("util");
	const mockFetchPromisifiedUtil = util.promisify(mockFetchWithCallback);
	mockFetchPromisifiedUtil().then(console.log);
};
promisifyExample();
