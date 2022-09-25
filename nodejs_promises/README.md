# Javascript does Asynchronous functions - with a lick and a Promise
 <!-- title: Javascript does Asynchronous functions - with a lick and a Promise  -->
![Image: JS Promises](banner.png "JS Promises")

When ECMA 6 came out for javascript, it promised the moon, in fact it gave us a promises framework to deal with asynchronous code and future values.
It was the promised land for all of us who where in callback hell.

In this article, we will revisit this promise of elegant code again with some nodejs.

# A Simple Promise

Let's start with a basic promise:

```javascript
const simplePromise = new Promise((resolve, reject) => {
		// Do Something....
		// And resolve with a successs
		resolve("SUCCESS!");
	});

	simplePromise
		.then(console.log)
};
```
```bash
node .\nodejs_promises\promises.js
Finished the calls
SUCCESS!
```

A **Promise** comes with a *resolve()* function which when called, the ouput is passed to whatever is chained to its *then()*. All these APIs are fluent, and can chain nicely to each other, as we will see with the examples in this article.

Now say something goes wrong in our asynchronous code - in this example it's done by calling the *reject* function - we have to process it in the *catch()* API:
```javascript
const simplePromise = new Promise((resolve, reject) => {
		// Do Something....
		// And resolve with a successs
		// resolve("SUCCESS!"); - For this example, we skip it.

		// And reject the promise with a failure
		reject("FAILURE!");
	});

	simplePromise
		.then(console.log)
		.catch((error) => console.error(`Failed with: ${error}`))
```
```bash
node .\nodejs_promises\promises.js
Finished the calls
FAILURE!
```

The catch API can also process any thrown errors and exceptions:
```javascript
const simplePromise = new Promise((resolve, reject) => {
		// Do Something....
		// And resolve with a successs
		// resolve("SUCCESS!"); - For this example, we skip it.

		// Rejeection can also happen with an Exception.
		throw new Error("threw Error() to FAIL!");
	});

	simplePromise
		.then(console.log)
		.catch((error) => console.error(`Failed with: ${error}`))
		.finally(console.log("Finished the calls"));
```

We also finished it off with a finally API, finally allows code to run regardless of the final state:
```bash
node .\nodejs_promises\promises.js
Finished the calls
Failed with: Error: threw Error() to FAIL!
```

When a promise gets called, it always starts in a pending state, to be a container for a future value. 
It will continue executing until it resolves - returning data, or is rejected - returning an error object or message.

# A Promise to Better Callbacks

The problem that the promises framework aimed to lesson, the long indentations of code blocks and control statements known as: The Pyramid of Doom!

![Image: Pyramid of Doom](cb-hell.png "Pyramid of Doom")

Let's illustrate this nuisance with this function, which we will use to login a user, pull their old state and save their new state (3 calls in total):
```javascript
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
```

Here is were the pyramid forms. Imagine if you had to chain 10, 20 or 30 calls.

```javascript
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
```

This should print (depending if you get the random failure or not):

```bash
node .\nodejs_promises\promises.js
login completed with: Login was a success!. Now get previous state.
Pulling previous user state: {"user":"joe","state":"was logged out"}.
Exception with promise as caused by: We FAILED!
```

# A Clean Promises

Promises' APIs can be chained together, allowing us to orchestrate the above more elagantly.

We do a minor change to the mock function to return a new **Promise**:, and we use *resolve* or *reject* to control the flow of the promise chain:
```javascript
function mockFetchWithPromise(action) {
  return new Promise((resolve, reject) => {
    ...

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
```

Here is the same flow from our last section, but without the pyramid of doom:
```javascript
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
```

That is a sight for our sore eyes, after hours in front of the IDE.

# Promises to Orchestrate

Let's assume that during the user's login, we also want to open a pipe to supply analytics on their usage, and show them some  ads. Not necessarily in any order, nor all required. 
We don't want to fall back to the callback hell again with too many conditions. Thankfully we have APIs to keep organized in the form of **Promise.all()**, **Promise.any()**, **Promise.race()** .

Starting with loging in the user and supplying analytics, we want these 2 to always happen before any other action:

