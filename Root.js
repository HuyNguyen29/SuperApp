import * as React from "react";
import { AppRegistry, Text, Platform, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ChunkManager } from "@callstack/repack/client";
import AsyncStorage from "@react-native-async-storage/async-storage";

ChunkManager.configure({
  storage: AsyncStorage,
  forceRemoteChunkResolution: true,
  resolveRemoteChunk: async (chunkId, parentId) => {
    let url;
    // when the version change, ChunkManager will download new chunk bundle
    // We can control the version number with BE when mini app have code change
    const version = "v1";
    switch (parentId) {
      case "app1":
        url = `https://disprzblobindia.blob.core.windows.net/skilltronassetspublic/appTest/miniapp/${version}/${chunkId}.chunk.bundle`;
        break;
      case "main":
      default:
        url =
          {
            // containers
            app1: `https://disprzblobindia.blob.core.windows.net/skilltronassetspublic/appTest/miniapp/${version}/app1.container.bundle`,
          }[chunkId] ??
          `https://disprzblobindia.blob.core.windows.net/skilltronassetspublic/appTest/miniapp/${version}/${chunkId}.chunk.bundle`;

        break;
    }
    return {
      url: `${url}?platform=${Platform.OS}`,
      excludeExtension: true,
    };
  },
});

async function loadComponent(scope, module) {
  // Initializes the share scope. This fills it with known provided modules from this build and all remotes
  await __webpack_init_sharing__("default");
  // Download and execute container
  await ChunkManager.loadChunk(scope, "main");

  const container = self[scope];

  // Initialize the container, it may provide shared modules
  await container.init(__webpack_share_scopes__.default);
  const factory = await container.get(module);
  const exports = factory();
  return exports;
}

const App1 = React.lazy(() => loadComponent("app1", "./App.js"));

function App1Wrapper() {
  return (
    <React.Suspense
      fallback={<Text style={{ textAlign: "center" }}>Loading...</Text>}
    >
      <App1 />
    </React.Suspense>
  );
}

const Tab = createBottomTabNavigator();

export function Root() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="App1">
        <Tab.Screen name="App1" component={App1Wrapper} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
