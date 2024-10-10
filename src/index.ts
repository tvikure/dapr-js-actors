import express from 'express';
import { ActorProxyBuilder, DaprServer, DaprClient, ActorId } from "@dapr/dapr";
import { MyActor, IMyActor } from './actors/MyActor';

const app = express();
app.use(express.json());

const daprHost = "127.0.0.1";
const daprPort =  "3500";
const serverPort = "50003";
const serverHost = "127.0.0.1"; 

const server = new DaprServer({
  serverHost,
  serverPort,
  clientOptions: {
  daprHost: daprHost,
  daprPort: daprPort,
  actor: {
    actorIdleTimeout: "1h",
    actorScanInterval: "30s",
    drainRebalancedActors: true,
    reentrancy: {
      enabled: true,
      maxStackDepth: 32,
    },
    remindersStoragePartitions: 0,
  },
}});


const client = new DaprClient({ daprHost, daprPort });

async function start() {

  await server.actor.init();
  server.actor.registerActor(MyActor)
  //wait for 5sec for the actors to get registered
  await new Promise(resolve => setTimeout(resolve, 5000));
  const actors = await server.actor.getRegisteredActors();
  console.log('registered actors ', actors);

  console.log("Starting Dapr server ");
  await server.start();
  console.log("Server started successfully");
}

app.post('/api/createAndStartActors', async (req, res) => {
  const { actorCount } = req.body;

  const actors = await server.actor.getRegisteredActors();
  console.log('registered actors ', actors);

 const builder = new ActorProxyBuilder<IMyActor>(MyActor, client);
  try {
  for (let i = 0; i < actorCount; i++) {
    const actor = builder.build(ActorId.createRandomId());
    
    await actor.start({ name: `actor${i}`
    })
  }
  res.status(200).send('Successfully created actors');
} catch(e) { 
  console.error('error creating actors', e);
  res.status(500).send('Failed to create actors');
}

});

app.listen(3000, () => {
  console.log('Running API server on 3000');
});


start().catch(e => console.error(e));