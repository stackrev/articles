# Micro-frontends - Small Steps to Manageable large Webapps
 <!-- title: Microfrontends - Small Steps to a Modern UI -->
![Image: All fe Logos](banner.jpg "All fe Logos")

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->
- [Micro-frontends - Small Steps to Manageable large Webapps](#micro-frontends---small-steps-to-manageable-large-webapps)
  - [Why use a Microfrontend Setup](#why-use-a-microfrontend-setup)
  - [implementation](#implementation)
- [Code it!](#code-it)
- [Micro Commands for Micro Apps](#micro-commands-for-micro-apps)
  - [React CLI](#react-cli)
  - [Build, Deploy and Run](#build-deploy-and-run)
- [Conclusion](#conclusion)
  - [References](#references)
  - [Github](#github)

Micro-frontend is a design pattern that extends the concepts of microservices to the frontend domain. 

This is done by decomposing the frontend into individual, semi-independent **microapps**. 

## Why use a Microfrontend Setup

1. **Technology Agnostic** - Develope and deploy any stacks. 
2. **Decoupled Teams** - Isolated code and self-contained apps working on the same main app, but different teams.
3. **Native Browser Features** - using Browser Events for communication. 
4. **Resiliance and Consitency** - Through a progressive app, or by apps not affecting each other.

![Image: Architecture diagram from rethink](microarchitecture.jpeg "Architecture diagram from rethink")

## implementation

Micro-frontends are implemented by splitting your UIs, using one of these two methods:
- **Built-time split**: micro apps are seperate npm pacakages, integrated into a parent component. Note that the parent needs to be rebuilt on every microapp change.
- **Run-time split**: Done through routing, and having the microapps as individual nodes loaded through javascript.

If you are an SRE kind of engineer, you see the potential of A/B testing and red/black deployments in the above.

# Code it!

We will use a known framework called **[single-spa](https://single-spa.js.org/)** and build a *runtime spit* micro-frontend.

First, create a root 'macro-app':

`npx create-single-spa --moduleType root-config --framework react --dir root`

Then create a micro-app:

`npx create-single-spa --moduleType app-parcel  --framework react --dir micro`

Look **name** attribute of  the package.json from the micro app name - we will register with this in our root app.

Go to the root app, in the *index.ejs* import our micro app:

```jsx
<script type="systemjs-importmap">
  {
    "imports": {
      ...
      "@radmada/radmada": "http://localhost:8080/radmada-radmada.js"
    }
  }
</script>
```

Still in the root app, go to the *microfrontend-layout.html* and register the micro app:
```jsx
<main>
  <route default>
    ...
    <application name="@radmada/radmada"></application>
  </route>
</main>
```

Finally, execute the root container by running:

`yarn start`

And there, we are running microapps on a micro-frontend framework. We can keep registering more micro-frontends to this root app with the above steps.

Note we are using parcels here, parcels render their own HTML and are not bound to any route. Although simple, the preferred way is to use routes with a build-time micro-frontend.

# Micro Commands for Micro Apps

## React CLI

We bootstrapped this project with [Create React App](https://github.com/facebook/create-react-app), or to summarise:

- `npm install -g create-react-app`
- `npx create-react-app mfe-app --template typescript`
- `yarn add react-router-dom`
- `yarn add typescript @types/node @types/react @types/react-dom @types/jest`
- `yarn start`

## Build, Deploy and Run

- `npm start` - Runs the app in the development mode on [http://localhost:3000](http://localhost:3000).
- `npm test`- Launches a test runner, see [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
- `npm run build` - Builds the app for production to the `build` folder. See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.


# Conclusion

In brief, micro-frontends are series of **mini-apps** as independent modules designed in various frameworks, stored in different code repositories. Which we run in the same webcontainer, sharing code, style and even communicating with each other.

Wait for nano-frontends in five years time!

## References

- https://single-spa.js.org/
- Code Splitting: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)
- Making a Progressive Web App: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)


## Github

Article here is also available on [Github](https://github.com/adamd1985/microfrontend-quickstart)

#
<div align="right">
<p xmlns:cc="http://creativecommons.org/ns#" xmlns:dct="http://purl.org/dc/terms/"><a property="dct:title" rel="cc:attributionURL" href="#">This Article</a> by <a rel="cc:attributionURL dct:creator" property="cc:attributionName" href="https://www.linkedin.com/in/adam-darmanin/">Adam Darmanin</a> is licensed under <a href="http://creativecommons.org/licenses/by-nc-sa/4.0/?ref=chooser-v1" target="_blank" rel="license noopener noreferrer" style="display:inline-block;">CC BY-NC-SA 4.0<img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/cc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/by.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/nc.svg?ref=chooser-v1"><img style="height:22px!important;margin-left:3px;vertical-align:text-bottom;" src="https://mirrors.creativecommons.org/presskit/icons/sa.svg?ref=chooser-v1"></a></p>
</div>