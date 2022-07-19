# Kubernetes - Your First Steps into Power and Scale

 <!-- title: Kubernetes - First Steps into Power and Scale -->
![Image: Kubernetes Logo](banner.png "Kubernetes Logo")

- [Kubernetes - Your First Steps into Power and Scale](#kubernetes---your-first-steps-into-power-and-scale)
  - [The Orchestrator that Drives the World](#the-orchestrator-that-drives-the-world)
- [K8S Architecture and Key Components](#k8s-architecture-and-key-components)
  - [The Masters](#the-masters)
    - [The Anatomy of a Master](#the-anatomy-of-a-master)
  - [The Workers](#the-workers)
    - [The Workers' Companions](#the-workers-companions)
- [Let's Play - Starting a Local K8S](#lets-play---starting-a-local-k8s)
  - [Spinning a Cluster](#spinning-a-cluster)
    - [Imperative Pods](#imperative-pods)
    - [Declarative Pods](#declarative-pods)
- [Take the Helm and Build Automation](#take-the-helm-and-build-automation)
  - [Start a Quick Cluster with Helm](#start-a-quick-cluster-with-helm)
- [Conclusion](#conclusion)
  - [References](#references)
  - [Github](#github)

## The Orchestrator that Drives the World

Kubernetes, or **K8S** as known amongst _l33t_ crowd, is a container execution engine that is the defacto backbone of most modern and scalable information infrastructure  out there. Think of Google's massive *Borg* or *Omega* systems running all their information system, *K8S* is their smaller and opensource cousin.

In this article, we will go through some of its concepts and run our own personal kubernetes to get a feel of the technology. 

For those who want to jump directly into steering their own cluster, spin the infrastructure by following the [Helm section](#quick-cluster-with-helm) at the end of this article.

# K8S Architecture and Key Components

A picture says a thousand words, so let's have it:

![Image: Kubernetes Architecture](kubernetes-cluster-architecture.png "Kubernetes Architecture")

There are 2 major groups in a K8S cluster: masters and workers. We will elaborate each below.

## The Masters

A master is a node that sits in the **control plane** and has access with direct control of its cluster's members. 

Masters come in odd numbers, with a recommended quorum of `Nodes/2 + 1` as they need to be able to elect 1 master to control all. They do this by voting, and the one with the majority is the cluster's active master. If they had even numbers, they would come to a situation known as **split-brain**, a deadlock were a single master cannot be elected.

Although scale and highly-availability is a thing we need, masters operate in a **active-passive multi-master model**. This means - *there shall be ONLY ONE!* - that is, the passive masters only proxy requests to the active and unique leader.

This control plane is the *single source of truth* of the entire cluster, no matter the size or distribution.

### The Anatomy of a Master

1. **kube-apiserver**: The API frontend of the control plane. It is responsible for handling external and internal requests. It can be accessed via the *kubectl* CLI or standard REST calls.
2. **kube-scheduler**: This schedules pods on specific nodes according to workflows and user defined conditions.
3. **kube-controller-manager**: A control loop that monitors and regulates the state of a Kubernetes cluster. By receiving information about the current state it can send instructions to move the cluster towards the desired state. 
4. **etcd**: A fault-tolerant key-value database that contains data about states and configuration. This component is of the utmost importance, and itself is sometimes set in its own highly-available setup.

There are the **service-mesh** components which abstract away the complexities of the network through the use of component sidecars. Though these are beyond the scope of this article.

## The Workers

Members of the data plan, these are nodes (VMs or any other form of compute) which get work scheduled to them and carry out the control plane's policies. These nodes run pods as part of the K8S cluster. A cluster can have up to 5k nodes.

### The Workers' Companions

1. **Pods**: A single application instance, and the smallest unit in Kubernetes. Each pod consists of one or more tightly coupled containers and their sidecars if any.
2. **Container Runtime Engine**: For most of us, this is just Docker (there can be other container runtimes).
3. **kubelet**: This is a small application that can communicate with the Kubernetes control plane. Note that in some literature, nodes and kubelets are used interchangeably.
4. **kube-proxy**: A network proxy that facilitates Kubernetes networking services. It handles all network communications outside and inside the cluster.

# Let's Play - Starting a Local K8S

Now that you know what-does-what in K8S, it's time to install a local K8S cluster and run stuff on it.

## Spinning a Cluster

To embark on this journey, we will install 3 tools (assuming you are on windows and have chocolately):
- kubectl: `choco install kubectl` - The cli to interact with the cluster.
- minikube `choco install minikube` - A simple local k8s on your container/vm manager (e.g. Docker, Hyper-V, VirtualBox).
- Helm (OPTIONAL): `choco install kubernetes-helm` - A package manager and automation for k8s-ready software. 

We can initiate a small cluster with command below, which will create a cluster of 1 nodes with some limits to using our hosts' resources:

`minikube start --memory 8192 --cpus 2`

This dockerfile describes a simple nodejs server:
```dockerfile
FROM node:alpine3.15

COPY ./app /app
RUN cd /app; npm install
EXPOSE 8080

CMD cd /app && npm star
```

let's use it to test K8s. Start by building it:
`docker build -t helloworld:1 .`

Test it (access your localhost:8080):
`docker run --rm -d -p 8080:8080 --name=helloworld helloworld:1`

and stop it:
`docker stop helloworld`

To test k8s *we can skip pushing to a public registry* (if you are pushing to a registry like DockerHub, you can skip this). We do this by running the command in minikube `minikube docker-env`, which prints out this info:
```bash
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST=”tcp://172.17.0.2:2376"
export DOCKER_CERT_PATH=”/home/user/.minikube/certs”
export MINIKUBE_ACTIVE_DOCKERD=”minikube”

# To point your shell to minikube’s docker-daemon, run:
# eval $(minikube -p minikube docker-env)
# & minikube -p minikube docker-env --shell powershell | Invoke-Expression
```
According to your operating system, point your shell to the docker daemon as show above. 

Build again the image using the `docker build` from the command prompt that ran the command above, and we have now placed the image in the minikube registry which you can use with the **Pods**.

With K8S we have 2 methods of deploying pods: *Imperative* and *Declarative*.

### Imperative Pods

This is done through individual kubectl commands at every step.

Start by building the pod using: `kubectl run helloworld --image='helloworld:1'`. We can check our creations with the command `kubectl get pods helloworld`, which gives us these results:

```bash
NAME         READY   STATUS    RESTARTS   AGE
helloworld   1/1     Running   0          34m
```
Or a more in depth check using the command `kubectl describe pod helloworld`:
```yaml
Name:         helloworld
Namespace:    default
Node:         minikube/192.168.49.2
...
Containers:
  helloworld:
    Container ID:   docker://1060f41d6764342dcfdf3234e12f3c70164f74a884fdb6b19f2e5e1407514d47
    Image:          helloworld:1
    Image ID:       docker://sha256:a5054ae07993d2a0583f1b4787be40a28c3b2be7a2aa9cc026f21ab5e9c214ba
    ...
Conditions:
  Type              Status
  Initialized       True
  Ready             True
  ContainersReady   True
  PodScheduled      True
...
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  18m   default-scheduler  Successfully assigned default/helloworld to minikube
  Normal  Pulled     18m   kubelet            Container image "helloworld:1" already present on machine
  Normal  Created    18m   kubelet            Created container helloworld
  Normal  Started    18m   kubelet            Started container helloworld
```

Then we expose the pod by the command: `kubectl expose pod helloworld --type=NodePort --port=8080`, to know what to access to test our underlying node image.

Run `kubectl get svc helloworld` to get this info (note the no external IP):

```bash
NAME         TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
helloworld   NodePort   10.99.103.128   <none>        8080:32023/TCP   4m51s
```

We need a **public IP** to access this pod, luckily minkube provides it through the command: `minikube service helloworld --url`. 
Browsing to this url will give you this site below:

![Image: Output](website.png "Output")

With all this done, let's clean up all items created. First we list these items with the command `kubectl get all`, which prints this:

```bash
NAME             READY   STATUS    RESTARTS   AGE
pod/helloworld   1/1     Running   0          39m

NAME                 TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
service/helloworld   NodePort    10.99.103.128   <none>        8080:32023/TCP   23m
service/kubernetes   ClusterIP   10.96.0.1       <none>        443/TCP          56m
```

We see that there is a pod and service for helloworld. Delete these:
- `kubectl delete services helloworld`
- `kubectl delete pods helloworld`

Run `kubectl get all` and your cluster is now all clean.

### Declarative Pods

Declarative is the proper way to do things, and leads to proper automation and consistency of setups - the SREs and CI/CDs of great engineering teams.

**YAML files** are the bread and butter of this method of setup, starting with the *deployment.yaml*:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helloworld
  labels:
    app: helloworld
spec:
  replicas: 3
  selector:
    matchLabels:
      app: helloworld
  template:
    metadata:
      labels:
        app: helloworld
    spec: 
      terminationGracePeriodSeconds: 1
      containers:
      - name: helloworld
        image: helloworld:1
        ports:
          - containerPort: 8080
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"

```
This file is deployed using the command: `kubectl apply -f .\deployment.yml`. 

Use the same checks in the above section to verify the pod, or check the deployment itself and the replicas, with the command: `kubectl describe deployments helloworld`:

```bash
Name:                   helloworld
Namespace:              default
Labels:                 app=helloworld
Selector:               app=helloworld
Replicas:               3 desired | 3 updated | 3 total | 3 available | 0 unavailable
StrategyType:           RollingUpdate
RollingUpdateStrategy:  25% max unavailable, 25% max surge
Pod Template:
  Labels:  app=helloworld
  Containers:
   helloworld:
    Image:      helloworld:1
    Port:       8080/TCP
    Host Port:  0/TCP
 ...
Conditions:
  Type           Status  Reason
  ----           ------  ------
  Available      True    MinimumReplicasAvailable
  Progressing    True    NewReplicaSetAvailable
OldReplicaSets:  <none>
NewReplicaSet:   helloworld-6b845f4659 (3/3 replicas created)
Events:
  Type    Reason             Age   From                   Message
  ----    ------             ----  ----                   -------
  Normal  ScalingReplicaSet  115s  deployment-controller  Scaled up replica set helloworld-6b845f4659 to 5
```

Note that 3 replicas of our webapp are in the cluster. Since we have multiple pods serving the same app, we cannot use a direct NodePort anymore, we will need a **loadbalancer**.

Good for us that we have a loadbalancer *service.yaml* file right here (note the app name and labels it will affect):
```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld-lb
  labels:
    app: helloworld
spec:
  type: LoadBalancer
  ports:
  - port: 8080
    targetPort: 8080
  selector:
    app: helloworld
```

Deploy this service using the command: `kubectl apply -f .\service-lb.yml`, and check that everything is good by running the command: `kubectl get svc helloworld-lb`, which will show us this information:

```bash
NAME            TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
helloworld-lb   LoadBalancer   10.108.238.242   <pending>     8080:32694/TCP   6s
```
 
But the *external IP* is pending? What does this mean?

The Loadbalancecr is not a NodePort mapping, so we don't have a url to a node to directly access it. 

In our case, we need `minikube tunnel`. This exposes all services of type **LoadBalancer** - though you need to keep it *opened in a separate window* as it's a long running CLI program.

With tunnel running, executing the command: `kubectl get svc helloworld-lb`, which will show us a different result with an external port we can use:

```bash
NAME            TYPE           CLUSTER-IP       EXTERNAL-IP   PORT(S)          AGE
helloworld-lb   LoadBalancer   10.108.238.242   127.0.0.1     8080:32694/TCP   3m39s
```

Going to *127.0.0.1:8080* will hit one of the nodes, the web page (same as the image above) will show an IP of one of these (run with command: ` kubectl get pods -o wide`):

```bash
NAME                                 READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
helloworld-deploy-6b845f4659-fbvbq   1/1     Running   0          10m   172.17.0.5   minikube   <none>           <none>
helloworld-deploy-6b845f4659-msvch   1/1     Running   0          10m   172.17.0.6   minikube   <none>           <none>
helloworld-deploy-6b845f4659-sc5st   1/1     Running   0          17m   172.17.0.4   minikube   <none>           <none>
```

To truly test the loadbalancer and K8S' self healing capabilities, try to **delete the current hosted** node using the command: `kubectl delete pods [NODE-NAME]` - you will need to replace the name with the ones in the *name column* from the results printed in ` kubectl get pods -o wide`. 

Everytime you delete a node, you can follow its status with the command: `kubectl get rs -o wide` which should show this:

```bash
NAME                           DESIRED   CURRENT   READY   AGE   CONTAINERS   IMAGES         SELECTOR
helloworld-deploy-6b845f4659   3         3         3       26m   helloworld   helloworld:1   app=helloworld,pod-template-hash=6b845f4659
```

To see all endpoint affected by the loadbalancer service, run the command `kubectl get ep -o wide`:

```bash
NAME            ENDPOINTS                                         AGE
helloworld-lb   172.17.0.4:8080,172.17.0.5:8080,172.17.0.6:8080   8m12s
kubernetes      192.168.49.2:8443                                 143m
```

# Take the Helm and Build Automation

![Image: Helm Logo](helm.png "Helm Logo")

We are not yet done. In the tooling section we mentioned an optional tool called **Helm**. Helm is a package manager that allows you to save and reinstall entire configurations.

Start by creating an empty helm chart: `helm create helloworldchart`. This will create a tree of template files in your folder. 
If you open one, they all look like your service and deployment yamls, with one difference - these come with parameterized values.

Every helm tree starts with a chart file, in our case this is what we need to update the given *Chart.yml*:
```yml
apiVersion: v2
name: helloworldchart
description: A Helm chart for Kubernetes article.

type: application
version: 0.1.0
appVersion: "1.16.0"
```

We also have a *deployment.yaml* (note the parameterization here):
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: helloworld-deploy
  labels:
    app: helloworld
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels:
      app: helloworld
  template:
    metadata:
      labels:
        app: helloworld
    spec:
      terminationGracePeriodSeconds: 1
      containers:
        - name: helloworld
          image: {{ .Values.image }}
          ports:
            - containerPort: {{ .Values.port }}
          resources:
            requests:
              memory: {{ .Values.resources.requests.memory }}
              cpu: {{ .Values.resources.requests.cpu }}
            limits:
              memory: {{ .Values.resources.limits.memory  }}
              cpu: {{ .Values.resources.limits.cpu }}
```

and the *service.yaml*:
```yaml
apiVersion: v1
kind: Service
metadata:
  name: helloworld-lb
  labels:
    app: helloworld
spec:
  type: LoadBalancer
  ports:
    - port: {{ .Values.port }}
      targetPort: {{ .Values.port }}
  selector:
    app: helloworld
```

All the parameters above will be satisfied with a default *values.yaml*:
```yaml
replicaCount: 3

resources:
  limits:
    cpu: 100m
    memory: 128Mi
  requests:
     cpu: 100m
     memory: 128Mi

port: 8080

image: helloworld:1
```

Run the command `helm lint helloworldchart` to make sure we have everything in order. We can dry run a helm chart using the command: `helm template --debug helloworldchart`. 

All other files in the helm directory, can be deleted.

## Start a Quick Cluster with Helm

With everything set, make sure you have a clean kubernetes cluster and let's install the helm chart using the command: `helm install -f helloworldchart/values.yaml helloworldchart ./helloworldchart/`.

Finally, to return our cluster back to a clean state, we delete our whole setup using: `helm delete helloworldchart`

That's really all, a clean and fast automation. The helm files are located in this article's repo for you to use out-of-the-box.

# Conclusion

Kubernetes gives us so much power in our hands, how can we not be excited about the future!
We can create a cluster, deploy apps in pods, make these scalable and self-healing while balancing their network loads.

Don't forget to clean up your system with `minikube delete --all`

## References

- https://kubernetes.io/docs/concepts/overview/components/
- https://docs.docker.com/engine/reference/commandline/build/
- https://expressjs.com/en/starter/hello-world.html
- https://helm.sh/docs/intro/quickstart/

## Github

Article here is also available on [Github](https://github.com/adamd1985/articles/tree/main/k8s_firststeps)

#

<div align="right">Made with :heartpulse: by <b>Adam</b></div>