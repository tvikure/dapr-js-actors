### dapr-js-actors (not working in kubernetes)

This is a simple dapr side car actor app to demonstrate timers in actors

### Setup needed. 

1. Docker desktop
2. Kubernetes enabled in docker desktop
3. kubectl
4. helm


### buid and push the docker image to your docker hub

1. docker build -t my-js-actor-app .
2. docker tag my-js-actor-app <replace your docker hub repo name>/my-js-actor-app:latest
3. docker push <replace your docker hub repo name>/my-js-actor-app:latest

### Create a docker hub secret

kubectl create secret docker-registry myregistrykey \
  --docker-server=https://index.docker.io/v1/ \
  --docker-username=<your user name> \
  --docker-password=<your docker hub password> \
  --docker-email=<registed email from docker hub> \
  --namespace=default

### install dapr environment in kubernetes

  helm upgrade --install dapr dapr/dapr \
--version=1.14.4 \
--namespace dapr-system \
--create-namespace \
--wait


### install redis to actor support.

helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update
helm install my-redis bitnami/redis

Remember to set the redis password in redis-state

### deploy redis component

kubectl apply -f redis-state.yaml

### deploy node js app with side car

kubectl apply -f deployment.yaml