```javascript
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

Promise.all([mockAction("login"), mockAction("analytics")])
  .then(([loginResult, analyticsPipeResult]) => {
    console.log(
      `Login succeed with: ${loginResult} AND Analytics pipe was opened with: ${analyticsPipeResult}`
    );
  })
  .catch((cause) => {
    console.log(`Exception with promise as caused by: ${cause}`);
  });
```


With ads, we have a different strategy. Given we have 3 different ad-vendors, for us it doesn't matter who is currently supplying or even if they all are supplying, we just need one to give us that ad revenue. Though it's not critical to have ads, we still want to act on it if we see all have failed. 

To do this, we will use the *any()* API, which runs a callback if any of our promises settles, or all fail:


```javascript
// Test the promise here.
Promise.any([mockAction("ad1"), mockAction("ad2"), mockAction("ad2")])
  .then((result) => {
    console.log(`Result: ${result}`);
  })
  .catch((cause) => {
    console.log(`Exception with promise as caused by: ${cause}`);
  });
```

In the output, we see that ad1 failed, but ad2 succeeded - as long as all 3 don't fail, the catch callback will never be called:

```bash
node .\nodejs_promises\promises.js
Result: Action: ad2 Succeeded
```

A different variant of *any()* is *race()*. The *race()* api will hit a callback if the first to settle is either a success or a failure. 
The difference between these two is the way they **short-circuit**:
-  *any()* short-circuits on the first resolved
-  *race()* short-circuits on the first settled (being either a resolved or rejected result).

Let's orchestrate all these promises together:

```javascript
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
```

And our promises will resolve with these set of results:

```bash
node .\nodejs_promises\promises.js
Result: Action: login Succeeded,Action: analytics Succeeded,Action: ad1 Succeeded
```

The required flows have both resolved, while from the ad flows, only ad1 resolved which is enough for us to run knowingly with one set of ads.

# Good Things come to those who AWAIT

Javascript loved the idea of promises and how clear the code was getting, and with ES2017 released the **async** and **await** constructs.
These are a higher level abstraction than promises, but built on a combination of promises and generators.

We will reuse the same *mockAction* function from the last section, but alter the way it gets resolved:
```javascript
function mockAction(action) {
		return new Promise((resolve, reject) => {
			....
		});
	}

	let requiredPromises = async () => console.log(await mockAction("login"));

	requiredPromises();
```

No more *then()*, *except()* or *finally()* callbacks, we are calling asynchronous functions as if they were a single instruction.
Using the **await** construct, the program flow will halt until the promise returns - but for us to use it, we need to be in a function tagged with **async**, or in the above case, a anonymous arrow function.

Note that prepending async to any function, means it returns a promise:

```javascript
let someFunction = async () => "nothing really";
someFunction().then((result) =>
  console.log(`What did it do asynchronously? ${result}`)
);
```

# Don't Except Callback Legacy, Promisify!

Promises and await make the code so much cleaner. But what if you are using another's legacy callback-ridden library? 

We have to use the promisify pattern. Example here is an ugly callback from our first section:

```javascript
/**
 * A fake server endpoint call.
 * @param callback The callback to be called.
 */
function mockFetchWithCallback(callback) {
  // Do something (err, value)
  callback(null, "success");
}

mockFetchWithCallback((error, result) => console.log(`Result: ${result}`));
```

Most callbacks in nodejs have the *(error, value)* signature. This is shared across the javascript API contract space.

Let's modernize it with a promise wrapper:
```javascript
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
```

Being good engineers, we don't want to write extra boiler plate code, so many frameworks come with their own promisify utility. This example uses node's (remember from above, it needs the error and value signature to work):

```javascript
const util = require("util");

const mockFetchPromisifiedUtil = util.promisify(mockFetchWithCallback);
mockFetchPromisifiedUtil().then(console.log);
```

That's another victory over boiler plate code!

# Conclusion

In this article we revised the Promises framework in ECMA 6 and above javascript. We understood the basics of a Promise and its various APIs.
In addition, we learned that we can modern legacy callback APIs with promisify patterns, making our code simpler and more fluent.

## References

- https://nodejs.org/en/
- https://nodejs.org/docs/latest-v11.x/api/util.html#util_util_promisify_original


## Github

Code in this article is available on [Github](https://github.com/adamd1985/vue-nuxt-gh-static-landingpage).

#

<div align="right">
<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="#">This Article</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/adam-darmanin/">Adam Darmanin</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>
</div>